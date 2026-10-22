# Plan

Phase overview from BUILD_PROMPT Section 22. Each phase ends with a review stop.

| Phase           | Status      |
| --------------- | ----------- |
| 0 Setup         | Done        |
| 1 Design system | Done        |
| 2 Content layer | Done        |
| 3 Templates     | In progress |
| 4 Interactivity | Not started |
| 5 Content       | Not started |
| 6 Hardening     | Not started |
| 7 Launch        | Not started |

## Phase 0: Setup (19 October 2026)

Goal: a clean, verified foundation. No components, no content, no pages beyond a placeholder start page.

1. Move the spec files to `docs/`, add `CLAUDE.md`.
2. Verify the latest stable version of every package with `npm view`, scaffold with `create-next-app` (pnpm, TypeScript strict, App Router, Turbopack, React Compiler, Cache Components), add `typedRoutes`.
3. Tailwind v4 tokens from Section 9 in `styles/globals.css`: default palette, shadows and fonts removed.
4. Fonts via `next/font/google` in `app/fonts.ts` (Outfit, Nunito Sans, Work Sans), variables on `<html lang="de">`.
5. Tooling: ESLint flat config (Next rules, Prettier compat, banned icon imports), Prettier with Tailwind sorter, Vitest, Playwright with axe, GitHub Actions CI.
6. `site.config.ts` with every placeholder from Section 0 and feature flags.
7. Guards: unit tests for tokens, fonts and config; `check:css` on the build output; E2E smoke test for language, fonts, third party requests and axe.
8. Docs: PLAN, DECISIONS, CONTENT_STATUS, README with versions.

Result: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check:css` and `pnpm test:e2e` pass. One known deviation (Turbopack font fallback faces) is logged in DECISIONS and open for a decision.

## Phase 1: Design system (started 19 October 2026)

Goal: every component from Sections 6 and 7 with all states, documented on `/styleguide` (noindex). Components are presentational: they take props, they do not load content. Data loading (Phase 2), URL state with `nuqs`, form validation with React Hook Form and Zod, server actions, search index and charts (Phase 4) come later. Where a component needs that logic, Phase 1 ships the visual shell with local state and the props it will need.

1. **Fonts:** switch to `next/font/local` with our own subset files (owner decision, option c).
2. **Libraries:** `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `motion` (LazyMotion, features loaded async), `lucide-react`, `embla-carousel-react`, `cmdk`.
3. **Foundations:** `cn()`, type scale as `type-*` utilities, containers and section rhythm, `@theme static` so tokens are available to component CSS, `lib/format` (de-DE), `lib/scoring` labels, `lib/pricing` calculator, each with unit tests.
4. **Primitives (`components/ui`):** Button (primary signature CTA, ink, outline, ghost, link, affiliate, icon-round; sizes; disabled and loading), chips, ScoreChip, RatingStars, GermanFlag, AwardSeal, LogoTile with monogram, BlockPattern, form fields (Input, Textarea, Select, Checkbox, Switch, Slider, Label, error text), Tabs with sliding indicator, Accordion, Dialog, Sheet, Tooltip, Popover, Carousel, Toast, Skeleton, EmptyState.
5. **Data display:** ProsCons, DeutschlandCheck grid, StatTile, ScoreCard with distribution bars, PricingTable (monthly or yearly, net or gross), CostCalculator, ComparisonTable (sticky header and first column, groups, "Nur Unterschiede anzeigen").
6. **Cards:** SoftwareCard, FeaturedCard, RankedListItem, GuideCard with GuideCover, ReviewCard, TopicCard, TransparencyCard, AdvisorPanel, MethodologyBar, ComparisonCard, CategoryTile.
7. **Navigation and interaction:** Header with mega menu and mobile sheet, Breadcrumbs with JSON-LD, Footer, filter bar, local toggle, compare tray, command palette shell, sticky profile sub nav, table of contents with scrollspy, Softwarefinder step shell.
8. **Styleguide:** `/styleguide`, noindex, every component and state, clearly marked fictitious demo data (no real product with invented values).
9. **Quality:** unit tests for the libs, E2E plus axe on `/styleguide` at desktop and mobile width, keyboard checks for menu, tabs, dialogs and carousel, visual review in the browser.

