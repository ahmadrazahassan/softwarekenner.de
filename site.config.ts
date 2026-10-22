/**
 * Single source of truth for brand, legal data and feature flags.
 * docs/BUILD_PROMPT.md Section 0: placeholders live here and nowhere else.
 *
 * Every value written as "{{NAME}}" is an open placeholder. It must be replaced
 * with real data before launch. `openPlaceholders()` lists what is still missing
 * (none since 22 October 2026).
 */

export const siteConfig = {
  brand: {
    name: "Softwarekenner",
    positioning: "Die Software, die zu Ihrem Unternehmen passt. Unabhängig bewertet, ehrlich verglichen.",
    guideLockupSuffix: "Software-Leitfaden",
    /** Year in the footer copyright line. Update once a year. */
    copyrightYear: 2026,
  },

  /** Production origin without trailing slash, ideally a .de domain. */
  domain: "https://softwarekenner.de",

  legal: {
    /** Sole proprietorship (Einzelunternehmen) of the founder: no register entry, no managing director. */
    legalForm: "einzelunternehmen" as "einzelunternehmen" | "gmbh",
    companyLegalName: "Wolfram Eschenbach",
    /** Street and city as two lines for the Impressum, joined with a comma elsewhere. */
    companyStreet: "Textorstraße 11",
    companyCity: "60594 Frankfurt am Main",
    companyAddress: "Textorstraße 11, 60594 Frankfurt am Main",
    /** Only for entries in the commercial register; null hides the block. */
    registerCourt: null as string | null,
    registerNumber: null as string | null,
    /** USt-IdNr. under § 27a UStG; null hides the line. Add it here as soon as one is assigned. */
    vatId: null as string | null,
    /** GmbH only; a sole proprietor represents himself. */
    managingDirector: null as string | null,
    /** Responsible person under § 18 Abs. 2 MStV. */
    editorInChief: "Wolfram Eschenbach",
    /** Hosting provider named in the privacy policy (processor under Art. 28 DSGVO). */
    hostingProvider: "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA",
    /**
     * Where the hosting provider processes data and on which basis data reaches a third country.
     * Vercel: functions in Frankfurt (vercel.json "regions"), static files from its worldwide network;
     * EU-U.S. Data Privacy Framework and standard contractual clauses per Vercel's privacy policy
     * (vercel.com/legal/privacy-policy, as of 1 June 2026). To be checked with the privacy policy review.
     */
    hostingDetails:
      "Serverseitige Funktionen laufen in Rechenzentren in Frankfurt am Main. Statische Inhalte liefert Vercel über ein weltweites Netz von Rechenzentren aus, in der Regel vom Standort, der Ihnen am nächsten liegt. Dabei kann die IP-Adresse auch außerhalb der EU verarbeitet werden. Vercel ist nach dem EU-U.S. Data Privacy Framework zertifiziert; die Übermittlung in die USA stützt sich auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO) und ergänzend auf Standardvertragsklauseln (Art. 46 DSGVO).",
    /** Data protection supervisory authority responsible for the company seat. */
    supervisoryAuthority:
      "Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (datenschutz.hessen.de)",
    /**
     * How long form requests (Beratung, Eintrag, Bewertung) are kept, as shown next to the forms,
     * e.g. "sechs Monate nach Abschluss Ihrer Anfrage". To be decided with the privacy policy.
     */
    retentionInquiries: "sechs Monate nach Abschluss der Bearbeitung",
  },

  contact: {
    email: "wolfram.eschenbach@softwarekenner.de",
    /** Display format; `phoneHref` is the E.164 form for tel: links. */
    phone: "+49 155 10075472",
    phoneHref: "tel:+4915510075472",
  },

  locale: {
    lang: "de",
    locale: "de-DE",
    ogLocale: "de_DE",
    currency: "EUR",
    timeZone: "Europe/Berlin",
    vatRate: 0.19,
    /** B2B default: prices are shown net with "zzgl. MwSt.". */
    priceBasis: "netto",
  },

  features: {
    // Consent: the banner appears by itself once lib/consent lists a service that needs consent.
    /**
     * Cookieless, EU hosted analytics (lib/analytics). Provider not chosen yet. Plausible: endpoint
     * "https://plausible.io" and siteId = domain. Umami: endpoint = own origin and siteId = website id.
     */
    analytics: {
      provider: null as "plausible" | "umami" | null,
      endpoint: null as string | null,
      siteId: null as string | null,
    },
    /** Show sponsored ("Anzeige") slots. Off until real paid placements exist. */
    sponsoredPlacements: false,
    /** User reviews collection is empty at launch (Section 10). */
    userReviews: false,
    newsletter: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;

const PLACEHOLDER_PATTERN = /^\{\{([A-Z0-9_]+)\}\}$/;

export const isPlaceholder = (value: unknown): value is string =>
  typeof value === "string" && PLACEHOLDER_PATTERN.test(value);

/** Names of every placeholder that is still unset, e.g. ["DOMAIN", "VAT_ID"]. */
export function openPlaceholders(config: unknown = siteConfig): string[] {
  const found: string[] = [];
  const walk = (node: unknown) => {
    if (isPlaceholder(node)) found.push(node.slice(2, -2));
    else if (node && typeof node === "object") Object.values(node).forEach(walk);
  };
  walk(config);
  return found;
}
