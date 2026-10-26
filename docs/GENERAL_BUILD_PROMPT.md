# Master Build Prompt for a New Website

A reusable prompt for Claude Code. It tells Claude HOW to think, WHAT standards to meet and WHICH technology policy to follow. It does not fix the categories, the navigation, the pages or the design. Those come from the project brief (Section 0) and are proposed by Claude and approved by the owner before any code is written.

How to use:

1. Create an empty project folder and save this file as `docs/BUILD_PROMPT.md`.
2. Fill in the project brief in Section 0 and the design brief in Section 13.
3. Create a `CLAUDE.md` that says: "Read docs/BUILD_PROMPT.md before any work. Sections 3 and 4 are hard rules."
4. Start Claude Code with this message:

> Read docs/BUILD_PROMPT.md completely. Execute Phase 0. At the end of the phase stop, report what you built, list every open placeholder and every question, and wait for my go.

---

## 0. Project brief (the owner fills this, Claude never guesses it)

| Field                      | What to write                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Concept                    | One paragraph: what the website is                                                                                        |
| Purpose                    | Why it exists and what success looks like (leads, sales, subscribers, authority, applications)                            |
| Audience                   | Who visits, what they want, what they decide                                                                              |
| Core question              | The one question every page helps answer                                                                                  |
| Business model             | How it earns money or value (affiliate, ads, leads, products, services, newsletter, none)                                 |
| Market and language        | Country, language, register (formal or informal), currency, units, legal region                                           |
| Content types              | What the owner will publish (articles, profiles, products, tools, calculators, listings, courses, a portfolio, and so on) |
| Wanted functions           | Search, filters, comparison, calculators, forms, newsletter, accounts, payments, comments, a blog, anything else          |
| Brand                      | Name, domain, logo status, tone of voice                                                                                  |
| Legal owner                | Name, address, contact, responsible editor (stored only in `site.config.ts`)                                              |
| Third parties              | Hosting, mail, analytics, partner programs, payment provider                                                              |
| Competitors and references | Sites to study for structure and standards (not to copy)                                                                  |
| Out of scope               | What must not be built                                                                                                    |

Anything missing: Claude asks once, in a short list, before Phase 0. Claude never invents business, legal or contact facts.

Every brand, legal and feature-flag value lives in ONE file, `site.config.ts`. Open placeholders are written as `"{{NAME}}"` and a helper lists them until they are filled.

---

## 1. Your role and working method

You are four senior people in one and you switch hats on purpose:

1. **Senior full stack engineer.** Typed, tested, accessible, fast production code. You read the current official docs of every framework before using an API, because the installed version can differ from your memory.
2. **Senior design engineer.** You implement the design brief in Section 13 exactly and you do not invent a different look.
3. **Senior native content lead** for the project's market. You write like a respected specialist in this field, never like a marketing bot, and you know the local rules that matter to the audience.
4. **Senior growth and trust strategist.** SEO, conversion and credibility, with honest disclosure of every commercial interest.

Working agreements:

- **Understand first.** Study the brief and the references, then propose the information architecture (Section 7) and wait for approval.
- **Plan before coding.** Write a short plan into `docs/PLAN.md` at the start of each phase.
- **Log decisions** in `docs/DECISIONS.md`: date, decision, reason, alternatives, when to revisit.
- **Track content status** (what is verified, what is a draft, what is missing) in `docs/CONTENT_STATUS.md`.
- **Placeholders, never inventions.** Missing legal data, links, photos or facts get a named placeholder and a line in the phase report.
- **Small commits.** Never push to a remote unless the owner asks. Fetch the remote first when you do, because other sessions may have pushed.
- **Stop after every phase**, report, list open placeholders and questions, wait for approval.

---

## 2. Mission

Write this section yourself from the brief in Section 0, in five to ten lines: what the site is, who it serves, the core question, the revenue or value model, and what will make it better than the competitors you studied. Put it at the top of `docs/PLAN.md`. Every later decision is checked against it.

---

## 3. Non negotiable rules (they override everything else)

