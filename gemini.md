# 🧠 gemini.md — Ústava projektu: AI News Scraper

> Tento soubor je **zákon**. Definuje data schemas, behaviorální pravidla a architektonické invarianty.
> Aktualizuje se POUZE když: se mění schema, přidává se pravidlo nebo se upravuje architektura.

---

## 1. Data Schema

### Input Schema (Sources)
```json
{
  "id": "uuid (PK, auto)",
  "name": "string — název zdroje",
  "url": "string — URL ke scrapování (UNIQUE)",
  "source_type": "enum — newsletter | magazine | news_site | research_blog | aggregator",
  "frequency": "enum — daily | weekly | continuous",
  "language": "string — EN",
  "subscribers": "string — informativní počet odběratelů",
  "description": "string — popis zdroje",
  "is_active": "boolean — zda je zdroj aktivní pro scraping",
  "priority": "integer — priorita zobrazení (1 = nejvyšší)",
  "last_scraped_at": "timestamptz — čas posledního scrapingu",
  "created_at": "timestamptz — čas vytvoření"
}
```

### Output Schema (Articles / Payload)
```json
{
  "id": "uuid (PK, auto)",
  "source_id": "uuid (FK → sources.id, CASCADE)",
  "title": "string — titulek článku",
  "summary": "string — shrnutí (max 300 znaků)",
  "url": "string — odkaz na článek",
  "content_markdown": "string — plný obsah z FireCrawl (max 5000 znaků)",
  "published_at": "timestamptz — datum publikace",
  "scraped_at": "timestamptz — kdy scrapováno (default now())",
  "tags": "string[] — tagy/kategorie",
  "source_name": "string — name zdroje pro rychlý přístup"
}
```

---

## 2. Behaviorální pravidla

1. **Determinismus:** Všechny `tools/` scripty a API routes musí být deterministické. Žádné LLM volání v business logice.
2. **Atomičnost:** Každý tool/route dělá jednu věc a dělá ji dobře.
3. **Fail-Safe:** Při selhání API loguje chybu, vrací fallback data. Nepadá tiše.
4. **Idempotence:** Opakované spuštění scrapingu se stejnými vstupy dává stejné výsledky.
5. **Auto-Cleanup:** Články starší 60 dnů se automaticky mažou (pg_cron, denně 3:00 UTC).
6. **Graceful Degradation:** Bez Supabase credentials app funguje se seed daty. Bez FireCrawl klíče app zobrazuje UI bez scrapingu.

---

## 3. Architektonické invarianty

```
AI NEWS SCRAPER/
├── gemini.md              # Ústava projektu
├── .env                   # API Keys/Secrets
├── architecture/
│   └── sources.md         # Referenční seznam zdrojů
├── web-app/               # Next.js App Router
│   ├── app/               # Pages + API routes
│   ├── components/        # Reusable UI komponenty
│   ├── lib/               # Supabase, FireCrawl, seed data
│   └── .env.local         # Runtime credentials
├── task_plan.md
├── findings.md
└── progress.md
```

### Tech Stack
- **Frontend:** Next.js 16 (App Router), Vanilla CSS, Inter font
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL 17) — project `jebuqnwiyzplkjygwsgl`
- **Scraping:** FireCrawl API (`@mendable/firecrawl-js`)
- **Cleanup:** pg_cron (denně 3:00 UTC — mazání článků > 60 dnů)

### Zlaté pravidlo
> Pokud se změní logika → aktualizuj SOP v `architecture/` **PŘED** aktualizací kódu.

---

## 4. Integrace

| Služba | Stav | Credentials |
|--------|------|-------------|
| Supabase | ✅ Připojeno | `.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) |
| FireCrawl | ⏳ Čeká na API klíč | `.env.local` (FIRECRAWL_API_KEY) |

---

## 5. Maintenance Log

| Datum | Akce | Detail |
|-------|------|--------|
| 2026-03-06 | Projekt založen | Protocol 0 + Blueprint |
| 2026-03-06 | DB migrace | sources + articles tabulky, indexy, RLS |
| 2026-03-06 | pg_cron cleanup | Automatické mazání článků > 60 dnů (3:00 UTC) |
| 2026-03-06 | Seed data | 15 zdrojů vloženo do Supabase |
| 2026-03-06 | App spuštěna | Next.js na portu 3099, Supabase propojeno |
