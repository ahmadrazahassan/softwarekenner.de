# Decisions

Format: date, decision, reason, alternatives.

## 2026-10-19: Package versions verified for Phase 0

All versions were checked with `npm view <pkg> version` on 19 October 2026. No canary, beta, RC or "next" tags. Installed versions are listed in the README.

## 2026-10-19: TypeScript 6.0.3 instead of 7.0.2

- **Decision:** pin `typescript` to 6.0.3, the newest 6.x.
- **Reason:** `eslint-config-next` 16.4.2 depends on `typescript-eslint` 8.x, whose peer range is `typescript >=4.8.4 <6.1.0`. TypeScript 7 would break type aware linting. `create-next-app` installed 5.9.3; 6.0.3 is the newest version inside the supported range, and `next build` type checking passes with it.
- **Alternatives:** 7.0.2 (unsupported by the lint stack), 5.9.3 (older than necessary).
- **Revisit:** when `typescript-eslint` widens its range to 7.x.

## 2026-10-19: ESLint 10.13.0 although three plugins list ESLint 9 as their peer maximum

- **Decision:** use ESLint 10.13.0.
- **Reason:** `create-next-app` installed ESLint 9.39.5, which npm marks as deprecated ("no longer supported"). `eslint-plugin-react` 7.37.5, `eslint-plugin-import` 2.32.0 and `eslint-plugin-jsx-a11y` 6.10.2 (pulled in by `eslint-config-next`) declare peer ranges up to ESLint 9. A probe file with known violations proved that the rules of all plugins (react, react-hooks, jsx-a11y, @next/next, no-restricted-imports) fire correctly under ESLint 10, and `pnpm lint` runs without errors. `pnpm peers check` reports the three unmet peers.
- **Alternatives:** ESLint 9.39.5 (formally supported by every plugin, but end of life).
- **Revisit:** when the plugins publish ESLint 10 peer ranges, or if any rule crashes.

## 2026-10-19: vite pinned to 8.3.3 for Vitest

- **Decision:** add `vite@8.3.3` as an explicit dev dependency.
- **Reason:** Vitest 5.0.5 resolved vite 8.3.4, which requires `postcss@^8.5.29`. The local pnpm 11.9.0 supply chain policy only offers postcss up to 8.5.28, so the install failed. vite 8.3.3 needs `postcss@^8.5.28` and installs cleanly. The pnpm policy was not weakened.
- **Alternatives:** loosen the pnpm policy (rejected, security), downgrade Vitest (older than necessary).
- **Revisit:** next dependency update; remove the explicit pin when 8.3.4+ resolves.

## 2026-10-19: @types/node 24.x instead of 26.x

- **Decision:** `@types/node` 24.19.2.
- **Reason:** types should match the runtime. The project targets Node.js 24 Active LTS (Section 8.2); 26.x types would allow APIs that do not exist at runtime.

## 2026-10-19: Tailwind via `@tailwindcss/turbopack`, split import with our own preflight copy

- **Decision:** keep the Turbopack CSS loader that `create-next-app` 16.4.2 sets up (no PostCSS config). Import Tailwind as `theme.css`, our `styles/preflight.css` and `utilities.css` instead of `@import "tailwindcss"`.
- **Reason:** stock preflight writes the full system font stacks as `var()` fallbacks into the compiled CSS. Rule 3.4 allows no other family anywhere in CSS. The copy differs from the original only in the two `font-family` declarations.
- **Maintenance:** re-copy `node_modules/tailwindcss/preflight.css` on every Tailwind upgrade and remove the two font stacks again. `pnpm check:css` fails if a system font name appears.
- **Alternatives:** accept the unused fallback stacks (violates the letter of rule 3.4).

## 2026-10-19: Tailwind theme as specified in Section 9, plus small additions

- **Decision:** tokens exactly as in Section 9. Added only: `--radius-logo: 16px` (logo tile, Section 5.5), `--ease-standard` (Section 5.6), `--breakpoint-xs: 22.5rem` (360 px, Section 5.4; the other breakpoints are Tailwind defaults and already match), `--default-mono-font-family` mapped to Work Sans so `code` never falls back to a monospace system font.
- **Reason:** every addition is defined elsewhere in the spec; none adds a color.

## 2026-10-19: Fonts as variable fonts

- **Decision:** load Outfit, Nunito Sans (normal and italic) and Work Sans as variable fonts, one file per style.
- **Reason:** all three are variable fonts, so one file per style covers every weight in Section 5.3. Fewer requests than one file per weight.

## 2026-10-19: Turbopack ignores `adjustFontFallback: false` for `next/font/google`

- **Finding:** with Turbopack (`next build`), `next/font/google` still emits one `@font-face` per family named "Outfit Fallback", "Nunito Sans Fallback" and "Work Sans Fallback" with `src: local(Arial)` and metric overrides, and appends it to each family stack. The same code built with `next build --webpack` emits no fallback faces, so this is a Turbopack loader issue in Next.js 16.4.2.
- **Options reviewed:** (a) accept the faces, (b) webpack for production, (c) `next/font/local`. The owner chose (c), see the next entry.

## 2026-10-19: Fonts via `next/font/local` from our own subset files (resolves the entry above)