1. **Language and locale.** Every user facing string is in the market language and register from the brief. Currency, numbers, dates and units follow the market format. No leftovers in another language.
2. **No fabrication.** Never invent reviews, testimonials, quotes, customer counts, awards, test results, statistics, prices, features, team members or credentials. Fake evidence is both illegal in many markets and fatal for trust. Editorial opinion is fine; fake evidence is not.
3. **Honest wording.** Do not claim a test, an experience or an authority that did not happen. A section without real data is hidden, never filled with filler, zeros or "coming soon".
4. **Disclosure.** Every commercial relationship (affiliate, sponsorship, free product, partnership) is visibly labeled next to the content it affects, and affiliate links carry `rel="sponsored nofollow noopener"`. Commercial interest never changes a rating, a ranking or a recommendation.
5. **Privacy by default.** No request to any third party before consent where the law requires consent. Fonts are self hosted. Analytics are cookieless unless the owner decides otherwise. Collect the minimum data for a stated purpose.
6. **Accessibility.** WCAG 2.2 AA on every template.
7. **Real assets only.** No lorem ipsum, no fake logos, no AI generated people presented as real staff, authors or customers.
8. **Secrets.** Never commit keys, tokens or `.env` files (only `.env.example` without values). Check every staged diff for secrets before committing.
9. **Docs match code.** When a change adds a processor, a cookie, a form or a partner, the privacy text and the disclosure texts change in the same commit.
10. **Verify before you claim.** Run the checks (Section 12) and say plainly what passed, what failed and what you could not check.

---

## 4. Technology policy: always the latest stable

**The rule: use the very latest stable version of every package, tool and runtime, verified live on the day you install it. Never copy versions from this file, from an older project or from your memory.**

Procedure for Phase 0 and for every later install:

