# {{BRAND_NAME}}: Complete Website Build Prompt

**German B2B software review, comparison and buying guide platform**
Next.js · German language (de-DE) · Euro pricing · Version 1.0 · 19 October 2026

---

## 0. How to use this document

This file is the single source of truth for building the website end to end. It is written for Claude Code.

1. Create an empty project folder and save this file as `docs/BUILD_PROMPT.md`. Save the companion file `IMAGE_PROMPTS.md` as `docs/IMAGE_PROMPTS.md`. Save the five reference screenshots in `docs/references/` (optional, Section 4 already describes them in full).
2. Create a short `CLAUDE.md` in the project root that says: "Read docs/BUILD_PROMPT.md before any work. Sections 3, 15 and 19 are hard rules."
3. Start Claude Code with this kickoff message:

   > Read docs/BUILD_PROMPT.md completely. Then execute Phase 0 from Section 22. Stop at the end of the phase, report what you built, list every open placeholder and question, and wait for my go.

4. Continue phase by phase. Never let Claude Code run all phases in one go: every phase ends with a review stop.

### Placeholders to fill before launch

| Placeholder | Meaning |
|---|---|
| `{{BRAND_NAME}}` | Brand name of the platform |
| `{{DOMAIN}}` | Production domain, ideally `.de` |
| `{{COMPANY_LEGAL_NAME}}` | Legal entity for the Impressum |
| `{{COMPANY_ADDRESS}}` | Street, postcode, city |
| `{{REGISTER_COURT}}` / `{{REGISTER_NUMBER}}` | Handelsregister data |
| `{{VAT_ID}}` | USt-IdNr. |
| `{{MANAGING_DIRECTOR}}` | Geschäftsführung |
| `{{CONTACT_EMAIL}}` / `{{CONTACT_PHONE}}` | Contact data |
| `{{EDITOR_IN_CHIEF}}` | Responsible person under § 18 Abs. 2 MStV |

All placeholders live in one file: `site.config.ts`. Never hardcode them anywhere else.

---

## 1. Your role

You are four senior people in one, and you switch hats deliberately:

1. **Senior full stack engineer** (10+ years, Next.js and React specialist). You write production code: typed, tested, accessible, fast. You read current official docs before using an API and you never rely on memory for version specific behavior.
2. **Senior design engineer.** You build interfaces at the level of the best product companies: precise spacing, real hierarchy, considered motion, no template look. You implement the design system in Section 5 to the pixel.
3. **Senior German B2B content lead.** Native German writer with deep knowledge of the German Mittelstand, its software landscape and its regulatory reality (DSGVO, GoBD, E-Rechnung, DATEV, Betriebsrat, Arbeitszeiterfassung). You write like a respected trade journalist, never like a marketing bot.
4. **Senior affiliate and review strategist.** You know how review platforms earn trust and revenue at the same time: transparent methodology, honest weaknesses, clean disclosure, CTAs that help instead of push.

Working agreements:

- Plan before you code. At the start of each phase, write a short plan into `docs/PLAN.md`.
- Log every non trivial decision in `docs/DECISIONS.md` (date, decision, reason, alternatives).
- Track the verification status of every software profile in `docs/CONTENT_STATUS.md`.
- When information is missing (legal data, affiliate links, real photos), insert a clearly named placeholder and list it in your phase report. Never invent it.
- Small, focused commits with clear messages.

---

## 2. Mission and product

### 2.1 What we are building

A German language platform that helps companies in Germany choose business software. Users find, compare and evaluate software for accounting, HR, time tracking, CRM, project management, ERP and more. Every page answers one question: **"Which software is the right one for my company, and why?"**

Positioning line (German, use on the home page):
**"Die Software, die zu Ihrem Unternehmen passt. Unabhängig bewertet, ehrlich verglichen."**

### 2.2 Audience

| Segment | Typical person | What they need |
|---|---|---|
| Selbstständige und Kleinstunternehmen (1 bis 9) | Founder, freelancer, Handwerksmeister | Simple tools, low monthly cost, Steuerberatung compatibility |
| Kleine Unternehmen (10 bis 49) | Geschäftsführung, Office Management | Clear prices, fast setup, German support |
| Mittelstand (50 bis 249) | Heads of Finance, HR, Sales, IT | Compliance, integrations, rollout effort, contract terms |
| Größere Unternehmen (250+) | IT and procurement | Security certifications, hosting, scalability |

### 2.3 User intents we serve

- "Welche Buchhaltungssoftware passt zu uns?" (category ranking)
- "Was kostet Tool X wirklich?" (pricing, calculator)
- "Tool A oder Tool B?" (comparison)
- "Welche Alternativen gibt es zu Tool X?" (alternatives)
- "Ist Tool X DSGVO konform, GoBD tauglich, E-Rechnung fähig?" (Deutschland-Check)
- "Ich brauche Hilfe bei der Auswahl." (free advisory)

### 2.4 Business model

1. Affiliate commissions (trial sign ups, leads, sales) through clearly disclosed links.
2. Qualified lead generation through the free advisory service.
3. Sponsored placements for vendors, always labeled "Anzeige", never affecting scores or rankings.
4. Downloadable software guides (PDF) with double opt in newsletter.

### 2.5 Differentiation versus OMR Reviews, Capterra, GetApp, SoftwareSuggest

- **Deutschland-Check** on every profile: hosting location, AVV, GoBD, E-Rechnung (XRechnung, ZUGFeRD), DATEV and ELSTER connectivity, German support, contract terms.
- **Real euro prices** with "Stand" date and source, net and gross toggle, cost calculator.
- **Open methodology** with published weights.
- **Honest weaknesses** in every review. No tool is perfect and we say so.
- **Calm, premium, data first design** instead of cluttered lead gen pages.

---

## 3. Non-negotiable rules

These rules override everything else in this document.

1. **German only.** Every user facing string is native German (de-DE), formal "Sie". No English UI copy, no leftovers like "Read more" or "Submit".
2. **Euro only.** All prices in EUR, formatted de-DE (`29,00 €`), B2B default is net with the label "zzgl. MwSt.". Never show `$`, `USD`, or US formats.
3. **Germany only.** List only software that is actively sold to companies in Germany (German UI or German support, and EUR pricing or a contracting entity serving Germany). Flag German vendors with "Anbieter aus Deutschland".
4. **Fonts.** Only Outfit, Nunito Sans and Work Sans, self hosted through `next/font/google`. No other family may appear anywhere in CSS, Tailwind theme, SVGs, OG images or charts. No system font stacks.
5. **Colors.** Only the brand tokens from Section 5.2. The default Tailwind palette is removed.
6. **Icons.** No AI cliché icons (full ban list in Section 5.7). Decorative and informational icons never sit on a background shape.
7. **Punctuation.** No em dash and no en dash anywhere in content or UI copy. Hyphens only where German spelling requires them inside a word (Section 15.4).
8. **No fabrication.** Never invent user reviews, testimonials, quotes, customer counts, awards, test measurements, market statistics, prices or features. German law (UWG) prohibits fake reviews and requires disclosure of how reviews are verified. Editorial assessments are fine; fake evidence is not.
9. **No templated reviews.** Every review is individually researched, deeply detailed and structurally distinct (Section 15.6).
10. **Disclosure.** Every affiliate link carries `rel="sponsored nofollow noopener"` and a visible marker. Every paid placement says "Anzeige".
11. **Privacy by default.** No request to any third party before consent where consent is required. Fonts are self hosted. Analytics are cookieless.
12. **Accessibility.** WCAG 2.2 AA on every template.
13. **Latest stable versions.** No canary, beta, RC or "next" tags (Section 8).
14. **Not a template.** If a section looks like a generic SaaS landing page, redesign it.

---

## 4. Reference analysis

Five reference screenshots define the direction. We take their strongest patterns and execute them with more calm, more data and a sharper brand.

### 4.1 Reference 1: SoftwareSuggest, "Best Accounting Software in Germany"

**What is on the page**
- Clean white header: logo left, nav center (Categories dropdown, Write a Review, Add a Product, Login), an orange "Boost AI Visibility" button, a search field, and a dark navy "Request A Call Back" button.
- Breadcrumb (Home › Accounting Software › Germany), large H1, two line intro naming the top tools.
- "All Software" tab with an icon, and on the right three advisor avatars plus a green "Get Free Demo" button with the caption "No Cost Personal Advisor".
- "Featured Software" row: five cards, each with a circular logo, a green rating chip (★ 4.7) in the top right corner, product name in blue, price ("$29 Per Month") and a full width blue "Visit Website" button.
- A grey disclaimer bar: reviews are unbiased, ratings contain no paid placements, link to "ranking methodology", with a close icon.
- List header "List of Best Accounting Software in Germany", "Showing 1 to 20 of 20 products", and a toggle "Show Local Products" with a German flag.
- Ranked list items with a "#1" tab on the top left edge, logo circle, name, "Software by Xero Limited", rating chip with review count, and three CTAs (Visit Website, Request Demo, Get Quote).
- Sticky right sidebar: navy card "Have Questions? Get Free Expert Advice" with a smiling advisor photo and a lead form.

**What works:** clear task flow (featured, methodology, ranked list, advisory), local filter with a flag, rank numbers, persistent advisory panel.
**What we improve:** too many competing CTAs per row, a mix of blue, green, orange and navy without a system, USD prices on a German page, weak whitespace.
**We adopt:** breadcrumb and H1 block, featured row, methodology bar, rank tabs, "Nur Anbieter aus Deutschland" toggle with flag, sticky advisory panel, advisor avatar pill.

### 4.2 Reference 2 and 3: Trustpilot profile of Software Advice

**What is on the page**
- Breadcrumb and a left aligned profile header: logo, status chips ("Claimed profile · Sep 2015", "Paid Trustpilot subscription"), H1, review count with stars and score, category link, and two CTAs: dark "Write a review" with a pen icon and outlined "Visit website" with an external link icon.
- A right card with a giant "4.3", the word "Excellent", stars, "711 reviews", and five horizontal distribution bars (5 star to 1 star). Below: "How is the TrustScore calculated?" link.
- Transparency cards with line icons and no background shapes: "No recent history of asking for reviews", "Replied to 100% of negative reviews, typically replies within 1 week", "How this company uses Trustpilot".
- "Review summary" paragraph with a "See more" link and a feedback row "Was this summary helpful?".
- "What people talk about most": horizontally scrolling topic cards (Customer service, User experience, Product) on a light lavender fill with a thin border, each with a summary and "See more", plus a round next button.
- "Reviews shaping this summary": review cards with initials avatar or photo, name, date, star rating, text excerpt, "See more", "Company replied", and a footer with Useful (count), Share, Flag.
- A sticky secondary nav appears on scroll: Summary, About, Reviews, plus Visit website and Write a review on the right.

**What works:** the score card is instantly readable, transparency is designed as a feature, sticky sub navigation, review cards with clear actions.
**We adopt:** score card with distribution bars, transparency cards, topic cards, review card anatomy, sticky profile sub navigation with CTAs.
**We change:** our primary score is the editorial score with a published methodology; user review blocks only appear when real verified reviews exist.

### 4.3 Reference 4: OMR Reviews, "Popular software & tools"

**What is on the page**
- Big bold heading left, outlined "To category ›" button right.
- Category tabs in uppercase with wide letter spacing (COLLABORATION, HR, COMMERCE, SALES, ERP, PROJECT MANAGEMENT, TIME TRACKING), active tab in dark text with a thick yellow underline, overflow chevron at the end.
- Four tall cards per row: soft gradient banner on top tinted from the product's brand color, a white rounded square logo tile overlapping the banner edge, a small shield badge overlapping the tile corner, centered bold product name, five stars, review count, and a colored "See reviews ›" text link.
- A round white carousel button with a soft shadow overlapping the right edge.

**What works:** high end card rhythm, brand tinted banners, overlapping logo tile, strong typographic tabs.
**We adopt nearly 1:1 in structure:** home page "Beliebte Software und Tools" with uppercase tabs (orange underline), banner cards, seal badges, round carousel buttons.

### 4.4 Reference 5: OMR Reviews, "Category Software Guides"

