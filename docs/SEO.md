# SEO and indexing

Status 22 October 2026. Rules: BUILD_PROMPT Sections 15.7 and 20.

## Technical setup

| Item                      | Where                                                      | State                                                                                                                                                                             |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Indexing                  | `app/layout.tsx`                                           | `index, follow` for all pages; search, confirmation, empty review pages and the styleguide stay `noindex`                                                                         |
| Canonical, hreflang de-DE | `lib/seo` `pageMetadata`                                   | every page                                                                                                                                                                        |
| `sitemap.xml`             | `app/sitemap.ts`                                           | every indexable page with `lastModified` from the content                                                                                                                         |
| `robots.txt`              | `app/robots.ts`                                            | disallows `/go/`, `/styleguide`, `/bestaetigen`; points to the sitemap                                                                                                            |
| Share images              | `app/opengraph-image.tsx`, per guide, category and profile | Outfit and Work Sans, brand colors only                                                                                                                                           |
| Structured data           | `lib/seo`                                                  | Organization and WebSite with SearchAction, BreadcrumbList, ItemList, SoftwareApplication with editorial Review, Article for Ratgeber and Kaufberatung, FAQPage for category FAQs |
| Ownership tags            | env `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`   | optional, DNS verification is the better way                                                                                                                                      |

Known limit: unknown slugs below `/software`, `/ratgeber` and `/kategorien` answer with status 200 and `noindex` (see DECISIONS, 2026-10-19). Google reports them as soft 404 but does not index them.

## Keyword map

Exact search volumes were not available when this was written: the Semrush account had no API units, the Ahrefs plan does not include Keywords Explorer, and Google Trends and autocomplete were blocked by the research environment's network. The terms below follow the wording of the pages that rank on google.de for each topic (searched 22 October 2026), so they reflect what Google rewards for these queries. Replace them with measured volumes from Search Console after a few weeks, or from a keyword tool.

| Page                                        | Main term                        | Secondary terms                                                               | Evidence from the results page                                                                                                             |
| ------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/kategorien/buchhaltung`                   | Buchhaltungssoftware Vergleich   | Buchhaltungsprogramm, für Selbstständige, Kleinunternehmer, DATEV, E-Rechnung | Für-Gründer, selbststaendigkeit.de, sevdesk, Lexware use "Buchhaltungssoftware Vergleich 2026", "Buchhaltungsprogramme für Selbstständige" |
| `/kategorien/zeiterfassung`                 | Zeiterfassung Software Vergleich | Zeiterfassung App, Arbeitszeiterfassung, DATEV-Export                         | trusted.de, Ordio, Crewmeister: "Zeiterfassung Software Vergleich", "Zeiterfassung App"                                                    |
| `/kategorien/hr-software`                   | HR-Software Vergleich            | Personalsoftware, KMU, digitale Personalakte                                  | Für-Gründer, trusted.de, Taxmaro: "HR-Software-Vergleich 2026", "Personalmanagement"                                                       |
| `/kategorien/lohnabrechnung`                | Lohnabrechnung Software          | Lohnprogramm, Lohnabrechnungsprogramm                                         | Für-Gründer "Lohnabrechnungsprogramm-Vergleich", Sage "Lohnabrechnung Software"                                                            |
| `/kategorien/erp`                           | ERP-System Vergleich             | Warenwirtschaftssystem, ERP für den Mittelstand                               | Dr. Web "ERP Systeme Vergleich 2026", yagemi "ERP für den Mittelstand"                                                                     |
| `/kategorien/crm`                           | CRM-Software Vergleich           | CRM für kleine Unternehmen, CRM-Systeme, DSGVO                                | Für-Gründer "CRM-Systeme im Vergleich", chatarmin "CRM Software für Kleinunternehmen"                                                      |
| `/ratgeber/e-rechnung-pflicht`              | E-Rechnungspflicht               | E-Rechnung Pflicht, Fristen 2027 2028, Ausnahmen                              | IHK pages and e-rechnungen.org: "E-Rechnungspflicht: Alle Fristen 2025, 2027, 2028"                                                        |
| `/ratgeber/kleinunternehmerregelung`        | Kleinunternehmerregelung 2026    | Grenze, 25.000, 100.000, Rechnung                                             | selbststaendigkeit.de, mehrwertsteuerrechner.de: "Kleinunternehmerregelung 2026: Grenzen"                                                  |
| `/ratgeber/arbeitszeiterfassung-pflicht`    | Arbeitszeiterfassung Pflicht     | 2026, Gesetz, Zeiterfassungspflicht                                           | Taxmaro, experte.de: "Arbeitszeiterfassung Pflicht 2026"                                                                                   |
| `/ratgeber/gobd-aufbewahrung`               | GoBD                             | Aufbewahrungsfristen, Belege, GoBD-konform                                    | Lexware, Accountable: "GoBD", "Aufbewahrungsfristen 2026"                                                                                  |
| `/ratgeber/auftragsverarbeitung-cloud`      | AVV                              | Auftragsverarbeitungsvertrag, Muster, DSGVO                                   | IT-Recht Kanzlei, Legiscope: "AVV Muster", "Auftragsverarbeitungsvertrag Muster"                                                           |
| `/ratgeber/betriebsrat-softwareeinfuehrung` | Betriebsrat Software Einführung  | § 87 BetrVG, Mitbestimmung                                                    | BAG decisions dominate the results                                                                                                         |
| `/software/*`                               | {Name}                           | Preise, Alternativen                                                          | `/preise` and `/alternativen` subpages target "{Name} Preise" and "{Name} Alternativen"                                                    |

Titles put the main term first and stay at 60 characters or less before the brand suffix where possible. The year appears only from the content's last update (`{jahr}` token in category SEO titles, `updatedAt` in profile titles). "Test" or "Testsieger" never appears without a hands on test (Section 11.4), even though competitors use it.

## Launch steps (owner)

1. **Google Search Console:** add the domain property `softwarekenner.de` and verify it by DNS TXT record at the domain registrar (covers every subdomain and protocol). Alternatively add a URL prefix property and put the meta tag value into `GOOGLE_SITE_VERIFICATION`, then redeploy.
2. **Submit the sitemap:** Search Console, Sitemaps, `https://softwarekenner.de/sitemap.xml`.
3. **Request indexing** with URL inspection for the home page, `/kategorien/buchhaltung`, `/ratgeber` and `/ratgeber/e-rechnung-pflicht`. The rest follows from the sitemap and internal links.
4. **Bing Webmaster Tools:** import the site from Search Console (one click), or verify with `BING_SITE_VERIFICATION`. Bing also feeds ChatGPT search and Copilot.
5. **After four to eight weeks:** read Search Console, Performance, Queries. Adjust titles where pages get impressions without clicks, and write new Ratgeber articles for queries with impressions but no fitting page.
6. **Backlinks:** register in the IHK and association directories where possible, and offer the Ratgeber to trade associations and Steuerberatung newsletters. No paid links (Google spam policies).