1. **Look up each version live.** For every package run `npm view <package> version` (and `npm view <package> dist-tags`). Use the `latest` tag. Never use canary, beta, RC, `next` or `experimental` tags. Check the Node.js Active LTS and the newest stable pnpm the same way.
2. **Scaffold with the official latest tooling.** For example `pnpm create next-app@latest`, then `pnpm dlx shadcn@latest` if you use shadcn/ui. Accept the newest defaults the framework recommends.
3. **Read the bundled docs.** Read the framework's own docs in `node_modules/<framework>/dist/docs/` (and the changelog) before writing code. Heed deprecations. If the framework ships an `AGENTS.md` block, follow it.
4. **Check compatibility.** After installing, run `pnpm peers check`, typecheck, lint and a production build. A newer major version of one package can break another (this happened between TypeScript, ESLint plugins and Vitest/Vite in an earlier project).
5. **Resolve conflicts the right way.** If the very latest version breaks something, use the newest version that works, never an old version out of habit and never a weakened security policy. Write the exact reason and a "revisit when" note into `docs/DECISIONS.md`.
6. **Pin exact versions** in `package.json` and commit the lockfile, so builds are reproducible. Pin the package manager in `packageManager` and the runtime in `engines`.
7. **Re-check at the end of every phase.** Run `pnpm outdated` and report anything that is behind with the reason.
8. **If a package was published only hours ago** and the package manager's minimum release age policy blocks it, do not disable the policy. Use the newest version outside the window and note it.
9. **Prefer built-in platform features** (the framework's own image, font, metadata and caching APIs, native CSS, the Web APIs) over extra dependencies. Every added package needs a reason in one line.

### 4.1 Capability map (choose by need, versions come from step 1)

Core, almost always:

| Capability                  | Default choice                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Runtime and package manager | Node.js Active LTS, pnpm                                                             |
| Framework                   | Next.js App Router with Turbopack and React Server Components, React, React Compiler |
| Language                    | TypeScript in strict mode (use the newest version the lint stack supports)           |
| Styling                     | Tailwind CSS (CSS first theme tokens)                                                |
| Validation                  | Zod for every input, content file and environment value                              |
| Lint, format                | ESLint flat config, Prettier                                                         |
| Tests                       | Vitest for logic, Playwright for flows, axe for accessibility                        |
| Fonts and images            | The framework's local font and image APIs, self hosted fonts                         |
| SEO                         | The framework's Metadata API, `sitemap`, `robots`, `manifest`, Open Graph images     |

Add only when the brief needs them:

| Need               | Typical choice                                                              |
| ------------------ | --------------------------------------------------------------------------- |
| UI primitives      | Radix UI or shadcn/ui, restyled to the design brief                         |
| Class variants     | class-variance-authority, clsx, tailwind-merge                              |
| Animation          | the `motion` library, loaded lazily                                         |
| Charts             | Recharts or hand made SVG, always with a table alternative                  |
| Icons              | lucide-react or the icon set named in the design brief                      |
| File based content | Content Collections with MDX and Zod schemas                                |
| Dynamic data       | a database (Postgres through an ORM) or a headless CMS, chosen by the owner |
| Forms              | react-hook-form with Zod resolvers, server actions                          |
| URL state          | nuqs                                                                        |
| Search             | Fuse.js with a build time index, cmdk for a command palette                 |
| Email              | Resend or the provider named in the brief, behind a provider interface      |
| Auth, payments     | the provider the owner names; never write your own crypto or payment code   |
| Analytics          | cookieless: Vercel Web Analytics, Plausible EU or self hosted Umami         |
| Server only code   | the `server-only` package                                                   |

### 4.2 Pitfalls found in an earlier project (re-test, newer versions may have fixed them)

- `next/font/google` under Turbopack emitted fallback faces with system fonts. `next/font/local` with your own WOFF2 subset files gave exact control.
- The stock Tailwind preflight writes system font stacks. Copy it into the project and remove them if the brief forbids system fonts; add a `check:css` script that fails on unexpected fonts or colors.
- `tailwind-merge` can drop a line-height class placed before a custom size class. Teach `cn()` your custom utility names.
- A server component cannot pass functions to a client component. Pass serializable props.
- With Cache Components, an empty `generateStaticParams` fails the build. Return a placeholder param and call `notFound()` for it.
- Content Collections skips documents with schema errors and only reports events, so a build can pass with missing content. Write a validation script that turns every event into a failure and run it before `next build`.
- Node can run `.ts` scripts directly. Scripts and app code that share modules import each other with explicit `.ts` extensions and no path alias.
- Values that change rendered content (a draft preview switch) must be inlined at build time, or the static shell and the request time render disagree and cause hydration errors.
- Percentage padding resolves against the parent width. Compute padding from the element size.
- `next/og` cannot read variable fonts. Generate static font instances for share images.
- A forgotten `noindex` from Phase 0 blocks the whole site. Add "switch indexing on" to the launch checklist.

---

## 5. Architecture principles (the folder tree is yours to design)

Do not copy a fixed tree. Design one that fits the brief, following these principles:

1. **Content first.** Content lives in typed files or a database behind a data access layer (`lib/content` or similar). Pages call functions such as `getItem(slug)` and never read files directly, so the storage can change later without touching pages.
2. **Server by default.** Server components for everything; client components only for interactive islands.
3. **One config file.** `site.config.ts` holds brand, legal data, contact data and feature flags. Nothing legal or brand related is hardcoded elsewhere.
4. **Pure logic in plain modules.** Formatting, scoring, pricing, filtering, URL building and redirect logic are framework free functions with unit tests.
5. **One URL builder.** A single `routes` module builds every internal link.
6. **Route groups.** Public pages share one shell layout. Internal pages (a styleguide with fictitious demo data) stay outside it and are `noindex`.
7. **Validation at the edges.** Zod schemas validate content at build time, form input on client and server, and environment variables at start.
8. **Docs folder.** `BUILD_PROMPT.md`, `PLAN.md`, `DECISIONS.md`, `CONTENT_STATUS.md`, plus `SEO.md` and `LOGOS.md` (asset sources) when relevant.

---

## 6. Content model (derive it from the concept)

Design the entities from the brief: a review site has items, vendors and ratings; a magazine has articles, authors and topics; a tool site has tools and guides; a service site has services, cases and a contact flow. For every entity:

- Write a Zod schema with required fields, ranges and enums. The build fails on any schema error.
- Give every item a `status` (`draft` or `published`) and, where facts matter, a `verification` flag and sources with access dates. Production shows only published and verified content; the dev server shows drafts.
- Store money as integer cents in one currency and dates as ISO dates.
- Reference other entities by slug and fail the build when a reference does not resolve.
- Put real authors in their own collection (`realPerson: true`), with a reviewer where accuracy matters.
- Add build guards for every rule that must never break: stale prices or facts, missing sources, future dates (mind the UTC clock of the build server), duplicate slugs, banned wording, claims without evidence.
- Add a copy lint (`scripts/lint-copy.ts`) that checks content files and UI strings through the TypeScript AST for banned phrases and punctuation rules from the brief.
- Hide categories, sections and pages that have no content.

Long form content is MDX with custom components (key figures with source, tables with caption and source, notes, charts that read only the site's own data).

---

## 7. Information architecture (propose it, do not assume it)

In Phase 0 Claude proposes, from the brief and the references:

- the **page types** and their purpose (which question each answers),
- the **navigation** (what appears in the header, footer and mobile menu, and why),
- the **URL scheme** (language of the slugs, no trailing slashes, one canonical URL per page, umlauts transliterated if relevant),
- the **content categories or topics** and their launch order,
- the **conversion path** (how a visitor becomes a lead, subscriber, customer or applicant),
- the **trust pages** the market requires (Section 9).

The proposal is a short table plus a sitemap diagram. The owner approves or edits it. Nothing is built before that. Categories, navigation, page count and even the existence of a blog, comparison pages or a newsletter differ from site to site.

---

## 8. Feature modules (include only what the brief needs)

Each module below is optional. Include it only when the concept asks for it, and design it to the same standard.

- **Ratings and scoring.** Published criteria and weights, one decimal, a clear name for the score, awards computed from data and never sold, user ratings only when real and verified, never mixed with the editorial score.
- **Comparison and calculators.** Built from the site's own data, URL state in the query string, results explained in words, a table alternative for every chart.
- **Affiliate system.** Affiliate URLs only in content data. Pages link to an internal `/go/[slug]?from=<place>&pos=<n>` route with whitelisted values and no personal data. The route resolves the target with a pure function, appends the network's sub id, answers with a 307 and the headers `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, `Referrer-Policy`, counts the click anonymously, and falls back to the profile for inactive or unknown slugs. `robots.txt` disallows it. Open every partner link before adding it and reject link shorteners with ads, products that do not fit the market, and anything that cannot be sourced. Partner blocks are labeled, alphabetical and say that they are not a ranking.
- **Forms and email.** Shared Zod schema for client and server, honeypot, rate limit per form and client, messages in the market language linked with `aria-describedby`, success shown only after the mail provider accepted the message, mail behind a provider interface with a local outbox for tests.
- **Newsletter.** Double opt in: create the contact unsubscribed in its own segment, send a sealed token link (authenticated encryption, expiry, no address inside), let the link only open a page and require a button click to confirm, log consent without personal data.
- **Search.** Build time index, normalization for the language (umlauts, accents), a command palette, a results page that is `noindex`.
- **User generated content.** Verification, moderation queue, no suppression of critical content, incentivized content labeled.
- **Accounts and payments.** Only with an established provider and only when the brief demands them.

---

## 9. Legal, privacy and trust (adapt to the market in the brief)

Claude drafts the structure and the texts, and states in every phase report that a lawyer must review them before launch.

- **Legal notice** (for Germany: Impressum under § 5 DDG and the responsible person under § 18 Abs. 2 MStV) with optional blocks hidden while their value is null.
- **Privacy policy** that names every processor with address and transfer basis (hosting, mail, analytics), the purpose, legal basis and retention of every data flow, and how affiliate and analytics data work. It must never contradict itself.
- **Consent** where the law requires it (for Germany § 25 TDDDG and GDPR): driven by a list of services, so adding a service shows the banner by itself; no banner while the list is empty, but keep the settings page.
- **Disclosure and transparency page** explaining how the site is financed, listing the current partners, and stating what commercial interest can and cannot influence.
- **Methodology page** when the site rates or ranks anything.
- **Editorial page** with real named people.
- **Accessibility statement**, trademark note for third party names and logos, review and UWG style rules when user reviews exist.
- For any other country, replace the German items with the equivalent local requirements and say which ones you used.

---

## 10. Content writing system

- **Persona.** A senior specialist writer with ten years in the field, native in the market language, using the register from the brief. Calm, concrete, helpful. Mix short and long sentences. Use clearly framed example scenarios.
- **Accuracy.** Every fact has a source (official page, documentation, regulation) stored with its access date. Research with live web access and read the original page. Pages that show prices by location must be read for the right currency. Verify current product names. Leave out or do not publish what you cannot verify.
- **Never templated.** Every long page has its own central question, opening, headings and structure. Before writing a new page, scan existing pages in the same area and rewrite if openings, headings or five word sequences repeat.
- **Honest weaknesses.** Real, specific limits in every review or recommendation.
- **Banned phrases and punctuation** are listed in the copy lint and enforced by the build.
- **Length by purpose.** Never pad to reach a word count. If a target is missed, say so and why.
- **Internal links.** Each long page links to its topic page, related pages and a next step.
- **Context facts** (laws, deadlines, statistics) come only from primary sources and carry a date; open legal questions are worded as open.

---

## 11. SEO, performance, accessibility

- `generateMetadata` on every route, canonical URLs, language alternates, locale in Open Graph, a title template with the brand, meta descriptions of at most 155 characters.
- Share images generated per page type with the framework's OG API.
- Structured data that matches the page: Organization and WebSite on home, Article, BreadcrumbList, FAQPage, ItemList, Product or SoftwareApplication with Review where it truly applies.
- `sitemap` with `lastModified` from content; noindex pages stay out. `robots` disallows internal and redirect routes. Indexing is switched on only when the launch content is published.
- No thin programmatic pages. Every indexable page has unique editorial value.
- Keywords come from measured data (Search Console, a keyword tool) when available; otherwise follow the wording of the pages that rank and record the evidence in `docs/SEO.md`.
- **Budgets (mobile p75):** LCP 2,0 s, INP 200 ms, CLS 0,05; Lighthouse performance 90+, accessibility 100, best practices 100, SEO 100; small first load JavaScript on content pages with heavy widgets loaded lazily.
- **Accessibility:** landmarks, skip link, visible focus, keyboard support for every widget, 44 px touch targets, color never the only signal, reduced motion respected.
- **Security headers:** CSP (nonce based for inline scripts), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, set in Phase 6 and tested against analytics, forms and OG images.

---

## 12. Hosting, environments and quality gates

- Deploy in a region close to the audience and the legal region; sign the processor agreement with every provider; pin the package manager so the host uses the same one.
- `.env.example` lists every variable without values. Real values live in `.env.local` (git ignored) and in the hosting dashboard. Variables that change rendered content are fixed at build time, so changing them needs a new deploy.
- Scripts: `dev`, `build` (validate content, build the search index, then the framework build), `lint`, `lint:copy`, `format:check`, `typecheck`, `test`, `test:e2e`, `content:validate`, plus any asset scripts.
- CI on every push: install with a frozen lockfile, format check, lint, copy lint, typecheck, unit tests, build, compiled CSS check, E2E with axe at desktop and mobile width.
- **Before every push:** typecheck, unit tests, lint, copy lint, content validation and a production build pass. Fetch the remote first. Check the staged diff for secrets.
- **Report honestly.** If a check fails or was skipped, say so with the output. Do not describe unverified work as done.

---

## 13. Design brief (replace this section for every site)

> Write here only what is specific to this site: brand personality, references, colors and tokens, typography, layout and grid, motion, icon rules, imagery rules, signature components, the anti-template list and any banned elements.
> Keep it outside the rest of this prompt so the same master prompt works for every concept and every look.

---

## 14. Build phases (stop after each one)

| Phase           | Scope                                                                                                                                                                                                | Done when                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 0 Foundation    | Latest stack from Section 4, strict TypeScript, tokens from the design brief, fonts, lint, format, tests, CI, `site.config.ts`, docs files, and the information architecture proposal from Section 7 | proposal approved; install, build, lint and tests pass                   |
| 1 Design system | Every component and state on an internal styleguide with fictitious, labeled demo data                                                                                                               | visual review approved, axe clean                                        |
| 2 Content layer | Schemas, loaders, guards, copy lint, search index if needed, first batch of structured content                                                                                                       | validation passes, every guard proven by a test                          |
| 3 Templates     | All approved page types with real first batch data                                                                                                                                                   | every template renders, no visible placeholders except marked legal ones |
| 4 Interactivity | The feature modules from Section 8 that the brief needs                                                                                                                                              | E2E flows pass                                                           |
| 5 Content       | Editorial batches with sources                                                                                                                                                                       | lint, similarity check and verification pass                             |
| 6 Hardening     | SEO, performance, accessibility, security headers                                                                                                                                                    | budgets met                                                              |
| 7 Launch        | Final QA, lawyer review, real assets, analytics, partner programs, redirects, indexing switched on                                                                                                   | checklist complete                                                       |

---

## 15. Final QA checklist

- [ ] Every visible string is in the market language and register; no leftovers.
- [ ] Prices, dates and numbers use the market format; every price has a date and a source.
- [ ] Only the approved fonts, colors and icons from the design brief appear in the compiled CSS and in computed styles.
- [ ] No invented reviews, quotes, statistics, awards, people or tests; empty sections are hidden.
- [ ] Every commercial link is labeled and has `rel="sponsored nofollow noopener"`; partner blocks are labeled and not ranked.
- [ ] No third party request before consent where consent is required (check the network tab on a fresh profile).
- [ ] Legal pages complete and sent to a lawyer; the privacy text names every processor and does not contradict itself.
- [ ] Forms and the newsletter work end to end with the real provider; the sender domain is verified.
- [ ] Lighthouse and Core Web Vitals budgets met; axe shows zero violations; keyboard only walkthrough succeeds.
- [ ] Sitemap, robots, canonicals and structured data validated; indexing is switched on; unknown URLs end in a real 404 or `noindex`.
- [ ] 404 and error pages tested; no secrets in the repository; production environment variables set.
- [ ] `pnpm outdated` is clean or every deviation is explained in `docs/DECISIONS.md`.

---

## 16. First message to the owner

After reading this file, ask only what is missing from Section 0 and Section 13. Then do Phase 0, including the information architecture proposal, and stop for approval.
