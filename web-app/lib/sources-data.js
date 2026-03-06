/**
 * Seed data for the 15 AI news sources from architecture/sources.md.
 * This is used to populate Supabase on first run, or as fallback
 * when Supabase is not yet configured.
 */
export const SOURCES_SEED = [
    {
        name: "The Rundown AI",
        url: "https://www.therundown.ai/",
        source_type: "newsletter",
        frequency: "daily",
        language: "EN",
        subscribers: "2M+",
        description:
            "Největší AI newsletter na světě. Denní 5minutové shrnutí nejdůležitějších AI novinek, praktických use-casů a doporučení nástrojů.",
        is_active: true,
        priority: 1,
    },
    {
        name: "Superhuman AI",
        url: "https://www.superhuman.ai/",
        source_type: "newsletter",
        frequency: "daily",
        language: "EN",
        subscribers: "1M+",
        description:
            "Buďte chytřejší v AI za 3 minuty denně. Quick-hit novinky, nástroj dne, produktivní tipy a nápady na AI prompty.",
        is_active: true,
        priority: 2,
    },
    {
        name: "Ben's Bites",
        url: "https://bensbites.beehiiv.com/",
        source_type: "newsletter",
        frequency: "daily",
        language: "EN",
        subscribers: "120K+",
        description:
            "Neformální a konverzační tón. Kurátorský výběr AI novinek, čtení a nástrojů. Oblíbený mezi zakladateli a buildery.",
        is_active: true,
        priority: 3,
    },
    {
        name: "The Neuron",
        url: "https://www.theneurondaily.com/",
        source_type: "newsletter",
        frequency: "daily",
        language: "EN",
        subscribers: "450K+",
        description:
            "Humorné a stručné rozbory AI vývoje, tutoriálů a trendů. Dělá komplexní AI témata přístupná pro všechny.",
        is_active: true,
        priority: 4,
    },
    {
        name: "The Batch",
        url: "https://www.deeplearning.ai/the-batch/",
        source_type: "newsletter",
        frequency: "weekly",
        language: "EN",
        subscribers: "N/A",
        description:
            "Vlajkový newsletter od Andrewa Nga. Autoritativní pokrytí AI výzkumu s balancí mezi technickou přesností a business přístupností.",
        is_active: true,
        priority: 5,
    },
    {
        name: "TLDR AI",
        url: "https://tldr.tech/ai",
        source_type: "newsletter",
        frequency: "daily",
        language: "EN",
        subscribers: "500K+",
        description:
            "Stručné shrnutí komplexních AI novinek. Zaměřeno na AI, ML a data science.",
        is_active: true,
        priority: 6,
    },
    {
        name: "There's An AI For That",
        url: "https://theresanaiforthat.com/",
        source_type: "aggregator",
        frequency: "daily",
        language: "EN",
        subscribers: "1.7M+",
        description:
            "Denní přehled nových AI nástrojů. Pomáhá najít řešení pro specifické výzvy.",
        is_active: false,
        priority: 7,
    },
    {
        name: "Import AI",
        url: "https://importai.substack.com/",
        source_type: "newsletter",
        frequency: "weekly",
        language: "EN",
        subscribers: "96K+",
        description:
            "Zaměřeno na cutting-edge AI vývoj, politiku, bezpečnost a dlouhodobé důsledky AI. Od Jacka Clarka (co-founder Anthropic).",
        is_active: true,
        priority: 8,
    },
    {
        name: "Mindstream",
        url: "https://www.mindstream.news/",
        source_type: "newsletter",
        frequency: "daily",
        language: "EN",
        subscribers: "150K+",
        description:
            "Denní AI novinky, tipy a insights v snadno čitelném formátu. Rychle rostoucí newsletter.",
        is_active: false,
        priority: 9,
    },
    {
        name: "MIT Technology Review",
        url: "https://www.technologyreview.com/topic/artificial-intelligence/",
        source_type: "magazine",
        frequency: "continuous",
        language: "EN",
        subscribers: "N/A",
        description:
            "Přes 120 let zkušeností. Autoritativní pokrytí AI průlomů, společenského dopadu a širších technologických trendů.",
        is_active: true,
        priority: 10,
    },
    {
        name: "VentureBeat AI",
        url: "https://venturebeat.com/category/ai/",
        source_type: "news_site",
        frequency: "continuous",
        language: "EN",
        subscribers: "N/A",
        description:
            "Business-zaměřená analýza AI novinek. Zkoumá transformační efekty AI napříč průmyslovými odvětvími.",
        is_active: true,
        priority: 11,
    },
    {
        name: "Ars Technica AI",
        url: "https://arstechnica.com/ai/",
        source_type: "news_site",
        frequency: "continuous",
        language: "EN",
        subscribers: "N/A",
        description:
            "Kvalitní technická žurnalistika s hloubkovými analýzami AI technologií.",
        is_active: true,
        priority: 12,
    },
    {
        name: "OpenAI Blog",
        url: "https://openai.com/blog/",
        source_type: "research_blog",
        frequency: "continuous",
        language: "EN",
        subscribers: "N/A",
        description:
            "Přímo od tvůrců ChatGPT a GPT modelů. Pokrývá jazykové modely, case studies a etické otázky.",
        is_active: true,
        priority: 13,
    },
    {
        name: "Google DeepMind Blog",
        url: "https://deepmind.google/discover/blog/",
        source_type: "research_blog",
        frequency: "continuous",
        language: "EN",
        subscribers: "N/A",
        description:
            "Aktualizace o průlomovém výzkumu v AI od Google DeepMind (Gemini, AlphaFold atd.).",
        is_active: true,
        priority: 14,
    },
    {
        name: "One Useful Thing",
        url: "https://www.oneusefulthing.org/",
        source_type: "research_blog",
        frequency: "weekly",
        language: "EN",
        subscribers: "N/A",
        description:
            "Praktické AI insights pro práci a vzdělávání. Jeden z nejvlivnějších hlasů v oblasti praktického využití AI.",
        is_active: true,
        priority: 15,
    },
];