Result (19 October 2026): all components above exist with their states on `/styleguide`. Verified: lint, typecheck, 34 unit tests, build, `check:css`, 24 E2E tests at desktop and mobile width (axe clean, keyboard paths for tabs, dialog, command palette, mega menu, mobile sheet, compare tray, advisor form errors, affiliate link attributes), visual review at 1280 px and phone width. Not in Phase 1 by plan: URL state, form submission, search index, charts, Softwarefinder scoring.

## Phase 2: Content layer (started 19 October 2026)

Goal: every content type from Section 10 has a Zod schema, pages read content only through `lib/content`, and the build fails on any schema or guard error. Batch 1 categories (Buchhaltung, Zeiterfassung, HR-Software) and the vendors of the batch 1 candidates exist as verified data. Software profiles, reviews and Kaufberatung texts are Phase 5.

1. **Tooling:** Content Collections 0.15 (`@content-collections/core`, `/next`, `/mdx`) with Zod 4 schemas. JSON for structured data, MDX with frontmatter for long form.
2. **Schemas (`lib/content/schemas.ts`):** Software with plans, Category, Vendor, Author, UserReview, Review, Comparison, Guide (Ratgeber), Download (Leitfaden), Kaufberatung. Money in integer cents, dates as ISO dates, slugs checked, icons only from the approved list.
3. **Guards (`lib/content/guards.ts`, pure functions):** published profiles need `verifiziert`, a real author, two sources and a price check not older than 180 days (warning from 90); every reference resolves; scores have exactly one decimal; honest wording (no "Test" without `handsOnTest`); unique slugs; file name equals slug.
4. **`scripts/validate-content.ts`:** runs the Content Collections build, fails on any validation event, then runs the guards and the copy lint. Runs before `next build`.
5. **`scripts/lint-copy.ts`:** Appendix B rules plus the Section 15.3 phrases on content and on UI strings (JSX text and labelled props via the TypeScript AST). Code, URLs and enum values are excluded.
6. **Data access layer (`lib/content`):** loaders, query helpers (filter, sort, alternatives, entry price, awards from Section 11.3), mapping to the component props. Drafts are visible only with `CONTENT_PREVIEW=1`.
7. **Search index:** pure builder with umlaut normalisation and Fuse.js, written to `public/search-index.json` at build time.
8. **Data:** all 14 categories as data (batch 1 marked), vendors of the batch 1 candidates researched from their Impressum with sources. No authors yet: they must be real people.
9. **Tests:** every guard proven with fixtures, copy lint rules, query helpers, awards, search.

Result (19 October 2026): schemas for all ten collections, guards proven by 24 tests, copy lint for content and UI (TypeScript AST), data access layer with query helpers and Section 11.3 awards, search index with umlaut normalisation, 14 categories and 22 verified vendors. `pnpm build` validates content first and fails on any schema or guard error. Not in Phase 2 by plan: software profiles, authors, Kaufberatung and FAQ texts (Phase 5).

## Phase 3: Templates (started 19 October 2026)

Goal: every page template from Section 13 renders real batch 1 data. Interactivity that needs logic (filters in the URL, search UI, charts, form submission, `/go` redirects, consent) is Phase 4; templates leave those parts out rather than showing controls that do nothing.

1. **Batch 1 research:** 22 candidate products (Buchhaltung 9, HR 7, Zeiterfassung 7, Kenjo in two categories) from vendor pages: plans and EUR prices with date, trial, free plan, hosting, AVV, GoBD, XRechnung, ZUGFeRD, ISO 27001, BSI C5, integrations, platforms, company sizes. Unknown stays "unbekannt"; nothing is guessed.
2. **Profiles:** one JSON per product with `status: "entwurf"`, `verification: "pruefen"`, `handsOnTest: false`. Scores and editorial texts are drafts for the owner's review (owner decision, 19 October 2026). Author and reviewer: Wolfram Eschenbach.
3. **Layout:** header and footer site wide, skip link, navigation and search items from content.
4. **Templates:** Startseite, Kategorien, Kategorie, Software A bis Z, Softwareprofil with Preise, Alternativen and Bewertungen, Vergleichsrechner and Vergleich, Ratgeber, Leitfäden, Beratung, Methodik, Redaktion and Autor, Für Anbieter, Software eintragen, Bewertung schreiben, Suche, Über uns, Kontakt, legal pages with marked placeholders, 404 and error pages. JSON-LD per Section 13.
5. **Rules on every template:** honest wording switch (Section 11.4), no user ratings until real ones exist, sections without content are hidden instead of filled.
6. **Verification:** build with `CONTENT_PREVIEW=1`, E2E plus axe on every template, visual review.

