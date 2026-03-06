import FirecrawlApp from "@mendable/firecrawl-js";

const apiKey = process.env.FIRECRAWL_API_KEY;

let firecrawlApp = null;

function getFirecrawl() {
    if (!firecrawlApp) {
        if (!apiKey) {
            throw new Error("FIRECRAWL_API_KEY není nastaven. Přidejte ho do .env.local");
        }
        firecrawlApp = new FirecrawlApp({ apiKey });
    }
    return firecrawlApp;
}

/**
 * Scrape a single URL using FireCrawl API.
 * Returns clean markdown + metadata (including og:image).
 * Deterministic: no LLM calls, pure HTTP scrape.
 */
export async function scrapeUrl(url) {
    const app = getFirecrawl();

    try {
        // Handle different versions of firecrawl-js (some need .v1)
        const scrapeMethod = (app.scrapeUrl || (app.v1 && app.v1.scrapeUrl))?.bind(app.v1 || app);

        if (typeof scrapeMethod !== "function") {
            throw new Error("Metoda scrapeUrl nebyla v knihovně FireCrawl nalezena.");
        }

        const result = await scrapeMethod(url, {
            formats: ["markdown"],
        });

        if (!result.success) {
            throw new Error(
                `FireCrawl scrape failed for ${url}: ${result.error || "Neznámá chyba"}`
            );
        }

        // Extract og:image or first image from metadata
        const metadata = result.metadata || {};
        const ogImage =
            metadata.ogImage ||
            metadata.og_image ||
            metadata["og:image"] ||
            metadata.image ||
            metadata.twitterImage ||
            null;

        return {
            success: true,
            markdown: result.markdown || "",
            metadata,
            ogImage,
            url,
        };
    } catch (error) {
        console.error(`[FireCrawl] Error scraping ${url}:`, error.message);
        return {
            success: false,
            markdown: "",
            metadata: {},
            ogImage: null,
            url,
            error: error.message,
        };
    }
}