**What is on the page**
- A full width lavender section (close to our canvas `#eceefe`), centered bold heading, centered intro paragraph.
- Four guide covers: mustard yellow background, a pixel block staircase pattern in lighter yellow, small logo lockup "OMR REVIEWS / Software Guide" on top, and the topic set as white label stickers with black heavy uppercase text (HR, PROJEKTMANAGEMENT, SALES, SOCIAL + INTRANET on two stickers).
- A full width purple "Download" button under every cover. Round carousel button at the right edge.

**We adopt:** the guide cover system (Section 5.8) in our brand: orange cover, block pattern in orange tints, white stickers with ink text, orange primary "Leitfaden herunterladen" buttons, lavender section background.

### 4.5 Design DNA (summary)

1. Lavender canvas (`#eceefe`) with crisp white cards. Calm, airy, premium.
2. Ink (`#0a0e09`) for text, dark panels and the footer. Orange only for action and emphasis.
3. Big confident numbers: scores, prices, counts.
4. Logo tiles that overlap tinted banners.
5. Uppercase letterspaced tabs with a thick accent underline.
6. Transparency designed as a feature, not a footnote.
7. One primary action per context. Secondary actions are quieter.

### 4.6 Anti-template list (never ship these)

- Hero with a purple or rainbow gradient blob and three feature cards with icons in colored circles.
- Default shadcn/ui look (default radius, default grays, default focus rings).
- Centered everything. Stock copy like "Get started", "Unlock", "Supercharge".
- Glassmorphism everywhere, neon glows, floating 3D shapes, emoji.
- Lorem ipsum or placeholder logos in any committed page.

---

## 5. Brand and design system

### 5.1 Principles

1. **Clarity first.** Every screen has one main question and one main action.
2. **Data is the hero.** Scores, prices and facts are designed as the main visual elements.
3. **Calm premium.** Space, rhythm and restraint instead of decoration.
4. **German precision.** Exact numbers, dates, sources, "Stand" labels.
5. **Orange with intent.** Orange means "act here" or "this matters". It is never used as wallpaper.

### 5.2 Color system

**Brand colors (given)**

| Token | Hex | Use |
|---|---|---|
| `brand-500` | `#ffa028` | Primary buttons, active tab indicator, rating stars, highlights |
| `brand-700` | `#e06601` | Hover and pressed states, gradient ends, chart emphasis |
| `ink` | `#0a0e09` | Text, dark sections, footer, secondary buttons, outlines |
| `canvas` | `#eceefe` | Global page background |

**Derived tokens (support the brand, needed for accessibility and depth)**

| Token | Hex | Use |
|---|---|---|
| `brand-50` | `#fff6ea` | Highlight panels, rank tab fill, award backgrounds |
| `brand-100` | `#ffe6c4` | Block pattern tints, selected rows |
| `brand-200` | `#ffd08f` | Pattern accents, chart secondary |
| `brand-ink` | `#a84800` | Orange text and text links (5.1:1 on canvas, 5.9:1 on white) |
| `surface` | `#ffffff` | Cards, panels, inputs |
| `surface-tint` | `#f6f7ff` | Alternating rows, topic cards, inset areas |
| `line` | `#dfe2fb` | Borders and dividers |
| `line-strong` | `#c9cdf3` | Hover borders, empty stars, chart grid |
| `text-muted` | `#4b5068` | Secondary text (6.9:1 on canvas) |
| `text-subtle` | `#6b7088` | Tertiary text, only on white, min 14 px |
| `ink-800` | `#151a14` | Raised surfaces in dark sections |
| `ink-700` | `#23291f` | Borders in dark sections |
| `on-dark-muted` | `#b9bccb` | Secondary text on ink (10.3:1) |
| `positive` | `#1d7a4c` | Strengths, "erfüllt" status |
| `negative` | `#b42318` | Weaknesses, "nicht erfüllt" status |
| `info` | `#4a4fc4` | Info notes, second data series (hue derived from canvas) |

**Contrast rules (pre calculated)**

| Combination | Ratio | Verdict |
|---|---|---|
| Ink on `brand-500` | 9.5:1 | Primary button text. Always ink, never white. |
| White on `brand-500` | 2.0:1 | Forbidden for text |
| White on `brand-700` | 3.5:1 | Avoid. Large bold text only. |
| Ink on `brand-700` | 5.6:1 | OK (hover state of primary button) |
| Ink on canvas | 16.9:1 | Body text |
| `brand-ink` on canvas | 5.1:1 | Links |
| `brand-500` on white as text | 2.0:1 | Forbidden for text, fine for stars and bars next to a number |

**Color ratio on any page:** about 70 percent canvas and white, 20 percent ink, 10 percent orange.

**Gradients (the only allowed ones)**
- CTA fill: `linear-gradient(180deg, #ffb24f 0%, #ffa028 52%, #f6921c 100%)`
- CTA hover: `linear-gradient(180deg, #ffa028 0%, #e06601 100%)`
- Ink glow for dark sections: `radial-gradient(60% 80% at 85% 0%, rgb(255 160 40 / .20), transparent 60%)` on `#0a0e09`
- Canvas light: `radial-gradient(70% 60% at 70% 20%, #ffffff, #eceefe 70%)` behind heroes
- Software card banner: `linear-gradient(135deg, color-mix(in oklch, var(--vendor-color) 22%, #eceefe), #eceefe)`

**Light theme only at launch.** Structure tokens so a dark theme can be added later.

### 5.3 Typography

**Font roles**

| Font | Role | Weights |
|---|---|---|
| **Outfit** | Display, H1 to H4, big numbers (scores, prices, stats), wordmark, guide cover stickers | 500, 600, 700, 800 |
| **Work Sans** | Interface: navigation, buttons, tabs, labels, badges, breadcrumbs, table headers, form labels, eyebrows | 400, 500, 600 |
| **Nunito Sans** | Body copy, long form reviews, descriptions, captions, form inputs | 400, 600, 700, italic 400 |

**Loading (strict, no fallback families)**

```ts
// app/fonts.ts
import { Outfit, Nunito_Sans, Work_Sans } from "next/font/google";

// Only these three families exist in this project. Self hosted at build time,
// so no request ever goes to Google (DSGVO, LG München I, 20.01.2022).
// No generated fallback faces: adjustFontFallback is off and no fallback list is set.
// display "block" plus preload avoids ever rendering a different family.
export const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "block",
  adjustFontFallback: false,
});
export const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito-sans",
  display: "block",
  adjustFontFallback: false,
});
export const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-work-sans",
  display: "block",
  adjustFontFallback: false,
});
```

Apply all three `.variable` classes on `<html lang="de">`. For OG images (`next/og`), place the static TTF files of the same three families (SIL Open Font License) in `assets/fonts/`.

**Type scale**

| Style | Font | Size | Line height | Tracking |
|---|---|---|---|---|
| Display (home hero) | Outfit 600 | `clamp(2.5rem, 5.2vw, 4.5rem)` | 1.05 | -0.025em |
| H1 | Outfit 600 | `clamp(2.125rem, 3.6vw, 3.25rem)` | 1.1 | -0.02em |
| H2 | Outfit 700 | `clamp(1.75rem, 2.6vw, 2.5rem)` | 1.15 | -0.015em |
| H3 | Outfit 600 | 1.5rem | 1.25 | -0.01em |
| H4 | Outfit 600 | 1.25rem | 1.3 | -0.005em |
| Score numeral | Outfit 600 | 4.5rem | 1 | -0.04em |
| Stat numeral | Outfit 600 | `clamp(2.25rem, 4vw, 3.5rem)` | 1 | -0.03em |
| Lead | Nunito Sans 400 | 1.25rem | 1.6 | 0 |
| Body large (reviews) | Nunito Sans 400 | 1.125rem | 1.75 | 0 |
| Body | Nunito Sans 400 | 1rem | 1.65 | 0 |
| Small | Nunito Sans 400 | 0.875rem | 1.5 | 0 |
| UI label | Work Sans 500 | 0.9375rem | 1.4 | 0 |
| Button | Work Sans 600 | 1rem | 1 | 0.005em |
| Eyebrow and tabs | Work Sans 600 | 0.8125rem, uppercase via CSS | 1.2 | 0.12em |
| Micro (badges, "Anzeige") | Work Sans 500 | 0.6875rem, uppercase | 1.2 | 0.08em |

**German typography rules**
- `lang="de"` on `<html>`.
- No automatic hyphenation (`hyphens: manual`), because the brand avoids visible hyphens. Use `overflow-wrap: break-word` and size cards so long compounds fit. Test with: Zeiterfassungssoftware, Dokumentenmanagementsystem, Warenwirtschaftssystem, Personalverwaltungssoftware, Buchhaltungsprogramme.
- Headings use `text-wrap: balance`, paragraphs use `text-wrap: pretty`.
- German quotation marks „so“ and the ellipsis character ….
- Non breaking space between number and unit or currency: `29 €`, `19 %`, `14 Tage`, `z. B.` (narrow no break space inside abbreviations).
- Tables, prices and scores use `font-variant-numeric: tabular-nums`.
- Max line length for reading text: 68ch.

### 5.4 Layout, grid and spacing

- Base unit 4 px. Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160.
- Container: 1280 px content max width, 1440 px for heroes and full bleed bands, 720 px for reading columns.
- Gutters: 16 px mobile, 24 px tablet, 32 px desktop. No horizontal page scroll at any width.
- Grid: 4 columns mobile, 8 tablet, 12 desktop, gap 24 px (32 px on desktop).
- Section rhythm: 64 px vertical padding mobile, 96 px tablet, 128 px desktop. Heading block to content: 40 px mobile, 56 px desktop.
- Breakpoints: 360, 640, 768, 1024, 1280, 1536.
- Review layout: 720 px reading column plus 320 px sticky aside (table of contents, score card, CTA) from 1024 px.

### 5.5 Radius and elevation

| Radius token | Value | Use |
|---|---|---|
| `xs` | 6 px | Chips, small badges |
| `sm` | 10 px | Inputs, selects, small tiles |
| `md` | 14 px | Dropdowns, tooltips |
| `lg` | 20 px | Cards |
| `xl` | 28 px | Feature panels, hero media, dark bands |
| `full` | 9999 px | All buttons, pills, avatars, carousel buttons |
| Logo tile | 16 px | Vendor logo tiles |

Shadows are tinted with ink and a cool indigo so they belong to the lavender canvas:

```css
--shadow-xs: 0 1px 2px rgb(10 14 9 / .06);
--shadow-sm: 0 1px 2px rgb(10 14 9 / .04), 0 2px 8px rgb(41 48 120 / .06);
--shadow-md: 0 2px 4px rgb(10 14 9 / .04), 0 12px 32px -8px rgb(41 48 120 / .14);
--shadow-lg: 0 4px 8px rgb(10 14 9 / .04), 0 24px 64px -16px rgb(41 48 120 / .22);
```

Cards on canvas: white, 1 px `line` border, `shadow-sm`. Hover: lift 2 px, `shadow-md`, border `line-strong`.

### 5.6 Motion

- Durations: 120 ms micro, 200 ms UI, 320 ms panels, 600 ms reveals.
- Easing: `cubic-bezier(.2,.8,.2,1)` for entering and hover, `cubic-bezier(.4,0,.2,1)` for standard transitions.
- Scroll reveal: fade plus 12 px rise, once, 60 ms stagger. Never on above the fold content.
- Stats count up once on first view (600 ms). Charts animate in once.
- Tabs use a sliding indicator (Motion `layoutId`).
- `prefers-reduced-motion: reduce` disables transforms, sheen and count up. Opacity fades max 120 ms.
- Forbidden: parallax, cursor trails, confetti, auto playing carousels, bouncing elements.

### 5.7 Iconography