- **Decision:** `app/fonts.ts` uses `next/font/local`. The OFL variable TTFs from the google/fonts repository live in `assets/fonts/source/` with their licenses in `assets/fonts/licenses/`. `pnpm fonts:build` (`scripts/build-fonts.ts`, uses `subset-font` 2.9.0) writes one WOFF2 per style to `assets/fonts/web/`: Google's latin plus latin-ext ranges plus ⌘, the wght axis limited to the weights in Section 5.3 (Outfit 400 to 800, Work Sans 400 to 600, Nunito Sans 400 to 700), Nunito Sans' other axes pinned to their defaults (wdth 100, opsz 12, YTLC 500).
- **Result:** Turbopack honours `adjustFontFallback: false` for local fonts. The compiled CSS has exactly four `@font-face` rules (Outfit, Nunito Sans normal and italic, Work Sans), no fallback faces and no system font name. Family names are generated from the export names: `outfit`, `nunitoSans`, `workSans`. File sizes: 47, 33, 35 and 74 KB.
- **Guards:** `pnpm check:css` fails on any other family, font source or system font name, and expects exactly four faces. The E2E test checks every computed font stack and every loaded face.
- **Bonus:** the source TTFs are what `next/og` needs later (Section 5.3).

## 2026-10-19: Cache Components and Partial Prefetching enabled from the start

- **Decision:** keep `cacheComponents: true` (Section 8.3) and the `partialPrefetching: true` flag that `create-next-app` 16.4.2 adds with it.
- **Reason:** turning Cache Components on later forces a refactor of every data loader.

## 2026-10-19: Start page set to noindex during the build

- **Decision:** root metadata uses `robots: { index: false, follow: false }`.
- **Reason:** nothing is public yet. Indexing is enabled in Phase 6 together with sitemap and canonicals.

## 2026-10-19: Banned icons enforced by ESLint

- **Decision:** `no-restricted-imports` blocks every icon from the Section 5.7 ban list (also the `…Icon` aliases) when imported from `lucide-react`.
- **Reason:** cheaper to enforce now than to grep later. `lucide-react` itself is installed in Phase 1.

## 2026-10-19: pnpm 11.9.0 kept

- **Decision:** keep the locally installed pnpm 11.9.0 (`packageManager` field). Latest is 12.14.0.
- **Reason:** upgrading the global pnpm changes the machine setup and is the owner's call. Open question in the Phase 0 report.

## 2026-10-19: Brand name "Softwarekenner"

- **Decision:** `siteConfig.brand.name` is "Softwarekenner" (chosen by the owner).
- **Reason:** "Kenner" (expert, connoisseur) signals editorial competence and fits the advisory service ("Unsere Softwarekenner beraten Sie"). German, no umlaut, no "Test" or "Check" in the name (avoids implying a hands on test on every profile and avoids conflicts with established brands). A web search on 19 October 2026 found no existing product with this name.
- **Domains:** on 19 October 2026 the DENIC and Verisign RDAP lookups showed `softwarekenner.de` and `softwarekenner.com` as unregistered. `DOMAIN` stays a placeholder until the owner registers one.
- **Before launch:** trademark search (DPMA, EUIPO) by the owner.
- **Alternatives considered:** Toolkenner, Softwarewaage (reads like weighing scale software), Wahlkontor ("Wahl" reads as election), Auswahlwerk. Most other candidates were already registered.

## 2026-10-19: Phase 1 library versions

- **Decision:** `radix-ui` 1.8.1, `class-variance-authority` 0.7.1, `clsx` 2.1.1, `tailwind-merge` 3.7.0, `lucide-react` 1.59.0, `embla-carousel-react` 8.6.0, `cmdk` 1.1.1, `motion` **14.3.0**, `subset-font` 2.9.0 (dev).
- **Reason for motion 14.3.0:** 14.4.0 and 14.3.1 were published on 19 October 2026, a few hours before installation. pnpm's minimum release age policy flagged them and auto added an exclusion; the exclusion was removed and the newest version older than the policy window was pinned instead. Every approved icon name from Section 5.7 exists in lucide-react 1.59.0.
- **Revisit:** next dependency update.

## 2026-10-19: Type scale as `type-*` utilities, default font sizes removed

- **Decision:** `--text-*: initial` removes Tailwind's default sizes. The Section 5.3 styles are composite utilities (`type-h1`, `type-label`, `type-eyebrow`, …) that set family, size, line height, tracking and weight together. A few single sizes (`text-small`, `text-lead`, …) remain for one off cases. `cn()` teaches tailwind-merge these names so sizes and colors do not cancel out.
- **Reason:** off scale sizes cannot slip in, and one class carries the whole style.

## 2026-10-19: `@theme static`

- **Decision:** all tokens are always emitted as CSS variables.
- **Reason:** component CSS (`styles/components.css`) and later charts read the tokens directly; without `static` Tailwind only emits variables that utilities use.

## 2026-10-19: Server and client component split for primitives

- **Decision:** interactive parts live in client modules (`button-client.tsx`, `form.tsx`, `overlay.tsx`, `tabs.tsx`, …); links, `Field`, `Input`, `Textarea` stay server safe (`button.tsx`, `field.tsx`). Props that cross the boundary are serializable: button icons are string keys, command palette icons are looked up on the client.
- **Reason:** server pages can render buttons and forms without shipping JS for every link, and Next.js rejects functions as client props.

## 2026-10-19: Links take plain strings until the route helpers exist

- **Decision:** `AppLink`, `ButtonLink` and `TextLink` accept `href: string` and cast once to `Route` for next/link. Phase 3 adds typed route builders (`lib/routes`) that page code must use.
- **Reason:** `typedRoutes` rejects links to pages that do not exist yet, and most targets (`/methodik`, `/kategorien/…`) are built in Phase 3.

## 2026-10-19: Motion via LazyMotion with async features

- **Decision:** `MotionProvider` in the root layout loads `domMax` after hydration (`strict` mode, `m` components only). `reducedMotion="user"`.
- **Reason:** keeps animation code out of first load JS (Section 21 budget). Only the tab indicator uses `layoutId` so far.

## 2026-10-19: German flag colors

