# 📋 AI News Scraper — Task Plan (B.L.A.S.T.)

> Tento soubor slouží jako hlavní checklist celého projektu. Každá fáze odpovídá jednomu kroku B.L.A.S.T. protokolu.

---

## Protocol 0: Initialization
- [x] Vytvořit `task_plan.md`
- [x] Vytvořit `findings.md`
- [x] Vytvořit `progress.md`
- [x] Vytvořit `gemini.md` (Ústava projektu)
- [ ] Zodpovědět 5 Discovery otázek (Blueprint)
- [ ] Definovat Data Schema v `gemini.md`
- [ ] Schválit Blueprint

## Phase 1: B — Blueprint (Plán)
- [ ] Potvrdit North Star cíl
- [ ] Potvrdit integrace a API klíče
- [ ] Potvrdit Source of Truth
- [ ] Potvrdit Delivery Payload formát
- [ ] Potvrdit Behavioral Rules
- [ ] Definovat JSON Data Schema (Input/Output) v `gemini.md`
- [ ] Research: GitHub repozitáře, knihovny pro scraping
- [ ] Schválení Blueprint fáze uživatelem

## Phase 2: L — Link (Propojení)
- [ ] Ověřit `.env` credentials
- [ ] Vytvořit minimální handshake scripty v `tools/`
- [ ] Otestovat konektivitu ke všem externím službám
- [ ] Potvrdit, že Link fáze je funkční

## Phase 3: A — Architect (Architektura)
- [ ] Vytvořit `architecture/` SOPs
- [ ] Implementovat Layer 1 (Architecture docs)
- [ ] Implementovat Layer 3 (Tools — deterministické Python scripty)
- [ ] Otestovat jednotlivé Tools atomicky
- [ ] Propojit Navigation vrstvu (orchestrace)

## Phase 4: S — Stylize (Stylizace)
- [ ] Naformátovat výstupní Payload
- [ ] UI/UX pokud je dashboard/frontend
- [ ] Předložit stylizované výsledky ke zpětné vazbě

## Phase 5: T — Trigger (Nasazení)
- [ ] Přesunout logiku do produkčního prostředí
- [ ] Nastavit triggery (Cron/Webhook/Listener)
- [ ] Dokončit Maintenance Log v `gemini.md`