Result (19 October 2026): 22 draft profiles (Buchhaltung 9, HR 7, Zeiterfassung 7) and every template from Section 13 built on them. The preview build passes; 100 E2E tests (31 templates on desktop and mobile with axe, no dashes, no leaked values, no unmarked placeholders, no horizontal scroll, no runtime errors) plus behaviour tests for honest wording, outbound links, ranking, empty categories, honest forms and the compare tray. Open for Phase 4: filters in the URL, search UI, `/go` redirects, form delivery, consent. Open for review: all scores and editorial texts (owner), a second reviewer, hard 404 status for unknown slugs.

## Phase 4: Interactivity (started 19 October 2026)

Goal: every interactive part from Sections 7.4, 13, 14, 18 and 19 works with real data, and the E2E flows from Section 21 pass. Delivery services (mail, analytics) are built behind interfaces and stay off until the owner chooses providers and sets the keys; until then the site says so honestly.

1. **Packages:** recharts 3.10.1, react-hook-form 7.90.0, @hookform/resolvers 5.9.2 (6.0.0 is younger than the release age policy), nuqs 2.10.2, resend 6.34.1.
2. **`/go/[slug]`:** 307 to the affiliate URL with a subid (`from`, `pos` whitelisted), `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, anonymous click event when analytics is configured. Unknown slugs go to `/software`, products without an active deal go to their profile. `robots.ts` disallows `/go/`.
3. **Search:** the command palette loads `public/search-index.json` on first open instead of receiving every item as props on every page. Results page `/suche` stays server rendered. Hero search field submits to `/suche`.
4. **Filters:** category pages get the filter bar (Section 7.4 groups that our data supports) plus "Nur Anbieter aus Deutschland". State in the URL via nuqs, product attributes only. The ranked list stays server rendered in editorial order; filtering hides items on the client, so the static HTML keeps every product.
5. **Compare tray:** selection survives reloads (sessionStorage, slugs only). The tool page reads `?produkte=`.
6. **Softwarefinder:** deterministic scoring in `lib/finder` (category, company size, requirements) returns the top three with a reason each. Home block 5 and on `/beratung`.
7. **Charts (Section 14):** Recharts, lazy loaded with same size skeletons, every chart with title, takeaway, footnote with basis and "Stand", and "Daten als Tabelle anzeigen". Entry price bars (home median per category, category), price and score scatter (category), criteria radar (profile), weights donut (home, Methodik), cost over users (calculator), butterfly (comparison pages, styleguide).
8. **Forms:** React Hook Form plus Zod on the client, the same schemas in server actions. `MailProvider` (Resend, plus an outbox provider for local tests), server side rate limit, honeypot. Double opt in with signed, encrypted tokens that hold no personal data. Advice request (multi step on `/beratung`), newsletter, guide download, profile claim and software submission (`/software-eintragen`), user review (multi step, business email check, `ReviewSubmissionStore` with an email adapter). Confirmation page `/bestaetigen`.
9. **Consent:** service registry, banner and settings panel per Section 19. With no consent requiring service registered (today) no banner appears; the styleguide shows it.
10. **Analytics:** cookieless adapter for Plausible EU or Umami, off until configured. No request to any third party before that.
11. **Tests:** unit tests for finder, filters, tokens, rate limit, `/go` logic, consent; E2E for search to category to filter to compare to profile, `/go` redirects, advice form, newsletter double opt in, review form, keyboard only navigation.