- Library: `lucide-react`. Stroke width 1.75. Sizes 16, 20 (default), 24, 28. Color `currentColor`.
- **No background rule:** decorative and informational icons are never placed inside filled circles, squares, blobs or gradient tiles. They sit directly on the surface, aligned with the text. Interactive controls (buttons, carousel arrows) have their own surface; that is not an icon background.
- **Banned icons (hard):** Sparkles, Sparkle, WandSparkles, Wand, Zap, Rocket, Bot, BrainCircuit, Brain, Stars, Flame, Gem, Crown, Trophy, PartyPopper, Atom, Orbit, Infinity, Magnet, any emoji. `Star` is only allowed inside the rating component.
- **Approved concept map** (verify every name exists in the installed lucide version and use the current name if renamed):

| Concept | Icon |
|---|---|
| Buchhaltung | `Calculator` |
| Rechnungen, E-Rechnung | `ReceiptText` |
| Lohnabrechnung | `Banknote` |
| HR, Personal | `Users` |
| Zeiterfassung | `Clock` |
| Projektmanagement | `SquareKanban` |
| CRM | `Handshake` |
| ERP, Warenwirtschaft | `Boxes` |
| Shopsysteme | `ShoppingBag` |
| Kollaboration | `MessagesSquare` |
| Dokumentenmanagement | `FolderOpen` |
| E-Mail-Marketing | `Mail` |
| Kassensysteme | `CreditCard` |
| E-Signatur | `Signature` |
| Preis | `Euro` |
| Datenschutz | `ShieldCheck` |
| Serverstandort | `Server` |
| Support | `Headset` |
| Integrationen | `Plug` |
| Testphase | `CalendarCheck` |
| Methodik | `ListChecks` |
| Redaktion | `PenLine` |
| Vergleich | `ArrowLeftRight` |
| Filter | `SlidersHorizontal` |
| Externer Link | `ArrowUpRight` |
| Download | `Download` |
| Stärken / Schwächen | `Check` / `Minus` |
| Hilfreich, Teilen, Melden | `ThumbsUp`, `Share2`, `Flag` |
| Unternehmensgröße | `Building2` |
| Mobile App | `Smartphone` |
| Aktualisiert | `History` |
| Verifiziert | `BadgeCheck` |

- The German flag is an inline SVG (three stripes, 3:5) used in the "Nur Anbieter aus Deutschland" toggle and the "Anbieter aus Deutschland" chip.

### 5.8 Brand pattern and guide covers

- **Blockraster pattern:** squares on an 8 px grid arranged as soft staircases (inspired by Reference 5), drawn in `brand-100` and `brand-200` on `brand-500`, or in `line` on canvas. Build it as a deterministic SVG component `<BlockPattern seed="hr" />` so every guide gets a unique but stable pattern.
- **Guide cover (3:4):** `brand-500` background, Blockraster in the corners, top lockup "{{BRAND_NAME}} · Software-Leitfaden" in Work Sans 600, centered white stickers (radius 6, slight shadow) with the topic in Outfit 800 uppercase ink. Two word topics stack on two stickers. Built in code, not as an image.
- **Vendor logos:** official logos only (press kits or vendor permission), stored as SVG in `public/logos/`. Missing logo: monogram tile with initials in Outfit 700 on `brand-50`. Never hotlink.

### 5.9 Imagery

All photography and illustration follows `docs/IMAGE_PROMPTS.md`. Text never lives inside images. Real product screenshots only, never AI generated UIs. Never show AI generated people as real staff, authors, advisors or customers.

---

## 6. Signature buttons and CTAs

The buttons must feel expensive. Precision beats effects.

### 6.1 Primary CTA ("Signature")

Use for the single most important action in a context: "Website besuchen", "Kostenlos testen", "Beratung anfordern", "Leitfaden herunterladen", "Jetzt vergleichen".

Anatomy: pill shape, ink label, an arrow icon in a masked 18 px slot, orange layered fill.

```css
.cta {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  height: 3.25rem;                 /* lg 3.5rem, sm 2.5rem */
  padding-inline: 1.625rem 1.375rem;
  border-radius: 9999px;
  font: 600 1rem/1 var(--font-ui);
  letter-spacing: .005em;
  color: var(--color-ink);
  background: linear-gradient(180deg, #ffb24f 0%, #ffa028 52%, #f6921c 100%);
  border: 1px solid rgb(224 102 1 / .55);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .55),
    inset 0 -2px 0 rgb(168 72 0 / .18),
    0 2px 4px rgb(10 14 9 / .10),
    0 10px 24px -8px rgb(224 102 1 / .55);
  transition: transform 200ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms cubic-bezier(.2,.8,.2,1);
}
.cta::before {               /* hover fill: deepens toward brand-700 */
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, #ffa028 0%, #e06601 100%);
  opacity: 0;
  transition: opacity 240ms cubic-bezier(.2,.8,.2,1);
}
.cta::after {                /* one diagonal sheen per hover */
  content: "";
  position: absolute;
  inset: -1px;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 38%, rgb(255 255 255 / .45) 50%, transparent 62%);
  transform: translateX(-130%);
}
.cta:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .45),
    inset 0 -2px 0 rgb(120 50 0 / .22),
    0 3px 6px rgb(10 14 9 / .12),
    0 16px 36px -10px rgb(224 102 1 / .70);
}
.cta:hover::before { opacity: 1; }
.cta:hover::after { transform: translateX(130%); transition: transform 750ms cubic-bezier(.2,.8,.2,1); }
.cta:active { transform: translateY(1px) scale(.985); }
.cta:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 3px; }

/* Arrow slide through: two stacked arrows inside a masked slot */
.cta__arrow { position: relative; width: 1.125rem; height: 1.125rem; overflow: hidden; }
.cta__arrow svg { position: absolute; inset: 0; transition: transform 260ms cubic-bezier(.2,.8,.2,1); }
.cta__arrow svg:last-child { transform: translateX(-140%); }
.cta:hover .cta__arrow svg:first-child { transform: translateX(140%); }
.cta:hover .cta__arrow svg:last-child { transform: translateX(0); }

@media (prefers-reduced-motion: reduce) {
  .cta, .cta::before, .cta__arrow svg { transition: none; }
  .cta:hover { transform: none; }
  .cta::after { display: none; }
}
```

States: disabled (fill `brand-100`, text `text-muted`, no shadow, `aria-disabled`), loading (arrow replaced by a 16 px ink spinner, `aria-busy="true"`, label stays). Touch devices get the `:active` feedback only.

### 6.2 Other variants

| Variant | Look | Use |
|---|---|---|
| `ink` | Pill, ink fill, white label, arrow in `brand-500`. Hover: `ink-800` fill, inner top highlight `rgb(255 255 255 / .08)`, arrow slide through | Strong secondary action on light backgrounds, primary on orange areas |
| `outline` | Pill, white fill, 1 px `line-strong` border, ink label. Hover: ink border, `surface-tint` fill | "Zum Vergleich hinzufügen", "Zur Kategorie" |
| `ghost` | No fill, ink label, hover `surface-tint` | Toolbars |
| `link` | Work Sans 600, `brand-ink`, `ChevronRight` 16 px. Hover: underline grows from left (animated `background-size`), chevron moves 2 px | "Zum Testbericht", "Alle Bewertungen ansehen" (Reference 4 "See reviews ›") |
| `affiliate` | Primary CTA with `ArrowUpRight`, label ends with "*", micro label "Anzeige" next to or under it | Every outgoing affiliate click |
| `icon-round` | 48 px circle, white, 1 px `line-strong`, `shadow-md`, ink chevron. Hover: ink fill, white chevron | Carousel controls (Reference 4 and 5) |

Build all variants with `class-variance-authority`. One primary CTA per viewport section; never two orange buttons side by side.

---

## 7. Component library

Build every component in `components/`, document all states on an internal `/styleguide` route (noindex, excluded from sitemap).

### 7.1 Navigation

- **Header:** sticky, 72 px, `surface` at 85 percent opacity with backdrop blur on canvas, bottom `line` border appears after 8 px scroll. Left: wordmark (Outfit 700). Center: "Kategorien" (mega menu), "Vergleiche", "Ratgeber", "Leitfäden", "Für Anbieter". Right: search trigger with shortcut hint ("Strg K" on Windows, "⌘ K" on macOS), `ink` button "Kostenlose Beratung".
- **Mega menu:** 3 column grid of categories (icon without background, name, count), right column "Beliebte Vergleiche" and a guide teaser. Keyboard accessible (Radix Navigation Menu).
- **Mobile:** full height sheet with accordions, search on top, sticky CTA at the bottom.
- **Breadcrumbs:** Work Sans 500, 14 px, `ChevronRight` separators, last item muted, plus `BreadcrumbList` JSON-LD.
- **Footer:** ink background with ink glow. Columns: Kategorien, Beliebte Vergleiche, Ratgeber, Unternehmen (Über uns, Redaktion, Methodik, Kontakt, Für Anbieter), Rechtliches (Impressum, Datenschutz, Cookie-Einstellungen, Transparenz, Barrierefreiheit). Newsletter block. Bottom line: "© 2026 {{BRAND_NAME}} · Alle Preise zzgl. gesetzlicher MwSt., sofern nicht anders angegeben · Mit * gekennzeichnete Links sind Affiliate-Links."

### 7.2 Cards

**A. SoftwareCard (Reference 4 structure)**
- Tall card (about 4:5), white, radius 20, overflow hidden.
- Top banner 96 px with the vendor tinted gradient (Section 5.2), uses `brandColor` from data.
- Logo tile 88 px, radius 16, white, `shadow-sm`, centered and overlapping the banner edge by half its height.
- Optional award seal 40 px overlapping the tile corner (Section 11.3).
- Name in Outfit 700, 24 px, centered. Category label in Work Sans, muted.
- Rating row: stars, "4,6", and either "(128 Bewertungen)" for real user reviews or the label "Redaktionswertung".
- Price line: "ab 9,90 € pro Monat" plus micro "zzgl. MwSt.", or "Preis auf Anfrage".
- Footer: `link` CTA "Zum Testbericht" (or "Zur Bewertung" when there was no hands on test).
- Hover: lift, banner saturation up 10 percent.

**B. FeaturedCard (Reference 1, featured row):** used only for paid placements. Micro label "Anzeige" top left, score chip top right, logo, name, price, one full width CTA. Visually quieter than editorial award cards.

**C. RankedListItem (Reference 1, ranked list):** horizontal card. Rank tab "#1" on the top left edge (Outfit 600 on `brand-50`). Logo 72 px. Name (H3), vendor line "von Musterfirma GmbH", one sentence verdict. Score chip. Three key facts (Preis ab, Testphase, Serverstandort). "Ideal für" line. Two strengths and one weakness. CTAs: `affiliate` "Website besuchen*", `outline` "Testbericht lesen", checkbox "Vergleichen". Expandable "Mehr Details" with the full Deutschland-Check.

**D. GuideCard (Reference 5):** cover (Section 5.8), title under the cover, page count and "PDF" meta, full width primary "Leitfaden herunterladen" with `Download` icon.

**E. ReviewCard (Reference 2 and 3):** white, radius 20, padding 24. Header: initials avatar on `line`, display name, role and company size ("Leitung Buchhaltung, 50 bis 249 Mitarbeitende"), date. Stars plus "Verifiziert" chip when verified. Title in bold. Text clamped to 6 lines with "Mehr anzeigen". Strength and weakness tags. Footer: "Hilfreich (2)", "Teilen", "Melden". Collapsible "Antwort von {Anbieter}".

**F. TopicCard (Reference 2 "What people talk about most"):** `surface-tint` fill, 1 px `line-strong` border, radius 20, H4 topic, three line summary, link "Mehr erfahren". Only rendered with at least 10 real reviews for the product.

**G. TransparencyCard (Reference 2 side cards):** icon without background, title, two lines of explanation, optional link. Examples: "So prüfen wir Bewertungen", "Wir löschen keine kritischen Bewertungen", "Anbieter antwortet auf 92 % der kritischen Bewertungen" (computed only).

**H. StatTile:** stat numeral in Outfit, label in Work Sans, footnote with source and "Stand". Values computed from our dataset only.

**I. ScoreCard (Reference 2 summary card):** giant "4,6", label word ("Sehr gut"), stars, "Redaktionswertung", link "So bewerten wir". With real user reviews a second block shows "Nutzerbewertungen 4,4 (87)" and five distribution bars ("5 Sterne" to "1 Stern"), track `line`, fill `brand-500`, percentage right aligned.

