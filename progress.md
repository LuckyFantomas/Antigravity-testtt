# 📊 Progress — AI News Scraper

> Co bylo hotovo, chyby, testy a výsledky.

---

## Log

### 2026-03-06 — Protocol 0: Initialization ✅
- ✅ Vytvořeny inicializační soubory (`task_plan.md`, `findings.md`, `progress.md`, `gemini.md`)
- ✅ Načten předchozí výzkum AI zdrojů z konverzace `30db50cf`

### 2026-03-06 — Phase 1: Blueprint ✅
- ✅ Discovery otázky zodpovězeny uživatelem
- ✅ Research: FireCrawl API (`@mendable/firecrawl-js`, scrape mode, markdown output)
- ✅ Implementation plan schválen uživatelem (Next.js + Supabase + FireCrawl)

### 2026-03-06 — Phase 2: Implementation ✅ (UI + API)
- ✅ Next.js projekt inicializován v `web-app/`
- ✅ Lib layer: `supabase.js` (lazy init), `firecrawl.js` (SDK wrapper), `sources-data.js` (15 zdrojů)
- ✅ API routes: `/api/sources`, `/api/articles`, `/api/scrape`
- ✅ Design system: dark mode, glassmorphism, gradient accents, micro-animace
- ✅ Dashboard page: stats, filtrování, article cards, empty state
- ✅ Admin page: 15 zdrojů, toggle switches, priority inputs, scrape buttons
- ✅ Supabase migration SQL

### 2026-03-06 — Phase 3: Verifikace ✅ (UI)
- ✅ Build OK — Next.js 16.1.6 na portu 3099
- ✅ Dashboard: stats cards (13 active / 15 total), filter bar, empty state
- ✅ Admin: všech 15 zdrojů; toggles, priority, per-source scrape funguje
- ✅ Fallback na seed data funguje bez Supabase credentials

---

## Čeká se
- ⏳ Supabase credentials od uživatele
- ⏳ FireCrawl API Key od uživatele
- ⏳ End-to-end test se skutečnými daty
- ⏳ Phase 5: Trigger (cron scheduling)

## Chyby & Opravy
- 🐛 `createClient` throws na placeholder URL → Opraven lazy initialization v `supabase.js`
- 🐛 Directory name s mezerami/kapitálkami → Next.js projekt v `web-app/` subdirectory
