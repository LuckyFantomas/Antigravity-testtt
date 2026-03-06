import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { scrapeUrl } from "@/lib/firecrawl";
import { translateArticle } from "@/lib/gemini";

/**
 * POST /api/scrape
 * Scrapuje aktivní zdroje pomocí FireCrawl a ukládá články do Supabase.
 *
 * Body: { source_id?: string } — volitelně scrapovat konkrétní zdroj
 */
export async function POST(request) {
    const startTime = Date.now();
    const results = { scraped: 0, errors: 0, articles: 0, details: [] };

    try {
        const body = await request.json().catch(() => ({}));
        const specificSourceId = body.source_id;

        // Získat zdroje ke scrapování
        let query = supabase.from("sources").select("*");

        if (specificSourceId) {
            query = query.eq("id", specificSourceId);
        } else {
            query = query.eq("is_active", true);
        }

        query = query.order("priority", { ascending: true });

        const { data: sources, error: sourcesError } = await query;

        if (sourcesError) throw sourcesError;
        if (!sources || sources.length === 0) {
            return NextResponse.json({
                success: true,
                message: "Žádné aktivní zdroje ke scrapování",
                results,
            });
        }

        // Scrapovat každý zdroj
        for (const source of sources) {
            try {
                const scrapeResult = await scrapeUrl(source.url);

                if (!scrapeResult.success) {
                    results.errors++;
                    results.details.push({
                        source: source.name,
                        status: "error",
                        error: scrapeResult.error,
                    });
                    continue;
                }

                // Extrahovat články z markdownu
                let articles = extractArticlesFromMarkdown(
                    scrapeResult.markdown,
                    source,
                    scrapeResult.ogImage
                );

                // Přeložit články pomocí Gemini API (asynchronní paralelní překlad)
                if (articles.length > 0) {
                    articles = await Promise.all(
                        articles.map((article) => translateArticle(article))
                    );
                }

                // Uložit články do Supabase
                if (articles.length > 0) {
                    const { error: insertError } = await supabase
                        .from("articles")
                        .insert(articles);

                    if (insertError) {
                        console.error(
                            `[Scrape] Chyba ukládání článků pro ${source.name}:`,
                            insertError
                        );
                        results.errors++;
                        results.details.push({
                            source: source.name,
                            status: "save_error",
                            error: insertError.message,
                        });
                        continue;
                    }
                }

                // Aktualizovat last_scraped_at
                await supabase
                    .from("sources")
                    .update({ last_scraped_at: new Date().toISOString() })
                    .eq("id", source.id);

                results.scraped++;
                results.articles += articles.length;
                results.details.push({
                    source: source.name,
                    status: "ok",
                    articlesCount: articles.length,
                });
            } catch (sourceError) {
                results.errors++;
                results.details.push({
                    source: source.name,
                    status: "error",
                    error: sourceError.message,
                });
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        return NextResponse.json({
            success: true,
            message: `Scrapováno ${results.scraped} zdrojů, nalezeno ${results.articles} článků za ${duration}s`,
            results,
        });
    } catch (err) {
        console.error("[API /scrape POST]", err);
        return NextResponse.json(
            { success: false, error: err.message, results },
            { status: 500 }
        );
    }
}


/**
 * Extrahuje článkové sekce ze scrapovaného markdown obsahu.
 * Deterministické: používá vzory nadpisů a odkazů, žádné LLM.
 */
function extractArticlesFromMarkdown(markdown, source, fallbackImage = null) {
    if (!markdown || markdown.length < 50) return [];

    const articles = [];
    const now = new Date().toISOString();

    // Čištění markdownu pro shrnutí - ultra agresivnější verze
    const cleanMarkdown = (text) => {
        if (!text) return "";
        return text
            .replace(/!\[.*?\]\([^\)]+\)/g, '')      // Odstranit markdown obrázky
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [text](url) -> text
            .replace(/(\*\*|__)(.*?)\1/g, '$2')      // bold
            .replace(/(\*|_)(.*?)\1/g, '$2')         // italic
            .replace(/`([^`]+)`/g, '$1')             // inline code
            .replace(/<[^>]*>?/gm, '')               // HTML tagy
            .replace(/^[#>\-*\s]+/gm, '')            // Odstranit heading markers, blockquotes nazačátku řádků
            .replace(/[#*~|>]/g, '')                 // Odstranit zbylé markdown znaky
            .replace(/&[a-z0-9#]+;/gi, ' ')          // Odstranit HTML entity
            .replace(/\s+/g, ' ')                    // Normalizovat mezery
            .trim();
    };

    const isJunk = (text) => {
        if (!text) return true;
        const lower = text.toLowerCase();
        const junkWords = [
            "subscribe", "join", "newsletter", "paper-plane-tilt",
            "view more", "read more", "click here", "podcast",
            "rowan's notes", "latest episode", "see more episodes",
            "sponsor", "advertisement", "merch", "shop", "follow us",
            "copyright", "all rights reserved", "sign in", "try it now",
            "check out", "listen now", "get the latest", "your email",
            "privacy policy", "terms of service", "unsubscribe"
        ];

        // Pokud obsahuje junk slova
        if (junkWords.some(word => lower.includes(word))) return true;

        // Pokud je to jen krátký výkřik nebo metadata
        if (text.length < 15) return true;

        // Pokud obsahuje příliš mnoho speciálních znaků po vyčištění
        const cleaned = cleanMarkdown(text);
        if (cleaned.length < 15) return true;

        return false;
    };

    // Strategie 1: Rozdělit podle nadpisů (## nebo ###)
    const headingPattern = /^#{2,3}\s+(.+)$/gm;
    const sections = markdown.split(headingPattern);

    if (sections.length > 2) {
        for (let i = 1; i < sections.length; i += 2) {
            let rawTitle = sections[i]?.trim();
            const body = sections[i + 1]?.trim() || "";

            const cleanTitle = cleanMarkdown(rawTitle);
            if (!cleanTitle || isJunk(cleanTitle)) continue;

            // Extrahovat první URL ze sekce, které není generic
            const urlMatches = [...body.matchAll(/\[.*?\]\((https?:\/\/[^\s)]+)\)/g)];
            let articleUrl = null;

            for (const match of urlMatches) {
                const url = match[1];
                if (url !== source.url && !url.includes("referral") && !url.includes("/p/") && !url.includes("subscribe") && !url.includes("beehiv")) {
                    articleUrl = url;
                    break;
                }
            }

            // Extrahovat obrázek ze sekce
            const imageMatch = body.match(
                /!\[.*?\]\((https?:\/\/[^\s)]+)\)/i
            );
            const imageUrl = imageMatch ? imageMatch[1] : fallbackImage;

            // Shrnutí z prvních řádků (max 300 znaků)
            const rawSummary = body
                .split("\n")
                .filter(
                    (line) =>
                        line.trim() &&
                        !line.startsWith("#") &&
                        !line.startsWith("!")
                )
                .slice(0, 3)
                .join(" ");
            const summary = cleanMarkdown(rawSummary).substring(0, 300);

            if (summary.length > 20) {
                articles.push({
                    source_id: source.id,
                    source_name: source.name,
                    title: cleanMarkdown(cleanTitle).substring(0, 200),
                    summary,
                    url: articleUrl,
                    image_url: imageUrl,
                    content_markdown: body.substring(0, 5000),
                    scraped_at: now,
                    tags: [source.source_type],
                });
            }
        }
    }

    // Strategie 2: Fallback
    if (articles.length === 0 && markdown.length > 100) {
        const globalImageMatch = markdown.match(
            /!\[.*?\]\((https?:\/\/[^\s)]+)\)/i
        );
        const imageUrl = globalImageMatch ? globalImageMatch[1] : fallbackImage;

        const summaryLines = markdown
            .split("\n")
            .map(l => l.trim())
            .filter(l => l && !l.startsWith("!") && !isJunk(l))
            .slice(0, 6);

        const cleanSummary = cleanMarkdown(summaryLines.join(" ")).substring(0, 300);
        const firstLine = markdown
            .split("\n")
            .find((l) => l.trim() && !l.startsWith("!"))
            ?.replace(/^#+\s*/, "")
            .trim();

        if (cleanSummary.length > 50 && !isJunk(cleanSummary)) {
            articles.push({
                source_id: source.id,
                source_name: source.name,
                title: cleanMarkdown(firstLine)?.substring(0, 200) || source.name,
                summary: cleanSummary,
                url: source.url,
                image_url: imageUrl,
                content_markdown: markdown.substring(0, 5000),
                scraped_at: now,
                tags: [source.source_type],
            });
        }
    }

    // Odstranit duplicity podle názvu
    const seenTitles = new Set();
    return articles.filter(a => {
        if (seenTitles.has(a.title)) return false;
        seenTitles.add(a.title);
        return true;
    }).slice(0, 20);
}