**J. AdvisorPanel (Reference 1 sidebar):** sticky, ink header with ink glow, eyebrow "Noch unsicher?", title "Lassen Sie sich kostenlos beraten", text "Unser Team kennt die Anbieter und hilft Ihnen, die Auswahl einzugrenzen. Unverbindlich und ohne Verkaufsdruck." Real advisor photo when available (until then an illustration from the image library, never an AI generated "employee"). Form: Name, geschäftliche E-Mail, Unternehmensgröße (select), Kategorie (preselected from page), Nachricht (optional), consent checkbox, primary CTA "Beratung anfordern".

**K. MethodologyBar (Reference 1 disclaimer):** `surface` bar with `Info` icon: "Unsere Bewertungen entstehen redaktionell unabhängig. Schließen Sie über einen mit * markierten Link einen Vertrag ab, erhalten wir unter Umständen eine Provision. Auf unsere Wertungen hat das keinen Einfluss. Bezahlte Platzierungen kennzeichnen wir als Anzeige." plus link "So bewerten wir". The close button only collapses it to a one line version. It never disappears completely.

**L. ComparisonCard:** two logo tiles with a small "vs." between them, title "Lexware Office oder sevdesk?", one line teaser, link CTA.

**M. CategoryTile:** white card, icon (28 px, ink, no background) top left, name H4, "12 Programme" muted, row of three mini logo tiles, arrow appears on hover.

### 7.3 Data display

- **Rating stars:** five stars, decimal fill by clipping (4,6 means 92 percent), fill `brand-500` with a 0.75 px `brand-700` stroke, empty stars `line-strong`. Sizes 14, 16, 20, 24. Always followed by the number "4,6". Screen reader text "4,6 von 5 Sternen".
- **ScoreChip:** ink pill, white "4,6" in Outfit 600, orange star. Replaces the green chips of Reference 1.
- **StatusChip:** outline chip with icon: "Profil verifiziert", "Anbieter aus Deutschland" (flag), "Server in Deutschland", "Kostenlose Testphase: 14 Tage", "DATEV-Schnittstelle".
- **Award seal:** custom SVG seal (rounded shield shape, `brand-500` fill, ink outline, Outfit text "Empfehlung der Redaktion 2026"). No stars, no laurels with sparkles.
- **Pros and cons:** two columns "Stärken" and "Schwächen", `Check` in `positive`, `Minus` in `negative`, no background shapes.
- **Deutschland-Check grid:** rows with status icon (`CircleCheck` erfüllt, `CircleDot` teilweise, `CircleX` nicht erfüllt, `CircleHelp` keine Angabe), label, short note, source link.
- **PricingTable:** plan cards, toggle monthly or yearly billing, toggle "netto" or "brutto (inkl. 19 % MwSt.)", recommended plan highlighted with `brand-500` border, footer "Stand: 14. Oktober 2026 · Quelle: Website des Anbieters".
- **CostCalculator:** inputs Nutzerzahl (slider 1 to 250), Tarif, Abrechnung. Outputs per month and per year, net and gross, plus a bar comparison against two alternatives. Pure function in `lib/pricing` with unit tests.
- **ComparisonTable:** sticky header row and first column, grouped rows (Preise, Funktionen, Deutschland-Check, Support, Integrationen), toggle "Nur Unterschiede anzeigen", icons with screen reader text.

### 7.4 Interaction components

- **Tabs (Reference 4):** uppercase Work Sans 600, 13 px, tracking 0.12em, muted. Active: ink text with a 3 px `brand-500` bar with rounded ends that slides between tabs. Horizontal scroll with fade masks and a chevron button on overflow. Text stays in normal case in the DOM, uppercase only via CSS.
- **Toggle "Nur Anbieter aus Deutschland"** with flag (Reference 1 "Show Local Products").
- **Filter bar:** pill dropdowns above the list (Preis, Unternehmensgröße, Bereitstellung, Serverstandort, Compliance, Schnittstellen, Testphase, Kostenlose Version, Mindestwertung) plus "Alle Filter" sheet. State in the URL via `nuqs` (product attributes only, never personal data). Mobile: bottom sheet with sticky "{n} Ergebnisse anzeigen".
- **Compare tray:** sticky bottom bar once two products are selected: "2 von 4 ausgewählt", logo stack, primary "Jetzt vergleichen", link "Auswahl leeren".
- **Command palette search (`cmdk`):** opens with Strg K or ⌘ K. Groups: Software, Kategorien, Vergleiche, Ratgeber. Umlaut aware (Größe finds groesse). Empty state: "Keine Treffer für „{Suchbegriff}“. Versuchen Sie einen allgemeineren Begriff oder stöbern Sie in den Kategorien."
- **Softwarefinder:** three step quiz (Kategorie, Unternehmensgröße, wichtigste Anforderungen) that returns the top three matches from our data with a reason for each. Deterministic scoring from content data, no AI.
- **Sticky profile sub nav (Reference 3):** appears after the profile header leaves the viewport. Scrollspy tabs (Überblick, Bewertung, Preise, Funktionen, Deutschland-Check, Nutzerbewertungen, Alternativen) left, score chip plus `affiliate` CTA right.
- **Table of contents:** sticky, scrollspy, active item with a 2 px `brand-500` left bar.
- **Accordion, Dialog, Sheet, Tooltip, Popover, Select, Slider, Checkbox, Switch:** Radix primitives, fully restyled.
- **Carousel (Embla):** snap scrolling, keyboard support, `icon-round` controls overlapping the right edge (Reference 4 and 5), no autoplay, visible "1 von 3" status for screen readers.
- **Feedback:** toast, inline form errors in German linked via `aria-describedby`, skeletons that match final layouts, empty states with illustration and one action.

### 7.5 Forms

React Hook Form plus Zod. Labels always visible (no placeholder only fields). Error messages in German, specific and polite: "Bitte geben Sie eine geschäftliche E-Mail-Adresse ein." Consent checkboxes are never pre ticked. Honeypot field and server side rate limiting instead of third party captchas.

---

## 8. Tech stack and versions

### 8.1 Version policy

- Use the **latest stable** release of every package at install time: `pnpm create next-app@latest` and `pnpm add <package>@latest`. No canary, beta, RC, alpha or "next" tags.
- Verify with `npm view <package> version` before installing and record the final versions in `docs/DECISIONS.md` and the README.
- Read the official docs and upgrade guides for the installed major versions before writing code. If the Next.js DevTools MCP (`next-devtools-mcp`) is available, use it for current docs and runtime diagnostics.
- If a newest major breaks compatibility with Next.js (for example TypeScript or ESLint), use the newest version that `next build` fully supports and document why.
- At the end of every phase run `pnpm outdated` and report.

### 8.2 Stack (versions verified on npm on 19 October 2026, use these or newer stable)

| Area | Package | Version at writing |
|---|---|---|
| Runtime | Node.js Active LTS | 24 or newer LTS |
| Package manager | pnpm | latest |
| Framework | `next` (App Router, Turbopack, React Server Components) | 16.4.2 |
| UI runtime | `react`, `react-dom` | 19.3.1 |
| Compiler | `babel-plugin-react-compiler` (enable `reactCompiler`) | 1.0.0 |
| Language | `typescript` (strict) | 7.0.2, see note |
| Styling | `tailwindcss` v4 (CSS first `@theme`), `@tailwindcss/typography` | 4.3.3, 0.5.20 |
| Primitives | `radix-ui` via the `shadcn` CLI, fully restyled | 1.8.1, 4.22.1 |
| Variants | `class-variance-authority`, `clsx`, `tailwind-merge` | 0.7.1, 2.1.1, 3.7.0 |
| Animation | `motion` (import from `motion/react`, use `LazyMotion`) | 14.4.0 |
| Charts | `recharts` plus custom SVG micro charts | 3.10.1 |
| Icons | `lucide-react` | 1.59.0 |
| Content | Content Collections (`@content-collections/core`, `/next`, `/mdx`) | 0.15.3, 0.2.11, 0.2.2 |
| Validation | `zod` v4 | 4.6.7 |
| Forms | `react-hook-form`, `@hookform/resolvers` | 7.90.0, latest |
| URL state | `nuqs` | 2.10.2 |
| Carousel | `embla-carousel-react` | 8.6.0 |
| Search | `cmdk`, `fuse.js` with a build time index | 1.1.1, 7.5.0 |
| Structured data | `schema-dts` | 2.1.0 |
| Email | `resend` behind a `MailProvider` interface | 6.34.1 |
| Images | `next/image` with `sharp` | 0.35.5 |
| Lint and format | `eslint` (flat config, ESLint CLI; `next lint` no longer exists), `prettier`, `prettier-plugin-tailwindcss` | 10.13.0, 3.9.10 |
| Unit tests | `vitest` | 5.0.5 |
| E2E and a11y | `@playwright/test`, `@axe-core/playwright` | 1.64.1, 4.14.0 |
| Analytics | Cookieless, EU hosted (Plausible EU or self hosted Umami) | latest |

Note on TypeScript: use the version `create-next-app` installs. Upgrade to 7.x only if `next build` type checking passes cleanly.

Note on content: if Content Collections is not compatible with the installed Next.js version, fall back to `@next/mdx` (MDX plugins passed as strings for Turbopack) plus JSON files validated by a Zod script. Record the decision.

### 8.3 Next.js 16 conventions to follow

- App Router only. Server Components by default, client components only for interactive islands.
- `params` and `searchParams` are Promises. Always `await` them.
- Request interception lives in `proxy.ts` (the former `middleware.ts`). Use it only if needed.
- Enable `cacheComponents` and use `"use cache"` with `cacheLife` and `cacheTag` for content loaders. All content pages are statically generated via `generateStaticParams`.
- Enable `reactCompiler` and `typedRoutes`.
- Metadata through the Metadata API and `generateMetadata`. OG images through `next/og`.
- `sitemap.ts`, `robots.ts`, `manifest.ts` as route files.

### 8.4 Hosting

Deploy in an EU region close to the audience (Frankfurt, for example Vercel `fra1` or a German data center). Sign a data processing agreement (AVV) with every processor. Security headers: CSP (nonce based for any inline scripts), HSTS, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

---

## 9. Architecture and project structure

```
app/
  layout.tsx                      html lang="de", fonts, header, footer, consent provider
  page.tsx                        Startseite
  kategorien/page.tsx             Alle Kategorien
  kategorien/[kategorie]/page.tsx Kategorie mit Ranking
  software/page.tsx               Software A bis Z
  software/[slug]/page.tsx        Softwareprofil
  software/[slug]/preise/page.tsx
  software/[slug]/alternativen/page.tsx
  software/[slug]/bewertungen/page.tsx
  vergleich/page.tsx              Vergleichsrechner (bis zu 4 Produkte)
  vergleich/[paar]/page.tsx       z. B. lexware-office-vs-sevdesk
  ratgeber/page.tsx, ratgeber/[slug]/page.tsx
  leitfaeden/page.tsx, leitfaeden/[slug]/page.tsx
  beratung/page.tsx
  methodik/page.tsx
  redaktion/page.tsx, autoren/[slug]/page.tsx
  fuer-anbieter/page.tsx, software-eintragen/page.tsx
  bewertung-schreiben/page.tsx
  suche/page.tsx
  ueber-uns/ kontakt/ impressum/ datenschutz/ transparenz/ barrierefreiheit/ cookie-einstellungen/
  go/[slug]/route.ts              Affiliate Weiterleitung
  styleguide/page.tsx             intern, noindex
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.svg
  not-found.tsx error.tsx global-error.tsx
components/
  ui/ layout/ software/ review/ charts/ forms/ content/ (MDX components) search/ consent/
content/
  categories/*.json  vendors/*.json  software/*.json  authors/*.json
  reviews/*.mdx  comparisons/*.mdx  guides/*.mdx  downloads/*.mdx
  user-reviews/*.json             empty at launch
lib/
  content/     loaders, schemas, data access layer (pages never read files directly)
  format/      currency, numbers, dates, ratings (de-DE)
  scoring/     weighted scores, labels, awards
  pricing/     calculator, net and gross
  affiliate/   link building, subids
  seo/         metadata builders, JSON-LD builders
  search/      index builder, umlaut normalization
scripts/
  validate-content.ts  lint-copy.ts  build-search-index.ts  check-links.ts
styles/globals.css     Tailwind v4 @theme tokens
site.config.ts         brand, legal placeholders, feature flags
tests/unit  tests/e2e
docs/
```

