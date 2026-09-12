# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: architects, interior designers, and specifiers who evaluate architectural cladding for a client's project (residential and corporate/hospitality/retail retrofit). Architects and specifiers are the strategic priority audience.

Secondary: property owners (mid/high-end residential), facilities managers, retailers, and companies handling retrofit of corporate/hospitality/retail spaces without full renovation.

## Product Purpose

DYNEW is specialized in transforming existing surfaces through high-performance architectural cladding, with an initial specialization in 3M™ DI-NOC™. The landing page introduces the company and drives a qualified commercial conversation via WhatsApp about a visitor's real project — there is no e-commerce or automated quote; every inquiry is handled as a direct conversation. A secondary path lets visitors explore finishes (by family/appearance/application) before contacting.

DYNEW's actual offer: technical-commercial curation of architectural cladding, preliminary guidance on finish selection, availability consultation, quote-based supply, and next-step guidance for application — conditional on real project conditions. DYNEW does not present itself as an architecture firm, interior design studio, or as a 3M-authorized distributor/applicator without documentation.

## Positioning

Confirmed (source: user-provided internal strategy documents, 2026-08-30 draft, reconfirmed 2026-09-08):

- Category: architectural cladding / surface transformation — explicitly NOT "adesivação", "envelopamento", "plotagem", or generic visual-communication/signage.
- Territory: arquitetura × tecnologia × execução especializada × transformação de superfícies.
- Definition: "A DYNEW é uma empresa especializada em transformação de superfícies através de revestimentos arquitetônicos de alta performance."
- Approved big-idea lines: "Não substitua. Transforme." / "Nova superfície. Nova percepção." / "Nem tudo precisa ser substituído para se tornar novo."
- Differentiator claimed: EXECUÇÃO ESPECIALIZADA (substrate reading, prep, precise cuts, corners, seams, curves, site protection, cleanliness, schedule, inspection) — "O material importa. A execução define o resultado."
- Vocabulary to prefer: revestimentos arquitetônicos, transformação de superfícies, retrofit, execução especializada, materialidade. Vocabulary to avoid as primary framing: adesivação, envelopamento, plotagem, adesivo decorativo.

## Operating Context

- Contact channels: WhatsApp Business (+55 11 92503-9297, already configured) and public email **contato@dynew.com.br** (institutional/leads channel; Cloudflare Email Routing + SMTP2GO + SPF/DKIM/DMARC already set up, confirmed working). `[e-mail interno]` is a real internal/commercial address but must NOT appear in public-facing content, metadata, or structured data.
- No online store, quote calculator, or lead form — WhatsApp/email are the only conversion mechanism today. A structured lead-qualification form (with UTM tracking, Meta Pixel/CAPI, GA4) is planned per internal docs but has no real credentials/IDs yet — do not fabricate them; do not build it until real IDs exist.
- Site is in Brazilian Portuguese (pt-BR) only. Domain: dynew.com.br (confirmed). Instagram: @dynewbr (confirmed, not yet public-facing content-ready).
- A future "DYNEW Agent" (WhatsApp qualification bot on n8n) is planned but not built (still Fase 1 of its own roadmap: dedicated number/business config). Do not imply it exists.

## Capabilities and Constraints

- Static site: plain HTML/CSS/JS, no framework, no build step (explicit platform constraint — do not migrate to React/Next.js/Webflow, confirmed again 2026-09-08 overriding an earlier abandoned Next.js plan drafted for Codex).
- Product catalog: 3M™ DI-NOC™ Architectural Finishes, global 2024 sample book PDF supplied by the user (`assets/catalogo/raw/`, not publicly served). 27 product codes verified present in that PDF are staged in `data/catalog.json` with real family/page/dimension data; none confirmed as Brazil-stocked yet (all `CURRENT_GLOBAL_ONLY` or `UNVERIFIED` pending Layers Brasil/3M Brasil confirmation). No product images extracted yet — no PDF image-extraction tool available in this environment; see `THIRD_PARTY_ASSETS.md` for the pendency.
- No confirmed company history, years in market, real project photography, case studies, or testimonials — never fabricate these; use explicit real technical evidence (sourced DI-NOC material facts) instead of fake social proof.
- No physical address; DYNEW is a service-area business, not to use Layers Brasil's address.
- Logo: an official vector logotype exists (user-provided, `LOGO TIPO/` on the user's machine) but the user has explicitly asked to keep the current text wordmark for now — do not swap in the official logo without being asked again.

## Brand Commitments

- Name: DYNEW. Approved visual direction: "Architectural Quiet Luxury" — confirmed exact palette (hex, approved across multiple direction-review rounds): Marfim `#F5F2ED`, Creme `#F0EBE6`, Preto profundo `#0D0D0D`, Grafite `#2D2E30`, Areia mineral `#DCC8AE`, Champanhe fosco `#AF8F61` (67% claros / 22% escuros / 8% minerais / 3% champanhe). Typography: Manrope dominant; Newsreader italic restricted to single words/short phrases, never paragraphs.
- Avoid: shiny/jewelry-like gold, glassmorphism, loud gradients, neon, generic decal/sticker iconography (roller, spatula, decal icons).
- Contact identity for public content: WhatsApp +55 11 92503-9297, email contato@dynew.com.br.

## Evidence on Hand

Real, sourced technical material now available (2026-09-08) — extracted from user-provided internal reference docs and the official 2024 DI-NOC catalog PDF, itself citing Layers Brasil (3M's Brazilian DI-NOC distributor) as of 2026-08-30:

- DI-NOC product facts: multilayer adhesive vinyl film (~8 mil), 3M™ Comply™ pressure-sensitive adhesive technology (reduces bubbling), standard roll 1.22m × 50m (some series 1.22m × 25m), adheres to most smooth non-porous substrates (validate per project), many patterns heat-formable to 3D surfaces, expected interior vertical lifespan ~12 years and EX (exterior) ~7–16 years "conforme padrão e clima — consultar ficha técnica," maintenance via mild detergent/water/soft cloth, localized repair possible, families include Wood, Metal (Hairline/Oxidized/Black Iron), Leather/Suede, Textile, Concrete/Stucco, Stone, Carbon, Solid Colors and more.
- 27 specific product codes verified present in the official 2024 global catalog (`data/catalog.json`), 6 with confirmed commercial names (E-Series RC solid colors), 21 code-only (no invented names).
- Still absent: real DYNEW project photography, testimonials, case studies, years-in-market, certifications, confirmed Brazil stock/pricing for any specific code, official 3M-authorized logo/seal for public use.
- Never present global-catalog facts as guaranteed for every series/substrate/climate without the "consultar ficha técnica" hedge; never claim distributor/authorized-applicator status without documentation.

## Product Principles

1. Every visitor path leads to a qualified WhatsApp conversation about a real project — the site persuades and lets visitors explore finishes, it doesn't try to close the sale itself.
2. Never fabricate proof: no invented testimonials, project counts, years in business, certifications, prices, deadlines, or warranties. Use real sourced technical facts (with their hedges) instead of fake social proof; when something is genuinely unconfirmed, say "Consulte disponibilidade e orçamento" / "Disponibilidade sujeita a consulta" rather than showing an empty placeholder box.
3. Speak first to architects/designers/specifiers evaluating a material for a project, then to the end client — content should support a specification decision.
4. Keep the visual identity token-driven (`css/variables.css`) so it stays swappable without restructuring markup.
5. DYNEW is a curator/facilitator between aesthetic intent, existing-surface condition, use requirement, finish family, availability, and budget — not a generic reform/adesivação company.