- **Decision:** the flag SVG uses the official colors (#000000, #dd0000, #ffce00).
- **Reason:** Section 5.7 requires the flag; national colors are a symbol, not brand colors, and appear only in that component. `check:css` is unaffected (SVG attributes, no tokens).

## 2026-10-19: Styleguide demo data

- **Decision:** `/styleguide` uses invented product names ("Musterbuch", "Belegwerk Beispiel", …), values and one invented review, with a visible notice that all data is fictitious. The page is noindex and will be excluded from the sitemap.
- **Reason:** every state must be visible before real content exists (Phase 1), without presenting fabricated data about real products.

## 2026-10-19: Honest labels on cards

- **Decision:** SoftwareCard stars always show the editorial score with the label "Redaktionswertung"; a real user review count is appended as "· n Nutzerbewertungen" instead of "(n Bewertungen)" next to the editorial stars.
- **Reason:** Section 11.5 forbids mixing editorial and user scores; "(128 Bewertungen)" next to editorial stars would suggest the stars were the user average.

## 2026-10-19: FeaturedCard shows "Anzeige" once

- **Decision:** inside a FeaturedCard the affiliate CTA omits its own "Anzeige" label (`adLabel="none"`); the card label covers it. The asterisk and `rel="sponsored"` stay.

## 2026-10-19: Phase 2 content tooling

- **Decision:** Content Collections (`@content-collections/core` 0.15.3, `/next` 0.2.11, `/mdx` 0.2.2) with Zod 4.6.7 schemas passed as Standard Schema. JSON for structured data, MDX with frontmatter for long form. `fuse.js` 7.5.0 for search, `server-only` 0.0.1 to keep the loaders out of client bundles.
- **Reason:** the spec's first choice works with Next.js 16.4.2, TypeScript 6 and Turbopack (peer ranges and a real build); no fallback to `@next/mdx` needed.
- **esbuild:** `@content-collections/mdx` uses mdx-bundler with esbuild 0.25.12. Its install script stays blocked in `pnpm-workspace.yaml` (`esbuild: false`); the binary ships as a platform package and was verified to work without it.

## 2026-10-19: Validation runs before every build and fails hard

- **Decision:** `pnpm build` runs `content:validate` (Content Collections build plus guards plus copy lint) and `search:index` before `next build`.
- **Reason:** Content Collections only reports schema errors as events and skips the document, so the build would pass with missing content. The script turns every read, parse or validation event into a failure (Section 10: the build fails on any schema error). Proven with a broken test file and by 24 guard tests.

## 2026-10-19: Scripts run on Node's built in TypeScript support

- **Decision:** scripts are `.ts` files run with `node` directly. Modules they share with the app (`lib/content/schemas`, `guards`, `copy-lint`, `query`, `lib/search`, `lib/routes`, `lib/format`, `lib/scoring`) import each other with explicit `.ts` extensions and without the `@/` alias. `allowImportingTsExtensions` is on (noEmit project).
- **Reason:** no extra runner (tsx, ts-node) needed; Node 24 strips types natively.

## 2026-10-19: Schema additions beyond the Section 10 excerpt

- `Software.germanInterface`: rule 3 allows German UI or German support; only support was modelled.
- `Vendor.notes`, `sources`, `verification`, `verifiedAt`: vendor facts need sources like everything else (Section 15.5). `founded` and `supportLanguages` are nullable and stay null unless a source states them. `germanEntity` is nullable for unclear cases (Accountable names a "Deutschland" unit without register data).
- `Category.batch`, `status`, `seo`, `faq`, `related`, `weights` (all six criteria, must sum to 100 %).
- `Author.realPerson: true` as an explicit confirmation per author file.
- `BuyingGuide` (content/kaufberatung) as its own MDX collection for the Kaufberatung of each category page.

## 2026-10-19: Vendor research method

- **Decision:** legal name, seat and register data come from the vendor's own Impressum or an official register. Headquarters is the seat of the provider named in the German Impressum.
- **Exceptions:** DATEV: datev.de refused connections from both research tools; the data comes from the Bundestag Lobbyregister (entry R003153, last change 20 August 2026). Personio and SAP blocked direct fetches (429 and 403); their legal notice pages were read through the search tool, which quotes the page.
- **Findings:** Crewmeister's provider is ATOSS Aloud GmbH (München). ZEP is now ZEP GmbH (formerly provantis IT Solutions GmbH). Papierkram is operated by odacer finanzsoftware GmbH. TimeTac is an Austrian GmbH without a German entity in its Impressum. Factorial contracts through FACTORIAL GmbH in München.

## 2026-10-19: Drafts are hidden unless CONTENT_PREVIEW=1

- **Decision:** loaders and the search index show only `veroeffentlicht` content; `CONTENT_PREVIEW=1` shows drafts for editing and for building templates in Phase 3.
- **Reason:** nothing unverified reaches a public build by accident.

## 2026-10-19: Category names follow the content

- **Decision:** the CRM category is called "CRM-Software" (H1 "CRM-Software im Vergleich"). `lib/navigation.ts` mirrors the content; a unit test fails if they drift. Phase 3 can derive the navigation from content directly.

## 2026-10-19: First author

- **Decision:** `content/authors/wolfram-eschenbach.json`, named by the owner as founder and author. The bio states only that (founder, writes the editorial reviews); no credentials or expertise were added beyond "Unternehmenssoftware". No photo until a real one exists (Section 5.9).
- **Open:** a second person for the "fachliche Prüfung" (reviewer). Until then profiles name the same person as author and reviewer, which the guards report as a warning, not an error. If "Wolfram Eschenbach" is a pen name, the Impressum and the responsible person under § 18 Abs. 2 MStV (`EDITOR_IN_CHIEF`) still need the legal name.

## 2026-10-19: Route group `(site)` for the public pages

- **Decision:** all public pages live in `app/(site)` with one layout that renders `SiteShell` (skip link, header, footer, compare tray). `/styleguide` and the root error pages stay outside, so the styleguide keeps its own demo chrome.

## 2026-10-19: Placeholder static params for empty collections

- **Decision:** `lib/static-params.ts` returns `__platzhalter__` when a dynamic route has no entries yet (Ratgeber, Leitfäden, Vergleiche). The page answers that slug with `notFound()`.
- **Reason:** with Cache Components an empty `generateStaticParams` fails the build.

## 2026-10-19: CONTENT_PREVIEW is inlined at build time

- **Decision:** `next.config.ts` passes `CONTENT_PREVIEW` through `env`, so the value is fixed when the build runs. `pnpm start` without the variable serves the same content as the build.
- **Reason:** a preview build started without the variable rendered the static shell with drafts and the request time parts without them, which caused a real hydration mismatch on `/vergleich`.

## 2026-10-19: Forms never claim success without delivery

- **Decision:** the advice and newsletter forms call server actions (`app/actions/forms.ts`) that return a `FormResult`. Until a mail provider exists (Phase 4) they answer "Der Versand ist noch nicht eingerichtet." The success state appears only when the server returns `ok`. An E2E test guards this.

## 2026-10-19: Categories without published software are hidden

- **Decision:** `listCategories()` returns only categories with at least one visible profile. Navigation, footer, home and `/kategorien` follow it, and an empty category page calls `notFound()`. No "0 Programme" tiles.
- **Known limit:** dynamic slugs that are not prerendered (unknown or empty) render at request time, so the 404 page streams after the shell with status 200 and `noindex`. `dynamicParams = false` is not allowed with Cache Components. A hard 404 status needs a `proxy.ts` check against the known slugs; planned for the SEO work in Phase 5.

## 2026-10-19: Brand color fallback in profiles

- **Decision:** profiles use the neutral `#4a4fc4` as `brandColor` unless the vendor publishes a brand color we could verify (Clockodo `#3657f7`). The color only tints the logo placeholder; it is never used for UI tokens.

## 2026-10-19: Cost calculator compares paid plans only

- **Decision:** the calculator starts with the recommended paid plan and with yearly billing only when that plan has a yearly price. A plan that offers only one billing falls back to it and says so. Alternatives are compared with their cheapest paid plan that covers the user count; free plans are a different offer, not a cheaper price.

## 2026-10-19: Hydration errors seen only in the in-app browser pane

- **Finding:** React error #418 appeared in the desktop app's browser pane but never in a clean Playwright Chromium against the same build, and the E2E suite asserts no page errors on every template. The pane injects its own markup; no code change was made for it.

## 2026-10-21: Batch 2 profiles and the Sage portfolio

- **Decision:** 20 new profiles: all 13 Sage products listed on sage.com/de-de (Sage Active, Sage 50, Sage 50 Handwerk, Sage 100, Sage X3, Sage Intacct, Sage Operations, Sage b7, Sage Wincarat, Sage Lohnabrechnung, Sage HR, Sage HR Suite, Sage Sales Management) plus weclapp, Xentral, SAP Business One, Microsoft Dynamics 365 Business Central, DATEV Lohn und Gehalt, Lexware lohn+gehalt and CentralStationCRM. This fills the categories ERP, Lohnabrechnung and CRM so no Sage product stands alone.
- **Excluded:** HubSpot, Pipedrive and Zoho CRM. Their price pages load prices by geolocation or JavaScript; from our research environment they showed INR or nothing, so EUR prices could not be verified.
- **Facts:** prices and features from vendor pages on 21 October 2026, Sage prices from the product cards in the page source. Hosting stays `unbekannt` where the vendor does not state it (most Sage cloud products). Business Central hosting from Microsoft Learn (German localization in the Azure geography Germany). Microsoft's German imprint names the Microsoft Corporation, so `germanEntity` is false.

## 2026-10-21: Real vendor logos

- **Decision:** official logos from the vendors' own websites, preferably the square app icon (web app manifest or apple-touch-icon), otherwise the header logo. Sources per file in docs/LOGOS.md. SVGs are stripped of scripts, event handlers and external references. The schema now allows PNG and WebP next to SVG, because several vendors publish raster icons only.
- **Bug fixed:** LogoTile used `p-[14%]`; percentage padding resolves against the parent width, so in cards the padding exceeded the tile and the image collapsed to 0 × 0. Padding is now computed from the tile size.

## 2026-10-21: Long form reviews for every profile

- **Decision:** 42 MDX reviews in content/reviews, one per profile, structure: Einordnung, Für wen, Funktionen im Alltag, Preise und Kosten, Datenschutz/GoBD/E-Rechnung, Stärken und Schwächen, Alternativen, Fazit, and a note "So ist diese Bewertung entstanden". Titles use "im Überblick" (no hands on test). Claims we could not verify were removed during writing.
- **Context facts with sources:** E-Rechnung (receive since 1 January 2025, issue from 2027 above 800.000 € prior year revenue, 2028 for all; IHK Stuttgart), Mindestlohn 13,90 € since 1 January 2026 and 14,60 € from 1 January 2027 (Bundesregierung), duty to record working time (BAG 13 September 2022, 1 ABR 22/21; PwC Legal).
- **New MDX components:** `Kennzahlen`/`Kennzahl` (sourced key figures), `Preisvergleich` (entry price bars against the alternatives) and `Kostenvergleich` (monthly cost by team size). Charts read our profile data only. Flat plans without a stated user limit are left out of the cost by team size chart, because their price for larger teams is unknown.
- **Typography:** numbers and units in reviews are joined with a non breaking space ("50 %", "25 €").

## 2026-10-21: Deep review of the Sage portfolio

- **Research:** every Sage product page and subpage on sage.com/de-de was read (about 70 pages: prices, tariffs, add-ons, FAQ, marketplace, module pages, the Sage Preisübersicht and the trust page). All 13 Sage profiles and reviews were rewritten from these pages; reviews now run 900 to 1.450 words with tariff tables, add-on prices, cost examples and an "Angebotsgespräch" checklist where Sage publishes no prices.
- **Correction:** the Sage Active profile and review used the terms for subscriptions before 1 February 2026 (0,05 € per extra invoice, 5 € or 10 € per extra user). Current terms: 300 or 500 invoices included, invoice packages from 100 for 10 € to 10.000 for 500 €, 0,15 € per invoice beyond the package; extra Lohn employees 3 €. The old terms are now mentioned only as the rule for existing customers.
- **New facts in profiles:** Sage Intacct publishes list prices (Standard from 1.390 € with 2 Business Users, extensions priced individually) and lists GoBD, ISO 27001/27017/27018 and SOC 1/2 Type II, so `iso27001` is `ja`. Sage 50 names a Microsoft Azure data centre in Germany for its cloud services, Sage HR Suite a certified data centre in Germany with geo redundant backup, so both are `DE`; Sage 50 Handwerk's DMS archives in a German cloud data centre. Sage Lohnabrechnung asks for a data processing agreement before real data (`avv: ja`) and excludes Baulohn, company pensioners and the public sector. Sage Sales Management requires at least 5 users. Sage Operations got its two packages (Distribution, Distribution + Manufacturing) as plans without price.
- **Not taken over:** the Sage Sales Management page names native integrations with Sage 50 and Sage 200 in a Spanish paragraph; Sage 200 is not sold in Germany, so the review states this caveat instead of listing it as a fact. Demo figures in product screenshots (amounts in dashboards) were ignored.
- **New MDX component:** `Tabelle` (caption, header row, row headers, optional source) for tariff and add-on tables. Wide tables scroll inside a focusable region, never the page.

## 2026-10-22: Local site shows all content, no empty announcements

- **Problem:** the owner saw "0 Softwareprofile, 0 Kategorien" on localhost:3000. All 42 profiles are drafts, and `next dev` hid drafts unless CONTENT_PREVIEW=1 was set.
- **Decision:** `next dev` previews by default (next.config.ts checks the development phase), and `pnpm dev` builds a preview search index first. `CONTENT_PREVIEW=0 pnpm dev` shows the public view. Production builds are unchanged: drafts stay hidden until they are verified and published (Section 10 rules, "Unverified profiles are not published"). Draft pages keep their "Vorschau" notice.
- **No empty announcements:** the main navigation now leads with "Software" and hides Ratgeber and Leitfäden while they have no content. The home stats show the number of long form reviews instead of "0 Ratgeber". Until guides exist, /ratgeber lists the newest editorial reviews and /leitfaeden the category rankings. Without verified user reviews, profile and review pages invite a review ("Wie bewährt sich … in Ihrem Unternehmen?") instead of "Noch keine Nutzerbewertungen"; nothing is invented. Categories without software stay out of every menu.
- **Check:** a crawler over all 201 routes found no "0 …", "Noch keine" or "in Arbeit" texts; an E2E test guards home, Ratgeber, Leitfäden and a profile.

## 2026-10-22: Market data 2026 and animated key figures

- **Market data:** new collection `content/markt` (schema `MarketDataset`), 11 datasets, each with publisher, date, basis and period. Only primary sources, read in the original on 22 October 2026: Bitkom ITK forecast of 7 July 2026 (software 58,1 Mrd. €, +9,9 %; cloud software 42,5 Mrd. €; AI platforms 3,1 Mrd. €; ITK 246,4 Mrd. €), Bitkom Cloud Report of 17 June 2026 (86 % use cloud; providers used vs. preferred: USA 71/8, Germany 53/91, EU 45/68), Bitkom "Digitalisierung der Wirtschaft" of 11 March 2026 (AI use 17 % to 41 %, more digital investment 21/29/36 %, obstacles), Destatis press release 416 of 24 November 2025 (paid cloud services by company size, cloud applications, ERP and CRM 23 %), Destatis ICT topic page (AI 26 % in 2025, by size), Destatis SME page (3,2 Mio. companies, 99,3 % SMEs, 54 % of employees, 27 % of turnover, 2024).
- **Rejected:** a widely quoted "59 % use e-invoice standards" figure is from a Bitkom survey of June 2023 and was left out as outdated; Destatis topic pages without a publication date show "abgerufen am" instead of an invented date.
- **Home page:** bento section "Der deutsche Softwaremarkt in Zahlen" from `content/markt`; the dark section now shows our own data as cards (sources, server location and XRechnung distribution, DATEV share, median entry price per category, top five, trial and price transparency). Zero entries are left out.
- **Profiles:** new section "In Zahlen" for every profile: score ring with category rank, Deutschland-Check ring, entry price against the category median (same price basis only, logarithmic scale so one outlier does not squeeze the rest), plan ladder, cost by team size, scope facts and market context (preferred cloud provider origin; ERP or CRM cloud share where it fits). Cards without data are not rendered.
- **Motion (Section 5.6):** `components/ui/animated.tsx` with CountUp (600 ms, once), GrowBar, GrowColumn, GrowStack, Ring and SlideMarker. The server renders final values; the observer watches the stable track because a shape scaled to 0 has no area and would never count as visible. `prefers-reduced-motion` shows the final state at once (checked).
- **Colors:** only brand tokens (brand-500 highlight, brand-100/200 secondary, ink, positive for "erfüllt"); no gradients beyond the allowed ink glow.

## 2026-10-22: Report style for stats, more profile CTAs

- **Style (owner references: analytics dashboards and report decks):** stat areas are built as reports of split panels and cards: large radius (`rounded-xl`), generous padding (24 to 40 px), outline pills for periods, a round arrow button per panel (interactive control, links to the source or the profile section), big figures in Outfit 500 with a muted unit, tall columns with rounded tops and the highlighted value in a bubble, thick pill bars with the value right after the bar, a segmented half gauge of radial bars, and a 10 by 10 waffle where one cell is one percentage point. Colors stay brand tokens only (white, surface tint, brand-50 tiles, ink panels with the allowed ink glow, brand-500 for the one highlight).
- **Components:** `components/stats/parts.tsx` (Panel, Pill, ArrowLink, PanelHeader, Figure, Change, Columns, PillBars, SourceNote), `components/stats/market.tsx` (MarketReport), `components/stats/portfolio.tsx` (PortfolioReport), `components/stats/software.tsx` (KPI tiles, plans, check gauge, team costs, price against the category, market context), new primitives `ArcGauge` and `Waffle` in `components/ui/animated.tsx`.
- **Price comparison in profiles:** the log scale slider was replaced by three pill bars (own entry price, category median, cheapest entry), which reads at a glance; the most expensive entry is named in the note.
- **CTAs on every profile (Section 6, one orange button per block):** a "Nächster Schritt" split after the key figures (outgoing button labelled with the trial, e.g. "30 Tage kostenlos testen", plus tiles for the comparison with the two strongest alternatives and the free advice), a row after the review ("Passt … zu Ihrem Unternehmen?"), a row in the price section ("Aktuelle Konditionen beim Anbieter prüfen"), and an advice block before the author box. Outgoing links still go through AffiliateButton, so "Anzeige" and rel stay correct once deals exist.

## 2026-10-21: Launch content: publication, owner data, honest homepage

- **Publication:** the owner and editor in chief Wolfram Eschenbach approved all 42 profiles, their reviews and the six categories with software. Each profile is now `veroeffentlicht` and `verifiziert`: every fact traces to a vendor page stored in `editorial.sources` (at least two per profile, prices checked 19 to 21 October 2026). Fields we could not source stay "Keine Angabe". The guard warning "Autor und fachliche Prüfung sind dieselbe Person" remains, because the editorial team is one person.
- **Scores:** kept as researched editorial assessments from features, strengths, weaknesses, prices and the Deutschland-Check. A formula over our data was rejected: integrations and hosting are not recorded completely in every profile, so a formula would wrongly lower products such as Lexware Office. The basis of every criterion is now explained on /methodik#wertung.
- **Open house targets, accepted by the owner for launch:** 29 non-Sage reviews are 450 to 700 words, below the 900 word target for compact profiles (Section 15.6); there are no comparisons or Ratgeber articles yet to link from reviews.
- **Owner data in site.config.ts:** sole proprietorship of Wolfram Eschenbach, Textorstraße 11, 60594 Frankfurt am Main (the district name Frankfurt-Süd is not part of the postal address), wolfram.eschenbach@softwarekenner.de, +49 155 10075472, domain https://softwarekenner.de (from the e-mail domain), supervisory authority the Hessian data protection commissioner, inquiries kept six months after completion. Register, managing director and VAT ID are null and hidden; add the USt-IdNr. as soon as one exists. Only HOSTING_PROVIDER stays open until the site is deployed.
- **Homepage honesty fixes:** "Häufig gesucht" became "Direkt zu" (we have no search data), "Beliebte Software und Tools" became "Bestbewertete Software je Kategorie" (the list is sorted by score), the XRechnung list shows all nine programs instead of eight, the footer shows the owner's contact data instead of a newsletter that is switched off, the internal legal note renders only in the local preview, and forms without a mail provider tell visitors to write to the contact address.

## 2026-10-22: Footer, logo as favicon, Über uns and Impressum, Vercel

- **Footer (owner reference: Superfluid footer):** brand-500 surface with 1.5 px ink rules instead of the ink footer from Section 7.1, because the owner asked for this design one to one. Structure: three full width entry cells (Kategorien, Vergleiche, Beratung) with number, centered label and an arrow that turns on hover (ink fill, orange label); an advice block ("Lassen Sie sich kostenlos beraten", underlined "Beratung anfordern" row like the reference's e-mail field, owner contact data) or, once `features.newsletter` is on, the newsletter form in a new `onBrand` variant (white field, ink button, ink texts); link columns right aligned on desktop; the logo mark and brand name across the full width as one SVG with a fixed `textLength` (no measuring in the browser); three true facts with icons (Offene Methodik, Preise in Euro, Ohne Tracking-Cookies) and the disclosure line in two sentences. Ink on brand-500 is 9.5:1. The Section 5.2 colour ratio is exceeded on purpose in the footer; one line change back to `bg-ink-glow` if the owner prefers.
- **Logo mark:** `components/layout/logo-mark.tsx` holds the three block staircase once (wordmark, footer, Über uns). Favicon set from the same geometry: `app/icon.svg` (transparent, brand colours), `app/favicon.ico` (16, 32, 48 px), `app/apple-icon.png` (180 px on ink), manifest icons 192, 512 and maskable 512 in `public/icons`, and `app/manifest.ts`. The PNG and ICO files were rendered once with the sharp copy that Next.js already installs; no new dependency.
- **Über uns (owner reference: Nike Run+ case study sheet):** spec header with micro labels and the mark in an ink circle, a giant staggered uppercase headline (Outfit 500), a brand band with the logo mark as tonal super graphic and the four best rated products as logo circles, two floating data cards (profiles, categories and sources; best editorial score with bar), numbered pill sections (Über uns, So arbeiten wir, In Zahlen, Wer dahintersteht) and a giant closing link "Alle 42 Programme". Every number is computed from content (`getStats`, `getPortfolioStats`, sources per profile); the founder block uses the author data. No photo: the T-02 office image does not exist yet and no AI person may appear.
- **Impressum:** same editorial system (spec bar, giant title, numbered rows with heading left and data right). The legal content is unchanged; optional blocks stay hidden while their value is null.
- **Hosting:** the owner chose Vercel. `HOSTING_PROVIDER` is now "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA" (address and EU-U.S. Data Privacy Framework certification from vercel.com/legal/privacy-policy, as of 1 June 2026). New `legal.hostingDetails` for the privacy policy: functions in Frankfurt, static files from Vercel's worldwide network, transfer basis Art. 45 DSGVO plus standard contractual clauses. `vercel.json` sets `regions: ["fra1"]` (Section 8.4). No open placeholder remains. Before the first deployment: accept Vercel's DPA, set `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses pnpm 11 from `packageManager` (a 9.0 lockfile alone selects pnpm 9 or 10), and copy the variables from `.env.example`. The privacy text still needs the lawyer review (Section 19).

## 2026-10-22: First Ratgeber articles and a Kaufberatung per category

- **Decision:** seven Ratgeber articles in `content/guides` and six Kaufberatungen in `content/kaufberatung` (one per category with published software), published (`veroeffentlicht`) so they appear on the live site, author and reviewer Wolfram Eschenbach as for the profiles. Topics follow the compliance questions our profiles already check (E-Rechnung, GoBD, Arbeitszeit, Mitbestimmung, AVV, Kleinunternehmer) plus a method article on software selection. Each category also got four or five FAQ entries.
- **Sources:** only official or primary sources (BMF and the amtliches AO-Handbuch, gesetze-im-internet.de, Bundesarbeitsgericht, BMAS, Datenschutzkonferenz, Hessian data protection commissioner, EUR-Lex, Bundesregierung, Minijob-Zentrale, TK and AOK, IHK merit sheets, FeRD, ZDH, Bitkom and Destatis already used in `content/markt`), all accessed 22 October 2026. Direct page fetches were refused by the environment's network policy; the pages were read through the search tool. Facts with an open status are worded as such: the BMAS draft for the Arbeitszeitgesetz (June 2026, per the Bundestag lobby register) is described as not adopted; the EU-U.S. Data Privacy Framework as valid with the appeal C-703/25 P pending.
- **Product statements:** only what our verified profiles already say (for example Collmex creates no XRechnung, Sage Active sends e-invoices later, TimeTac charges for the DATEV export). No product is praised beyond its profile; every mention links to the profile data.
- **Not done:** Kaufberatungen run about 700 to 1.100 words plus FAQ, below the 1.500 to 2.500 words of Section 13.2. We preferred shorter texts over padding; extend them with hands on observations once tests exist. The CRM Kaufberatung names honestly that HubSpot, Pipedrive and Zoho are missing (prices not verifiable in EUR, see 2026-10-21).
- **Schema:** Guide `categories` (listing on category pages), `software` (cards after the body), `keyPoints` ("Das Wichtigste in Kürze", quotable for search and AI assistants, Section 20), `navTitle` (short label for footer and menus, max 24 characters) and `featured` (lead article). BuyingGuide `keyPoints`. Guards check that categories and programs resolve, warn when a published guide lists an unpublished program, and lint the new strings.

## 2026-10-22: Editorial system of Über uns for Ratgeber, Kaufberatung and home

- **Decision:** the owner asked for the articles to follow the style of the Über uns page. Its parts moved to `components/content/editorial.tsx` (PillHeading, SectionRule, SpecBar, BandGraphic, NumberedPoints, EditorialList, SourceList) and Über uns uses them from there. The Ratgeber hub has a spec header, a giant staggered uppercase headline, the lead article as a floating card on the brand band, then numbered ink rule lists of all articles and of the Kaufberatungen. Articles have the spec bar, a large sentence case headline (long German compounds do not fit in uppercase at 360 px), numbered key points, a reading column with the sticky table of contents, program cards, sources, author and related articles. Category pages show the Kaufberatung in the same system with its own table of contents and sources, plus "Passende Ratgeber". Profiles link the matching Kaufberatung and Ratgeber. The home page gets "Neu im Ratgeber" before "So bewerten wir" (Section 13.1 block 12) with Kaufberatung links per category, and the E-Rechnung block links its Ratgeber.
- **Anchors:** MDX `h2` get ids from `lib/content/outline.ts`, which derives the table of contents from the source with the same slug rule; a unit test keeps both in sync.
- **Footer:** long guide titles in the no wrap footer column caused horizontal scroll at 390 px and at 1440 px. The footer now uses `navTitle` and lets the Ratgeber column wrap.
- **Sitemap:** `app/sitemap.ts` did not exist although robots.txt pointed to it. It now lists every indexable page with `lastModified` from the content; noindex pages (search, confirmation, review pages without reviews) and the styleguide stay out.
- **tailwind-merge:** a `leading-*` class placed before a `text-[size]` class in `cn()` is dropped. Editorial titles put the line height after the size.

## 2026-10-22: Indexing on, keywords from the results pages, share images

- **Indexing:** the root layout still had `robots: noindex, nofollow` from Phase 0 ("switched on in Phase 6"), so no page could be indexed. Since the launch content is published, the site is now `index, follow` with `max-image-preview: large`; pages that must stay out keep their own `noindex`. `metadataBase` is the domain. Optional ownership tags for Google and Bing come from env.
- **Keywords:** the owner asked for researched, high volume keywords. Semrush had no API units, the Ahrefs plan lacks Keywords Explorer, and Google Trends and autocomplete were unreachable from the research environment, so no measured volumes were available. Titles and descriptions follow the wording of the pages ranking on google.de for each topic instead (docs/SEO.md lists the evidence). To be replaced by Search Console data after launch.
- **Titles:** category SEO titles carry a `{jahr}` token filled from `updatedAt`, so the year can never be older or newer than the content. Guides get an optional `seoTitle` (max 60) for the result page while the H1 keeps the full title. Profile titles name the year of the last update and "Preise und Alternativen"; `/preise` and `/alternativen` name the year of their data. Descriptions are cut at a word boundary (`metaDescription`) instead of in the middle of a word.
- **Share images:** `next/og` cards in brand colors with static Outfit and Work Sans instances (`assets/fonts/og`, built by `pnpm fonts:build`, because next/og reads no variable fonts). A default image plus one per guide, category and profile (score and entry price). Config images replace file images in child segments, so `pageMetadata` sets the default image only when a route has no image file (`ownImage`).
- **Structured data:** FAQPage for category FAQs, logo and address for the Organization, image for Article.
- **Not done:** a hard 404 for unknown slugs via `proxy.ts`; the Next 16 docs advise against shared modules in Proxy, and those pages already carry `noindex`.
- **AVV article:** a section on the official templates (EU standard clauses 2021/915, BfDI Mustervereinbarung 2.1, Hessian Formulierungshilfe), because people search for "AVV Muster" and the article title now names it.

## Newsletter (24 October 2026)

- **Decision:** `features.newsletter` is on. Dedicated page `/newsletter` (Inhalt, Versprechen, Ablauf, FAQ, sticky Anmeldekarte), a newsletter block in the footer (headline, one line of benefit, form, link to the page, owner address below a rule), "Newsletter" in the footer column Unternehmen, entry in the sitemap, Resend named as processor in the privacy policy.
- **Mail setup:** domain softwarekenner.de is verified in Resend (region eu-west-1). Sender `newsletter@softwarekenner.de`, own Resend segment "Softwarekenner Newsletter" (the account's "General" segment is shared with other sites). Values live in `.env.local` (not committed); the same variables must be set in Vercel.
- **No invented proof:** the page names no subscriber count, no archive and no sample issue, because none exists yet.
- **Open:** Resend's privacy details (DPA, transfer basis) are to be checked with the privacy policy review; the first issue is sent as a Resend Broadcast to the segment.

## Partner programs and affiliate disclosure (23 October 2026)

- **Decision:** active affiliate deals for weclapp, easybill (both direct UTM links, network `direkt`) and Pipedrive (PartnerStack). New researched profiles and reviews for Pipedrive (CRM) and easybill (Buchhaltung, Rechnungsprogramme). Euro prices for Pipedrive come from the per currency price table embedded in pipedrive.com/de/pricing (the page shows USD to non EU visitors).
- **Home page:** new block "Software unserer Partner" right after the category ranking: labeled "Anzeige" and "Partnerangebote", alphabetical, with the unchanged editorial score, "*" and `rel="sponsored nofollow noopener"` on every outgoing link, and the sentence that it is not a ranking. Data from `partnerOffers()`, so a new deal only needs `affiliate.active` in the profile. The hero trust line now says the site is financed through labeled affiliate links.
- **`/go`:** network `direkt` keeps the partner URL unchanged (no added sub id), unit tested.
- **Disclosure:** Transparenz lists the current partner programs from content; the comparison page shows the affiliate sentence when one side has a deal; the privacy policy describes affiliate clicks (only a placement id, partner side cookies are the partner's responsibility) and names Resend (Plus Five Five, Inc.; DPF and SCCs per its DPA) in its own section, which fixes the earlier contradiction.
- **Not added:** FreshBooks fails rule 3 (USD only, US region, no German page, no German support). Odoo: the given link (sl1nk.com) lands on a Portuguese link shortener page with AdSense ads instead of Odoo; it needs the official Odoo partner link before a profile and deal make sense.
- **FastBill (added the same day):** FastBill GmbH, Frankfurt am Main, direct UTM link (network `direkt`), profile and review in Buchhaltung and Rechnungsprogramme. Logo: the green mark cut from the official wordmark SVG (fastbill.com/themes/custom/fastbill/logo.svg), because the site offers no square icon.
- **Fix:** the cost chart only says "am wenigsten" when at least two programs have a price at 10 users.

## Vercel Web Analytics (24 October 2026)

- **Decision:** `@vercel/analytics` 2.0.1 (pinned) with `<Analytics />` in `app/layout.tsx`. It is cookieless and loaded from our own domain, so `CONSENT_SERVICES` stays empty and no banner appears; Section 19 asks for cookieless analytics. It runs next to the optional provider in `lib/analytics` (still off). The privacy policy now describes it (Art. 6 Abs. 1 lit. f DSGVO), to be confirmed in the lawyer review.
- **Owner step:** switch on "Web Analytics" in the Vercel project (Analytics tab) once; without it the script receives no data.

## Sage partner program (26 October 2026)

- **Decision:** one Sage affiliate link from the owner (`https://sagegmbh.sjv.io/5kE542`, Impact, network `impact`) for all 13 Sage profiles. Every Sage CTA goes through `/go/<slug>`, which appends `subId1` with the placement id; checked on 26 October 2026 that Impact keeps `subId1` and lands on sage.com/de-de with its tracking parameters. Because the link is not product specific, visitors from every Sage profile land on the Sage Germany home page, not on the product page.
- **Disclosure:** Transparenz and the home partner block pick the Sage products up from content; the privacy policy now names Impact next to PartnerStack.
- **Home partner block (same day, owner request):** the 13 Sage programs show as one "Sage" card instead of 13 rows. Programs of one vendor behind the same partner link are grouped (`groupByPartnerLink`, unit tested). The card shows the score range instead of one score, "Preise je nach Programm" instead of a price (units differ), and links every Sage review; its button goes to `/go/sage`, which resolves the vendor's shared link. Profiles, category lists and Transparenz still show each Sage program on its own.