**Data access layer:** all pages call functions in `lib/content` (`getSoftware(slug)`, `getCategory(slug)`, `listSoftwareByCategory(slug, filters)`, `getAlternatives(slug)`). This lets us replace files with a headless CMS later without touching pages.

**Tailwind v4 theme (excerpt)**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-*: initial;              /* remove the default palette entirely */
  --color-white: #ffffff;
  --color-brand-50: #fff6ea;
  --color-brand-100: #ffe6c4;
  --color-brand-200: #ffd08f;
  --color-brand-500: #ffa028;
  --color-brand-700: #e06601;
  --color-brand-ink: #a84800;
  --color-ink: #0a0e09;
  --color-ink-800: #151a14;
  --color-ink-700: #23291f;
  --color-canvas: #eceefe;
  --color-surface: #ffffff;
  --color-surface-tint: #f6f7ff;
  --color-line: #dfe2fb;
  --color-line-strong: #c9cdf3;
  --color-text: #0a0e09;
  --color-text-muted: #4b5068;
  --color-text-subtle: #6b7088;
  --color-on-dark-muted: #b9bccb;
  --color-positive: #1d7a4c;
  --color-negative: #b42318;
  --color-info: #4a4fc4;

  --shadow-*: initial;
  --shadow-xs: 0 1px 2px rgb(10 14 9 / .06);
  --shadow-sm: 0 1px 2px rgb(10 14 9 / .04), 0 2px 8px rgb(41 48 120 / .06);
  --shadow-md: 0 2px 4px rgb(10 14 9 / .04), 0 12px 32px -8px rgb(41 48 120 / .14);
  --shadow-lg: 0 4px 8px rgb(10 14 9 / .04), 0 24px 64px -16px rgb(41 48 120 / .22);

  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  --ease-soft: cubic-bezier(.2,.8,.2,1);
}

@theme inline {
  --font-*: initial;               /* only our three families exist */
  --font-display: var(--font-outfit);
  --font-ui: var(--font-work-sans);
  --font-body: var(--font-nunito-sans);
  --default-font-family: var(--font-nunito-sans);
}

body { background: var(--color-canvas); color: var(--color-text); }
```

Style the `prose` plugin to our tokens: Outfit headings, Nunito Sans body at 18 px, `brand-ink` links with animated underline, ink blockquote bar, tables with `line` borders.

---

## 10. Content model

All content is validated with Zod at build time. **The build fails on any schema error.** Money is stored as integer cents in EUR. Enum values in data may contain hyphens (they are data, not copy).

```ts
// lib/content/schemas.ts (abridged)
import { z } from "zod";

const Cents = z.number().int().nonnegative();
const Status = z.enum(["ja", "teilweise", "nein", "unbekannt"]);
const Score = z.number().min(0).max(5); // one decimal, validated in validate-content.ts

export const Plan = z.object({
  name: z.string(),
  priceMonthlyNet: Cents.nullable(),          // monthly billing
  priceYearlyNetPerMonth: Cents.nullable(),   // annual billing, per month equivalent
  unit: z.enum(["pro-monat", "pro-nutzer-monat", "einmalig", "nutzungsbasiert"]),
  includedUsers: z.number().int().positive().nullable(),
  highlights: z.array(z.string()).max(6),
  recommended: z.boolean().default(false),
});

export const Software = z.object({
  slug: z.string(),
  name: z.string(),
  vendor: z.string(),                          // vendor slug
  categories: z.array(z.string()).min(1),
  primaryCategory: z.string(),
  tagline: z.string().max(90),
  logo: z.string(),
  brandColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  website: z.url(),
  affiliate: z.object({ url: z.url(), network: z.string(), active: z.boolean() }).nullable(),
  pricing: z.object({
    currency: z.literal("EUR"),
    basis: z.literal("netto"),
    freePlan: z.boolean(),
    trialDays: z.number().int().positive().nullable(),
    plans: z.array(Plan),
    contractNotes: z.string().optional(),       // Laufzeit, Kündigungsfrist
    source: z.url(),
    verifiedAt: z.iso.date(),
  }),
  hosting: z.object({
    serverLocation: z.enum(["DE", "EU", "USA", "weltweit", "unbekannt"]),
    avv: Status,
  }),
  compliance: z.object({
    gobd: Status, xrechnung: Status, zugferd: Status, iso27001: Status, bsiC5: Status,
  }),
  madeInGermany: z.boolean(),
  germanSupport: z.boolean(),
  integrations: z.array(z.string()),            // "DATEV", "ELSTER", "Shopware" ...
  platforms: z.array(z.enum(["web", "windows", "macos", "linux", "ios", "android"])),
  companySizes: z.array(z.enum(["solo", "1-9", "10-49", "50-249", "250+"])),
  scores: z.object({
    funktionsumfang: Score, bedienung: Score, preisLeistung: Score,
    datenschutz: Score, support: Score, integrationen: Score,
  }),
  editorial: z.object({
    verdict: z.string().max(240),
    bestFor: z.array(z.string()).min(2).max(4),
    notFor: z.array(z.string()).min(1).max(3),
    pros: z.array(z.string()).min(3).max(6),
    cons: z.array(z.string()).min(2).max(5),
    author: z.string(),
    reviewer: z.string(),                       // fachliche Prüfung
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date(),
    handsOnTest: z.boolean(),                   // true only after a real test account was used
    sources: z.array(z.object({ label: z.string(), url: z.url(), accessedAt: z.iso.date() })).min(2),
    changelog: z.array(z.object({ date: z.iso.date(), note: z.string() })),
  }),
  alternatives: z.array(z.string()).min(3).max(8),
  verification: z.enum(["verifiziert", "pruefen"]),
  status: z.enum(["entwurf", "veroeffentlicht"]),
});
```

Further collections (same rigor):

- **Category:** slug, name ("Buchhaltungssoftware"), shortName ("Buchhaltung"), icon (approved list only), description, buyer guide MDX, criteria weight overrides, FAQ, related categories, SEO fields, updatedAt.
- **Vendor:** slug, legal name, brand name, headquarters (city, country), founded, website, German entity (yes or no), support languages.
- **UserReview:** id, softwareSlug, author (display name, role, company size, industry), verification (method: business email, LinkedIn, invoice; date), ratings (overall, usability, support, value, features), title, strengths, weaknesses, body, usage duration, createdAt, vendor reply, helpful count, moderation status, incentivized flag. **Empty at launch.**
- **Review (MDX):** frontmatter title, description, softwareSlug, author, reviewer, dates, sources; body uses MDX components.
- **Comparison (MDX):** a, b, verdict, sections. Only published with unique editorial content.
- **Guide (Ratgeber, MDX):** title, description, topic, author, reviewer, dates, hero image, sources.
- **Download (Leitfaden):** slug, title, cover stickers (e.g. `["SOCIAL", "INTRANET"]`), page count, file, chapters, gated (boolean).
- **Author:** slug, name, role, bio, expertise, photo, LinkedIn. Must be a real person.

**Build guards in `validate-content.ts`:**
- A profile with `status: "veroeffentlicht"` must have `verification: "verifiziert"`, a real author, at least two sources, and `pricing.verifiedAt` not older than 180 days (warning at 90).
- Every category, vendor, author and alternative reference resolves.
- Scores have exactly one decimal.
- Copy lint (Appendix B) passes on all content and UI strings.

**MDX components available to writers:** `<Praxisnotiz>` (hands on observation; `status="ausstehend"` renders nothing in production and lists the gap in `CONTENT_STATUS.md`), `<Hinweis>`, `<Screenshot>` (real screenshot, caption, date), `<Kurzfazit>`, `<StaerkenSchwaechen>`, `<Preisbox>`, `<Vergleichstabelle>`, `<DeutschlandCheck>`, `<SoftwareKarte slug="...">`, `<Faq>`.

---

## 11. Scoring, awards and rating logic

### 11.1 Editorial score

Scale 0 to 5 with one decimal, displayed with a decimal comma ("4,6").

| Criterion (German label) | Default weight |
|---|---|
| Funktionsumfang | 25 % |
| Bedienung und Einrichtung | 20 % |
| Preis-Leistung | 20 % |
| Datenschutz und Compliance | 15 % |
| Support und Service | 10 % |
| Integrationen und Schnittstellen | 10 % |

Categories may override weights (documented on the category page and on `/methodik`).

```ts
export const DEFAULT_WEIGHTS = {
  funktionsumfang: 0.25, bedienung: 0.2, preisLeistung: 0.2,
  datenschutz: 0.15, support: 0.1, integrationen: 0.1,
} as const;

