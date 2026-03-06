import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;
let model = null;

function getGeminiModel() {
    if (!genAI) {
        if (!apiKey) {
            console.warn("[Gemini] GEMINI_API_KEY není nastaven! Překlady budou přeskočeny.");
            return null;
        }
        genAI = new GoogleGenerativeAI(apiKey);
        // Using flash for fast, low latency translations
        model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.1, // Keep translation literal and precise
                responseMimeType: "application/json",
            }
        });
    }
    return model;
}

/**
 * Translates article properties (title, summary, markdown) to Czech.
 * Deterministic fallback behavior on failure.
 * 
 * @param {Object} article Object containing title, summary, content_markdown
 * @returns {Object} Article object with translated fields
 */
export async function translateArticle(article) {
    const aiModel = getGeminiModel();

    if (!aiModel || !article) {
        return article;
    }

    try {
        const prompt = `
You are a professional Czech technical translator and technical writer.
Translate and summarize the following English tech news article into highly readable, natural Czech.
Keep all Markdown formatting, URLs, and code blocks exactly intact in the 'content_markdown' field.

Create the JSON with these exact requirements:
1. "title": Exact translation of the original title into Czech.
2. "summary": Create a comprehensive, engaging summary of the article in Czech. It MUST be a detailed paragraph of exactly 5 to 10 sentences. Do not make it too short.
3. "content_markdown": Translate all text but preserve ALL markdown syntax exactly (like #, *, [], (), etc.).

Here is the source data in JSON:
${JSON.stringify({
            title: article.title,
            summary: article.summary,
            content_markdown: article.content_markdown
        })}

Return ONLY a valid JSON object with the exact same keys: "title", "summary", "content_markdown". No markdown wrapping (like \`\`\`json). Just the JSON string.
`;
        const result = await aiModel.generateContent(prompt);
        const responseText = result.response.text();

        // Safely parse the JSON response
        let translatedData;
        try {
            translatedData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("[Gemini] Failed to parse translation JSON:", parseError);
            console.error("Raw text was:", responseText);
            return article; // Fallback to original
        }

        // Validate structure
        if (translatedData.title && translatedData.summary && translatedData.content_markdown) {
            return {
                ...article,
                title: translatedData.title,
                summary: translatedData.summary,
                content_markdown: translatedData.content_markdown,
                tags: [...(article.tags || []), "translated_cz"] // Optional marker
            };
        } else {
            console.warn("[Gemini] Translation returned missing fields, falling back.");
            return article;
        }

    } catch (error) {
        console.error(`[Gemini] Translation error for article "${article.title}":`, error.message);
        return article; // Fallback to original English on any API failure
    }
}