export function overallScore(s: Scores, w = DEFAULT_WEIGHTS): number {
  const raw = (Object.keys(w) as (keyof typeof w)[]).reduce((sum, k) => sum + s[k] * w[k], 0);
  return Math.round(raw * 10) / 10;
}
```

### 11.2 Score labels

| Range | Label |
|---|---|
| 4,5 to 5,0 | Hervorragend |
| 4,0 to 4,4 | Sehr gut |
| 3,5 to 3,9 | Gut |
| 3,0 to 3,4 | Befriedigend |
| 2,0 to 2,9 | Ausreichend |
| below 2,0 | Mangelhaft |

Use "Redaktionswertung" for our score. Never use "Note" (in Germany a Note implies the school scale where 1 is best).

### 11.3 Awards (computed per category, never sold)

| Award | Rule |
|---|---|
| Empfehlung der Redaktion | Highest overall score in the category, minimum 4,3 |
| Preis-Leistungs-Tipp | Highest `preisLeistung` among products with overall 4,0 or more |
| Beste Wahl für Selbstständige | Highest overall among products serving `solo` or `1-9` |
| Beste Wahl für den Mittelstand | Highest overall among products serving `50-249` |
| Datenschutz-Tipp | Highest `datenschutz` among products hosted in DE |

Ties: higher overall score wins, then alphabetical. Awards carry the year of the last category update.

### 11.4 Honest wording switch

- `handsOnTest: true`: titles and buttons may say "Test", "Testbericht", "im Test".
- `handsOnTest: false`: use "Bewertung", "im Überblick", "Zur Bewertung". Never claim a test that did not happen.

### 11.5 User ratings

Shown only when real, verified user reviews exist. With fewer than 5 reviews show the reviews but no average. Never show "0 Bewertungen" with empty stars; show "Noch keine Nutzerbewertungen". Never mix editorial and user scores into one number.

---

## 12. Information architecture and URLs

- German slugs, lowercase, transliterate umlauts (ä to ae, ö to oe, ü to ue, ß to ss). Hyphens in URLs are fine; they are not copy.
- No trailing slashes. One canonical URL per page.

| Page | URL |
|---|---|
| Startseite | `/` |
| Alle Kategorien | `/kategorien` |
| Kategorie | `/kategorien/buchhaltung` |
| Softwareprofil | `/software/lexware-office` |
| Preise | `/software/lexware-office/preise` |
| Alternativen | `/software/lexware-office/alternativen` |
| Nutzerbewertungen | `/software/lexware-office/bewertungen` |
| Vergleich | `/vergleich/lexware-office-vs-sevdesk` |
| Vergleichsrechner | `/vergleich` |
| Ratgeber | `/ratgeber`, `/ratgeber/e-rechnung-pflicht` |
| Leitfäden | `/leitfaeden`, `/leitfaeden/hr-software` |
| Beratung | `/beratung` |
| Methodik | `/methodik` |
| Redaktion, Autoren | `/redaktion`, `/autoren/vorname-nachname` |
| Für Anbieter | `/fuer-anbieter`, `/software-eintragen` |
| Bewertung schreiben | `/bewertung-schreiben` |
| Rechtliches | `/impressum`, `/datenschutz`, `/transparenz`, `/barrierefreiheit`, `/cookie-einstellungen` |

---

## 13. Page specifications

### 13.1 Startseite

1. **Header** (7.1).
2. **Hero** on canvas light gradient with a Blockraster corner. Left column:
   - Eyebrow: "Softwarevergleich für Unternehmen in Deutschland"
   - Display H1: "Die Software, die zu Ihrem Unternehmen passt."
   - Lead: "Wir bewerten Unternehmenssoftware für den deutschen Markt: mit Preisen in Euro, einer offenen Methodik und einem genauen Blick auf Datenschutz, GoBD und E-Rechnung."
   - Search field, pill, 64 px high, placeholder "Welche Software suchen Sie? Zum Beispiel Buchhaltung oder Zeiterfassung", primary button "Suchen".
   - Chips "Häufig gesucht:" Buchhaltung, Zeiterfassung, CRM, Projektmanagement, E-Rechnung.
   - Trust line: "Unabhängige Redaktion · Offene Methodik · Kostenlos für Sie".
   - Right column: hero photo (image library H-01) with radius 28 and two floating HTML data cards drawn from real data: the category winner with ScoreChip, and a Deutschland-Check snippet ("Server in Deutschland · AVV · GoBD").
3. **Stats strip:** counts computed from content at build time ("{n} Softwareprofile · {n} Kategorien · {n} Ratgeber · Stand {Monat Jahr}").
4. **Beliebte Software und Tools** (Reference 4): H2 left, `outline` "Zur Kategorie" right (target follows active tab), uppercase tabs (Kollaboration, HR, Buchhaltung, CRM, ERP, Projektmanagement, Zeiterfassung, E-Commerce), carousel of SoftwareCards, `icon-round` arrows.
5. **Softwarefinder** block: "In drei Schritten zur passenden Software", inline quiz, three step illustrations from the image library.
6. **Alle Kategorien im Überblick:** grid of CategoryTiles.
7. **Was Software in Deutschland kostet** (ink section with ink glow): horizontal bar chart of the median entry price per category (net per month) computed from our data, StatTiles, source line "Basis: {n} Anbieter, Preise netto, Stand {Datum}".
8. **Beliebte Vergleiche:** ComparisonCards.
9. **Der Deutschland-Check:** "Sechs Fragen, die wir jeder Software stellen, bevor wir sie empfehlen." Six items with icons (no background): Serverstandort, Auftragsverarbeitung (AVV), GoBD, E-Rechnung, Schnittstellen zu DATEV und ELSTER, Support auf Deutsch. Photo from the library.
10. **E-Rechnung spotlight:** short explainer with verified dates, link to the Ratgeber and a list of tools with `xrechnung: "ja"`.
11. **Software-Leitfäden zum Download** (Reference 5): lavender full bleed section, centered H2 and intro "Kompaktes Wissen für Ihre Entscheidung: Funktionen, Preise, Stärken und Schwächen der wichtigsten Anbieter je Kategorie, als PDF zum Mitnehmen.", GuideCard carousel.
12. **Neu im Ratgeber:** three article cards.
13. **So bewerten wir:** donut chart of the weights, three sentences, link "Zur Methodik".
14. **Kostenlose Softwareberatung** band: illustration or real advisor photo, text, primary "Beratung anfordern".
15. **Newsletter:** "Einmal im Monat das Wichtigste: neue Bewertungen, Preisänderungen und Fristen, die Ihr Unternehmen betreffen." Double opt in.
16. **Footer.**

### 13.2 Kategorie (`/kategorien/[kategorie]`)

1. Breadcrumb. H1 "Buchhaltungssoftware im Vergleich: die besten Programme {Jahr}". Intro (two to three sentences). Byline "Von {Autor} · Fachlich geprüft von {Prüfer} · Zuletzt aktualisiert am {Datum} · {n} Programme bewertet". Right: advisor avatar pill "Kostenlose Beratung" with caption "Persönlich, kostenlos, unverbindlich" (Reference 1).
2. Anchor tabs: Alle Programme, Vergleichstabelle, Kaufberatung, Häufige Fragen.
3. **Unsere Empfehlungen:** three award cards (computed) with seal and a one line reason.
4. Sponsored row only if paid placements exist, labeled "Anzeige".
5. MethodologyBar.
6. Results header: "{n} Programme", sort select (Empfohlen, Beste Wertung, Preis aufsteigend, Name A bis Z), toggle "Nur Anbieter aus Deutschland" with flag, filter bar.
7. Two column layout from 1280 px: RankedListItems left, sticky AdvisorPanel right.
8. Vergleichstabelle of the top six.
9. Charts: "Preis und Wertung im Vergleich" (scatter: x entry price net per month, y score) and "Einstiegspreise im Überblick" (sorted bars).
10. Kaufberatung (MDX, 1.500 to 2.500 words): what matters in this category in Germany, cost factors, compliance, migration, FAQ.
11. Related categories, related Ratgeber, Leitfaden teaser.
12. JSON-LD: `ItemList` of `SoftwareApplication`, `BreadcrumbList`.

### 13.3 Softwareprofil (`/software/[slug]`)

1. Breadcrumb (Startseite › Buchhaltung › Lexware Office).
2. **Profile header** (Reference 2 layout): logo tile 96 px, H1 by the honest wording switch ("Lexware Office im Test: ..." or "Lexware Office im Überblick: Funktionen, Preise und Bewertung"), StatusChips, tagline. Right: ScoreCard. CTAs: `affiliate` "Website besuchen*" and `outline` "Zum Vergleich hinzufügen", micro note "Anzeige: Wir erhalten ggf. eine Provision. Für Sie ändert sich der Preis nicht." Key facts row: Preis ab, Testphase, Kostenlose Version, Serverstandort, Support, Ideal für.
3. Sticky sub nav (7.4).
4. **Überblick:** Kurzfazit panel (`brand-50`, author avatar), Stärken and Schwächen, "Ideal für" and "Weniger geeignet für".
5. **Bewertung im Detail:** criterion bars plus radar chart, one explanatory sentence per criterion.
6. **Testbericht / Bewertung** (MDX long form) with sticky table of contents.
7. **Deutschland-Check** grid with sources.
8. **Preise:** PricingTable, CostCalculator, chart "Einstiegspreis im Vergleich zu Alternativen".
9. **Funktionen:** grouped feature list, integrations grid.
10. **Nutzerbewertungen** (Reference 2 and 3): ScoreCard with distribution, TopicCards (only with 10 or more reviews), filters (Sterne, Unternehmensgröße, Branche), ReviewCards, TransparencyCards, CTA "Bewertung schreiben". At launch, empty state: illustration, "Noch keine verifizierten Nutzerbewertungen", "Sie arbeiten mit {Name}? Ihre Erfahrung hilft anderen Unternehmen bei der Entscheidung.", button "Bewertung schreiben".
11. **Alternativen:** three to six SoftwareCards, mini comparison table, links to the alternatives page and comparison pages.
12. **Häufige Fragen.**
13. AuthorBox, "Zuletzt aktualisiert am", Änderungsprotokoll.
14. JSON-LD: `SoftwareApplication` (applicationCategory `BusinessApplication`, operatingSystem, offers in EUR), editorial `Review` with `author` Person and `reviewRating`, `AggregateRating` only from real user reviews, `BreadcrumbList`.

### 13.4 Vergleich (`/vergleich/[a]-vs-[b]`)

H1 "{A} oder {B}: Welche Software passt besser zu Ihrem Unternehmen?". Head to head header (two logo tiles, scores, entry prices, two affiliate CTAs). "Das Wichtigste in 30 Sekunden" verdict. "Wann {A} die bessere Wahl ist" and "Wann {B} die bessere Wahl ist". Butterfly chart (mirrored criterion bars). Full comparison table. Price comparison chart. Deutschland-Check side by side. FAQ. Comparison pages only exist for pairs with unique editorial content.

**Vergleichsrechner (`/vergleich`):** pick up to four products (slugs in the URL), same table and charts generated from data.

### 13.5 Alternativen (`/software/[slug]/alternativen`)

H1 "Die besten Alternativen zu {Name}". Why companies look for alternatives (editorial reasoning, not invented statistics), ranked list of alternatives with a reason each, comparison table, CTAs.

### 13.6 Ratgeber

Index: magazine layout with a featured article, topic filter, article cards (image, topic eyebrow, title, teaser, reading time "8 Min. Lesezeit"). Article: hero, byline, table of contents, MDX body, inline SoftwareKarten, sources list, AuthorBox, related articles.

### 13.7 Leitfäden

Grid of GuideCards (Reference 5). Detail page: cover, "Das erwartet Sie" chapter list, page count, form (Name, geschäftliche E-Mail, Unternehmen optional, consent), double opt in email with the download link.

### 13.8 Beratung

Hero with advisor image, "So funktioniert die Beratung" in three steps, multi step form (Kategorie, Unternehmensgröße und Anforderungen, Kontakt), consent, privacy note including retention period. Server Action plus `MailProvider`. Only promise response times that are real.

### 13.9 Methodik

Weights donut, criteria definitions, score scale and labels, research process (vendor documentation, test accounts when available, pricing pages, support contact), independence and affiliate policy, award rules, update rhythm, correction policy, and how user reviews are collected and verified (legal requirement, § 5b Abs. 3 UWG).

### 13.10 Für Anbieter and Software eintragen

Explain what is free (listing, profile claim, replying to reviews) and what is paid (labeled sponsored placements). State clearly: scores and rankings cannot be bought. Profile claim form.

### 13.11 Bewertung schreiben

Multi step form: product, ratings per criterion, strengths, weaknesses, text (min 200 characters), role and company size, verification by business email (domain check plus confirmation link). Guidelines and consent. Submissions go to a moderation queue behind a `ReviewSubmissionStore` interface (email or database adapter).

### 13.12 Suche, 404, Fehler

Search results grouped by type. 404 and error pages in friendly German with search, popular categories and an illustration.

### 13.13 Legal pages

Impressum (§ 5 DDG, § 18 Abs. 2 MStV), Datenschutzerklärung (structure with processor list: hosting, email provider, analytics), Transparenz (affiliate model, sponsored placements, independence), Erklärung zur Barrierefreiheit, Cookie-Einstellungen. Generate structure and placeholders only, add a visible internal note that a lawyer must review all legal texts before launch.

---

## 14. Charts, stats and data visualization

### 14.1 Rules for every chart

- A title (H3 or H4), a one sentence takeaway above the chart, and a footnote with data basis and "Stand".
- German number formats on axes and tooltips ("1.234", "14,90 €", "4,6", "92 %").
- Axis labels Work Sans 12 px `text-muted`, values in Outfit, grid lines `line-strong` dashed (4 4), no 3D, no shadows inside charts.
- Tooltips: white card, `shadow-md`, radius 14.
- Accessibility: `role="img"` with an `aria-label` summary plus a toggle "Daten als Tabelle anzeigen".
- Charts are client components, lazy loaded below the fold, with a skeleton of the same size (no layout shift).
- Data comes only from our content (scores, prices, counts). Never chart invented market data.

### 14.2 Palette

Single series: `brand-500`, highlighted item `brand-700`, reference lines ink. Multi series in this order: `#e06601`, `#0a0e09`, `#4a4fc4`, `#ffa028`, `#9aa0c8`. On ink backgrounds: `#ffa028`, `#ffffff`, `#b9bccb`.

### 14.3 Chart catalog

| Chart | Where | Build |
|---|---|---|
| Criterion bars | Profile, cards | Custom SVG or CSS |
| Radar of criteria | Profile | Recharts |
| Radial score gauge | Profile header, award cards | Custom SVG |
| Rating distribution | User reviews | Custom (Reference 2) |
| Entry price bars | Profile, category, home | Recharts |
| Price and score scatter | Category | Recharts, labels on hover and focus |
| Butterfly comparison | Comparison pages | Recharts or custom SVG |
| Weights donut | Methodik, home | Recharts |
| Cost over users (step lines) | Calculator | Recharts |
| StatTiles with count up | Home, category | Custom |

---

## 15. Editorial and content writing system

### 15.1 Writer persona

You write as a senior German B2B editor with more than ten years in software journalism and affiliate publishing. You know the daily reality of German companies: the Steuerberatung that works with DATEV, the GoBD audit, the E-Rechnung deadlines, the Betriebsrat that must be involved when time tracking or HR software is introduced, the question of where data is hosted. You are an expert in software evaluation and you know which details decide a purchase.

### 15.2 Voice

- Formal "Sie". Confident, concrete, calm, helpful. Like a trusted colleague who has looked closely.
- Mix short and long sentences. Use concrete scenarios from German business life, clearly framed as examples ("Angenommen, Sie führen einen Elektrobetrieb mit vierzehn Beschäftigten ...").
- Name trade offs openly. Every product gets real, specific weaknesses.
- Gender neutral where natural (Beschäftigte, Mitarbeitende, Teams). No gender star and no colon forms (the asterisk is reserved for affiliate markers).

### 15.3 Banned phrases

Never use: "In der heutigen schnelllebigen Welt", "In der heutigen digitalen Welt", "Zusammenfassend lässt sich sagen", "Es ist wichtig zu beachten", "In diesem Artikel werden wir", "Tauchen wir ein", "nahtlos", "revolutionär", "bahnbrechend", "Game Changer", "auf das nächste Level", "ein Muss", "unschlagbar", "spielend leicht", "im Handumdrehen", "Rundum-sorglos", "ganzheitliche Lösung", "maßgeschneiderte Lösung", "das A und O", "last but not least", "Fazit: Ein Muss für jedes Unternehmen", any English marketing filler. The lint script enforces this list.

### 15.4 Punctuation and the dash rule

- **No em dash (—) and no en dash (–), anywhere.** Use a period, comma, colon or parentheses instead.
- **No spaced hyphen as a connector** (" - ").
- **Ranges with "bis":** "10 bis 49 Mitarbeitende", "Montag bis Freitag, 9 bis 18 Uhr", "ab 9,90 € bis 49,00 €".
- **Lists are list components,** never lines starting with a hyphen.
- **Hyphens only where German spelling requires them inside a word:** E-Mail, E-Rechnung, CRM-Software, DSGVO-konform, DATEV-Schnittstelle. Prefer the closed compound whenever it is correct: Buchhaltungssoftware, Zeiterfassungssystem, Projektmanagementtool, Cloudlösung.
- Avoid constructions that need a suspended hyphen ("Vor- und Nachteile"); write "Stärken und Schwächen" instead.

### 15.5 Accuracy policy (hard rule)

- Every fact needs a source: vendor website, documentation, price page, official regulation. Store sources in the data.
- Research with web access when available. Prices and plans get a `verifiedAt` date.
- If a fact cannot be verified, leave it out or set `verification: "pruefen"`. Unverified profiles are not published.
- Never invent: user reviews, testimonials, quotes, customer numbers, awards, certifications, test measurements ("in unserem Test dauerte der Import 3 Minuten"), market shares, statistics or vendor statements.
- Hands on observations are written only after a real test. Until then use `<Praxisnotiz status="ausstehend">` with a description of what the editor should test.
- Real product names change: verify current names (example: lexoffice is now Lexware Office).

**Year sensitive facts to verify before publishing (status as known on 19 October 2026):**
- E-Rechnung: receiving mandatory for all companies since 1 January 2025; issuing mandatory from 1 January 2027 for companies with more than 800.000 € prior year turnover, from 1 January 2028 for all (domestic B2B).
- Retention period for Buchungsbelege reduced from 10 to 8 years from 2025 (Bürokratieentlastungsgesetz IV).
- Kleinunternehmerregelung since 2025: 25.000 € prior year, 100.000 € current year.
- Standard VAT rate 19 %.
- Arbeitszeiterfassung: BAG decision of 13 September 2022 (1 ABR 22/22); check the current legislative status.
- DDG replaced TMG and TDDDG replaced TTDSG (14 May 2024). BFSG applies since 28 June 2025.
- EU-U.S. Data Privacy Framework (adequacy decision July 2023): check current status for US vendors.

### 15.6 Anti-template rules for reviews

Every review must feel written by a person who studied this one product closely.

1. **A unique central question** per review ("Reicht die Lohnvorbereitung für einen Betrieb mit Schichtarbeit?").
2. **A unique opening.** Rotate between: a concrete scenario, a sharp observation about pricing, a compliance detail, a surprising strength, a clear limitation, a comparison hook. No two reviews in the same category may open the same way.
3. **Specific headings,** never generic ones. Not "Funktionen", but "Belegerfassung per Smartphone: schnell, mit einer Hürde beim Kassenbuch".
4. **Required information units** (order and headings vary): Kurzfazit, Für wen geeignet, Einrichtung und Onboarding, Kernfunktionen im Arbeitsalltag (category specific workflows), Deutschland-Check, Preise und Vertragsdetails (Laufzeit, Kündigung, Preiserhöhungen, Zusatzkosten), Support, Integrationen, Grenzen und Schwächen, Alternativen mit Begründung, Fazit with a recommendation per company type.
5. **Category specific depth,** for example:
   - Buchhaltung: Belegerfassung, Bankabgleich, Umsatzsteuervoranmeldung über ELSTER, EÜR oder Bilanz, DATEV-Export an die Steuerberatung, GoBD-konforme Archivierung, XRechnung und ZUGFeRD, Mahnwesen.
   - HR: digitale Personalakte, Bewerbermanagement, Abwesenheiten, Rollen und Rechte, Betriebsrat, Lohnvorbereitung für DATEV.
   - Zeiterfassung: mobile und Offline-Erfassung, Terminals, Pausenregeln nach Arbeitszeitgesetz, Projektzeiten, Mitbestimmung des Betriebsrats.
   - CRM: DSGVO bei Kontaktdaten, Einwilligungen, Pipeline, E-Mail-Integration, Telefonie.
   - Projektmanagement: Ressourcenplanung, Zeiterfassung, Kundenfreigaben, Hosting.
   - ERP und Warenwirtschaft: Lager, Einkauf, Shopanbindung (Shopware, JTL), Produktion, Migration.
6. **Lengths:** flagship reviews (top three per category) 3.000 to 4.500 words, standard reviews 1.800 to 2.800 words, compact profiles 900 to 1.400 words.
7. **Similarity check:** before writing a new review, scan the existing reviews of the same category. If any five word sequence repeats more than three times, or openings and heading patterns match, rewrite.
8. **Internal links:** each review links to its category, at least three alternatives, one comparison and one Ratgeber.

### 15.7 SEO writing rules

- Title pattern: "{Name} im Test {Jahr}: Preise, Funktionen und Alternativen" (or "im Überblick" without hands on test). Max 60 characters where possible.
- Meta description: max 155 characters, specific, no clickbait.
- One H1 per page. Logical H2 and H3 structure.
- The year appears only when the content was really updated in that year.

---

## 16. Launch catalog

### 16.1 Categories (launch order)

1. Buchhaltung (`buchhaltung`)
2. Rechnungsprogramme und E-Rechnung (`rechnungsprogramme`)
3. Lohnabrechnung (`lohnabrechnung`)
4. HR-Software (`hr-software`)
5. Zeiterfassung (`zeiterfassung`)
6. Projektmanagement (`projektmanagement`)
7. CRM (`crm`)
8. ERP und Warenwirtschaft (`erp`)
9. Shopsysteme (`shopsysteme`)
10. Kollaboration und Kommunikation (`kollaboration`)
11. Dokumentenmanagement (`dokumentenmanagement`)
12. E-Mail-Marketing (`e-mail-marketing`)
13. Kassensysteme (`kassensysteme`)
14. E-Signatur (`e-signatur`)

### 16.2 Candidate products

**Candidate list only.** Before publishing, verify for each product: still sold, current product name, German interface or German support, available to companies in Germany, prices in EUR. Remove or replace anything that fails and log it.

| Category | Candidates |
|---|---|
| Buchhaltung | Lexware Office, sevdesk, DATEV Unternehmen online, Buchhaltungsbutler, WISO MeinBüro, Papierkram, Candis, Accountable, Collmex |
| Rechnungsprogramme | easybill, Billomat, FastBill, sevdesk, Lexware Office, Zervant |
| Lohnabrechnung | DATEV Lohn und Gehalt, DATEV LODAS, Lexware lohn+gehalt, Agenda Lohn, Personio Payroll |
| HR-Software | Personio, HRworks, Factorial, Kenjo, rexx systems, Leapsome, SAP SuccessFactors |
| Zeiterfassung | Clockodo, Crewmeister, clockin, TimeTac, Papershift, ZEP, Kenjo |
| Projektmanagement | awork, Asana, monday.com, MeisterTask, Stackfield, factro, ClickUp, Jira, Trello, Microsoft Planner, MOCO, Projectfacts |
| CRM | HubSpot Sales Hub, Salesforce Sales Cloud, Pipedrive, CentralStationCRM, weclapp, Zoho CRM, Microsoft Dynamics 365 Sales, CAS genesisWorld, Teamleader Focus |
| ERP | SAP Business One, weclapp, Xentral, JTL-Wawi, Odoo, plentyONE, Microsoft Dynamics 365 Business Central, proALPHA, Sage 100 |
| Shopsysteme | Shopware, Shopify, JTL-Shop, WooCommerce, Gambio, plentyONE, Adobe Commerce |
| Kollaboration | Microsoft Teams, Slack, Stackfield, Zoom Workplace, Google Workspace, Nextcloud Hub, Threema Work, Wire, Flip, Staffbase |
| Dokumentenmanagement | DocuWare, d.velop documents, ELO, ecoDMS, AMAGNO |
| E-Mail-Marketing | CleverReach, rapidmail, Brevo, Inxmail, Mailchimp, Klaviyo |
| Kassensysteme | SumUp, orderbird, ready2order, Lightspeed, gastronovi |
| E-Signatur | DocuSign, Skribble, Yousign, Adobe Acrobat Sign, FP Sign, sign-me |

### 16.3 Content volume and batches

| Batch | Scope |
|---|---|
| 1 | Buchhaltung, Zeiterfassung, HR-Software: all profiles with structured data, flagship and standard reviews, category Kaufberatung, 5 comparisons, 5 Ratgeber, 2 Leitfäden |
| 2 | Projektmanagement, CRM, Rechnungsprogramme, Lohnabrechnung |
| 3 | ERP, Shopsysteme, Kollaboration, Dokumentenmanagement |
| 4 | E-Mail-Marketing, Kassensysteme, E-Signatur |

Stop after every batch for review.

---

## 17. German localization and formatting

Central helpers in `lib/format`, used everywhere. Never format by hand.

```ts
const LOCALE = "de-DE";
const TZ = "Europe/Berlin";

export const formatPrice = (cents: number, opts?: { compact?: boolean }) =>
  new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: opts?.compact && cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);                       // "29,00 €" or "29 €"

export const formatRating = (v: number) =>
  new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v); // "4,6"

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric", timeZone: TZ })
    .format(new Date(iso));                     // "14. Oktober 2026"

export const grossFromNet = (cents: number, rate = 0.19) => Math.round(cents * (1 + rate));
```

| Topic | Rule |
|---|---|
| Prices | Net by default with "zzgl. MwSt."; gross toggle shows "inkl. 19 % MwSt." |
| Units | "pro Monat", "pro Nutzer und Monat", "bei jährlicher Zahlung", "einmalig" |
| Missing price | "Preis auf Anfrage" |
| Numbers | "1.234", "4,6", "92 %" (no break space before %) |
| Dates | "14. Oktober 2026" in text, "14.10.2026" in tables, relative "vor 3 Tagen" via `Intl.RelativeTimeFormat("de")` |
| Times | "9:00 bis 18:00 Uhr" |
| Company sizes | "Selbstständige", "1 bis 9 Mitarbeitende", "10 bis 49", "50 bis 249", "ab 250" |
| Sorting | `localeCompare(x, "de")`, so Ä sorts with A |
| Search | Normalize ä, ö, ü, ß in both directions |
| Shortcuts | "Strg K" on Windows and Linux, "⌘ K" on macOS |

---

## 18. Affiliate system

- Affiliate URLs live only in content data. Pages link to `/go/[slug]?from={seite}&pos={position}` (whitelisted values, no personal data).
- `app/go/[slug]/route.ts`: look up the product, append the subid for attribution, respond with a 307 redirect, headers `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`, record an anonymous click event in the cookieless analytics. Unknown or inactive slugs redirect to the profile page. `robots.txt` disallows `/go/`.
- Every outgoing affiliate link: `rel="sponsored nofollow noopener"`, `target="_blank"`, "*" after the label, plus "Anzeige" micro label on primary CTAs.
- Without an affiliate deal, link directly to the vendor website with `rel="noopener"` and no asterisk.
- Ranking order is always the editorial score. Sponsored placements live in separate, labeled slots.
- Disclosure text (Transparenz page, footer, MethodologyBar): "Mit * gekennzeichnete Links sind Affiliate-Links. Schließen Sie darüber einen Vertrag ab, erhalten wir unter Umständen eine Provision. Für Sie ändert sich der Preis nicht, und auf unsere Bewertungen hat die Provision keinen Einfluss."

---

## 19. Legal, privacy and trust

Generate structure and placeholders. Legal texts require review by a German lawyer before launch; say so in the phase report.

- **Impressum** per § 5 DDG, responsible person per § 18 Abs. 2 MStV.
- **Consent** per § 25 TDDDG and DSGVO. If no consent requiring service is active, show no banner (keep the settings page). If services are added: first layer with equally prominent "Alle akzeptieren" and "Nur notwendige", plus "Einstellungen"; nothing pre ticked; consent logged; reopen from the footer. Video and maps via two click embeds.
- **Fonts** self hosted via `next/font` (no Google requests).
- **Analytics** cookieless and EU hosted, documented in the Datenschutzerklärung.
- **Forms:** data minimization, stated purpose, unticked consent checkbox, link to Datenschutz, newsletter with double opt in and logging, retention periods, no personal data in URLs.
- **Reviews (UWG):** no fake reviews, no suppression of negative reviews, incentivized reviews labeled, and a clear statement on how reviews are verified (§ 5b Abs. 3 UWG).
- **Advertising:** paid content labeled "Anzeige".
- **Accessibility:** WCAG 2.2 AA plus an Erklärung zur Barrierefreiheit (BFSG context).
- **Trademarks:** vendor names and logos used only to identify products; note on the Transparenz page.
- **Images:** AI generated people are never presented as real staff, authors, advisors or customers.

---

## 20. SEO

- `generateMetadata` on every route. Title template "%s | {{BRAND_NAME}}". Canonical URLs. `openGraph.locale = "de_DE"`. `alternates.languages = { "de-DE": url }`.
- Dynamic OG images with `next/og` in brand colors and fonts: product logo, score, category.
- JSON-LD: `Organization` and `WebSite` with `SearchAction` (home), `SoftwareApplication` and `Review` (profiles), `ItemList` (categories, alternatives), `Article` (Ratgeber), `BreadcrumbList` (everywhere).
- `sitemap.ts` with `lastModified` from `updatedAt`. Filtered and sorted URL variants are `noindex, follow`.
- Internal linking rules from 15.6. Breadcrumbs everywhere.
- No thin programmatic pages: comparisons and alternatives pages need unique editorial content.
- Clear factual summaries (Kurzfazit, key facts) so answers can be quoted by search engines and AI assistants.

---

## 21. Performance, accessibility and quality

**Budgets (p75, mobile)**
- LCP 2,0 s or less, INP 200 ms or less, CLS 0,05 or less.
- Lighthouse: Performance 90+ (mobile), Accessibility 100, Best Practices 100, SEO 100.
- First load JS on content pages 120 KB gzip or less. Charts, carousels, calculator and command palette load lazily.
- Images: `next/image`, AVIF and WebP, explicit `sizes`, `priority` only on the LCP image, blur placeholders.

**Accessibility**
- Landmarks, skip link "Zum Inhalt springen", visible focus everywhere, full keyboard support for menus, tabs, carousels, dialogs and the command palette.
- Touch targets at least 44 px. Color is never the only signal. Every chart has a table alternative.
- Form errors in German, linked with `aria-describedby`, announced politely.
- Reduced motion respected.

**Testing**
- Unit (Vitest): formatters, scoring, awards, pricing calculator, search normalization, content guards.
- E2E (Playwright): search to category to filter to compare to profile to affiliate redirect; advisory form; guide download; consent flow (when active); keyboard only navigation.
- Accessibility: axe checks on every template.
- CI: typecheck, lint, copy lint, content validation, unit, e2e, Lighthouse CI on key templates.

---

## 22. Build phases and definition of done

Stop after each phase, report, list placeholders and open questions, wait for approval.

| Phase | Scope | Done when |
|---|---|---|
| 0 Setup | Scaffold with latest stable versions, pnpm, TypeScript strict, Tailwind v4 tokens, fonts, ESLint, Prettier, Vitest, Playwright, CI, `site.config.ts`, docs files | `pnpm build`, lint and tests pass; only three font families and brand colors exist |
| 1 Design system | All components from Sections 6 and 7 with every state on `/styleguide` | Visual review approved; axe clean |
| 2 Content layer | Schemas, loaders, validators, copy lint, search index, categories and vendors for batch 1 | `validate-content` passes; guards proven by tests |
| 3 Templates | All page templates from Section 13 with batch 1 data | Every template renders real data; no placeholders visible to users except marked legal ones |
| 4 Interactivity | Search, filters, compare tray, calculator, charts, Softwarefinder, forms, `/go` route, consent | E2E flows pass |
| 5 Content | Editorial batches from 16.3 | Copy lint, similarity check and verification pass per batch |
| 6 Hardening | SEO, performance, accessibility, security headers | Budgets from Section 21 met |
| 7 Launch | Final QA (Section 23), legal review, real photos, analytics, redirects | Checklist complete |

---

## 23. Final QA checklist

- [ ] Every visible string is German, formal "Sie", no English leftovers.
- [ ] All prices in EUR, de-DE format, net with "zzgl. MwSt.", each with "Stand" and source.
- [ ] Only Outfit, Nunito Sans and Work Sans appear in computed styles (check in DevTools on every template).
- [ ] No default Tailwind colors in the build output.
- [ ] No banned icon imported (grep for every name in 5.7). No icon sits on a background shape.
- [ ] No "—" or "–" in content or UI strings; copy lint is green.
- [ ] No invented reviews, quotes, statistics or awards. User review sections show the empty state at launch.
- [ ] "Test" wording only where `handsOnTest` is true.
- [ ] Every affiliate link has `rel="sponsored nofollow noopener"`, an asterisk and nearby disclosure.
- [ ] No third party request before consent (check the network tab on a fresh profile).
- [ ] Impressum, Datenschutz, Transparenz, Barrierefreiheit complete and reviewed by a lawyer.
- [ ] Lighthouse and Core Web Vitals budgets met. axe shows zero violations.
- [ ] Keyboard only walkthrough of all templates succeeds.
- [ ] All AI images follow `IMAGE_PROMPTS.md`; author and advisor photos are real.
- [ ] Sitemap, robots, canonicals, JSON-LD validated (Rich Results Test).
- [ ] 404 and error pages tested.

---

## Appendix A: German microcopy

| Purpose | German |
|---|---|
| Visit website (affiliate) | Website besuchen* |
| Free trial | Kostenlos testen* |
| Request demo | Demo anfragen* |
| Request quote | Angebot anfordern |
| Read review | Testbericht lesen / Zur Bewertung |
| Add to comparison | Zum Vergleich hinzufügen |
| Compare now | Jetzt vergleichen |
| Clear selection | Auswahl leeren |
| See all reviews | Alle Bewertungen ansehen |
| Write review | Bewertung schreiben |
| To category | Zur Kategorie |
| All categories | Alle Kategorien |
| Download guide | Leitfaden herunterladen |
| Free advice | Kostenlose Beratung |
| Request advice | Beratung anfordern |
| Local filter | Nur Anbieter aus Deutschland |
| Filters / reset | Filter / Filter zurücksetzen |
| Sort | Sortieren nach: Empfohlen, Beste Wertung, Preis aufsteigend, Name A bis Z |
| Result count | 1 bis 20 von 87 Programmen |
| Per month | pro Monat |
| Per user per month | pro Nutzer und Monat |
| Plus VAT | zzgl. MwSt. |
| Incl. VAT | inkl. 19 % MwSt. |
| Price on request | Preis auf Anfrage |
| Free plan | Kostenlose Version |
| Trial | Testphase: 14 Tage |
| Updated | Zuletzt aktualisiert am 14. Oktober 2026 |
| Reviewed by | Fachlich geprüft von |
| Editorial score | Redaktionswertung |
| User ratings | Nutzerbewertungen |
| Strengths / weaknesses | Stärken / Schwächen |
| Best for / less suited | Ideal für / Weniger geeignet für |
| Helpful / share / report | Hilfreich / Teilen / Melden |
| Vendor reply | Antwort von {Anbieter} |
| Verified | Verifiziert |
| More / less | Mehr anzeigen / Weniger anzeigen |
| Search placeholder | Software, Kategorie oder Anbieter suchen |
| Ad label | Anzeige |
| Skip link | Zum Inhalt springen |
| Loading | Wird geladen … |
| Form success | Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns per E-Mail. |
| Generic error | Das hat leider nicht geklappt. Bitte versuchen Sie es in einem Moment erneut. |

## Appendix B: Copy lint rules (`scripts/lint-copy.ts`)

Run on `content/**`, UI string files and JSX text. Fail the build on:

```ts
const RULES = [
  { pattern: /—/, message: "Gedankenstrich (em dash) entfernen" },
  { pattern: /–/, message: "Halbgeviertstrich (en dash) entfernen" },
  { pattern: /\S[ \t]-[ \t]\S/, message: "Bindestrich als Satzzeichen ersetzen" }, // Markdown list bullets at line start stay allowed
  { pattern: /\$|USD/, message: "Nur Euro verwenden" },
  { pattern: /\b(Lorem|ipsum)\b/i, message: "Platzhaltertext entfernen" },
  { pattern: /(nahtlos|revolutionär|bahnbrechend|Game.?Changer|nächste Level|schnelllebig|spielend leicht|im Handumdrehen|unschlagbar)/i, message: "Floskel ersetzen" },
  { pattern: /\b(Read more|Submit|Learn more|Get started|Sign up)\b/, message: "Englischen UI Text übersetzen" },
];
```

Code blocks, URLs and data enum values are excluded.

## Appendix C: Tone samples

**Not like this:**
> In der heutigen schnelllebigen Geschäftswelt ist eine effiziente Buchhaltung wichtiger denn je. Mit der richtigen Software heben Sie Ihr Unternehmen spielend leicht auf das nächste Level.

**Like this (category intro):**
> Seit dem 1. Januar 2025 muss jedes Unternehmen in Deutschland E-Rechnungen empfangen und verarbeiten können. Beim Ausstellen gelten Übergangsfristen: Wer im Vorjahr mehr als 800.000 € umgesetzt hat, stellt im Inland ab 2027 an andere Unternehmen nur noch elektronische Rechnungen aus, ab 2028 gilt das für alle. Für ein Buchhaltungsprogramm heißt das ganz praktisch: XRechnung und ZUGFeRD nur lesen zu können, reicht bald nicht mehr. Genau darauf schauen wir in jeder Bewertung zuerst.

**Like this (review opening with a scenario):**
> Angenommen, Sie führen einen Elektrobetrieb mit vierzehn Beschäftigten. Morgens verteilt sich das Team auf drei Baustellen, abends liegen die Stundenzettel zerknittert im Transporter. Eine Zeiterfassung muss hier vor allem eines leisten: auf dem Smartphone zuverlässig funktionieren, auch wenn im Keller das Netz wegbricht. Ob eine App offline stempelt und später sauber synchronisiert, entscheidet in solchen Betrieben über Akzeptanz oder Frust.

All facts in samples must be verified again at publishing time.
