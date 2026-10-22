import {
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarCheck,
  CircleAlert,
  CircleCheck,
  Download,
  Euro,
  Flag,
  FolderOpen,
  Headset,
  History,
  Info,
  ListChecks,
  PenLine,
  Plug,
  Search,
  Server,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  ThumbsUp,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { requestAdvice } from "@/app/actions/forms";
import {
  Butterfly,
  ChartFrame,
  CostLines,
  CriteriaRadar,
  PriceBars,
  ScoreScatter,
  WeightsDonut,
} from "@/components/charts";
import { ConsentProvider } from "@/components/consent/consent";
import { AdvisorPanel } from "@/components/content/advisor-panel";
import { GuideCard } from "@/components/content/guide-card";
import { GuideCover } from "@/components/content/guide-cover";
import { MethodologyBar } from "@/components/content/methodology-bar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickySubNav, TableOfContents } from "@/components/layout/page-nav";
import { TopicCard, TransparencyCard } from "@/components/review/cards";
import { ReviewCard } from "@/components/review/review-card";
import {
  CategoryTile,
  ComparisonCard,
  FeaturedCard,
  RankedListItem,
  SectionHeading,
  SoftwareCard,
} from "@/components/software/cards";
import { CompareProvider } from "@/components/software/compare";
import { ComparisonTable } from "@/components/software/comparison-table";
import {
  CriterionBars,
  DeutschlandCheck,
  ProsCons,
  ScoreCard,
  StatTile,
} from "@/components/software/data-display";
import { CostCalculator, PricingTable } from "@/components/software/pricing";
import { AffiliateButton } from "@/components/ui/affiliate-button";
import { AwardSeal, type AwardKind } from "@/components/ui/award-seal";
import { BlockPattern } from "@/components/ui/block-pattern";
import { Button, ButtonLink, TextLink } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { AdLabel, StatusChip, Tag } from "@/components/ui/chip";
import { EmptyState, LoadingRegion, Notice, Skeleton } from "@/components/ui/feedback";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Checkbox, Select, Slider, Switch } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import { Accordion } from "@/components/ui/overlay";
import { RatingStars } from "@/components/ui/rating-stars";
import { ScoreChip } from "@/components/ui/score-chip";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { formatPercent, formatPrice, formatRating } from "@/lib/format";
import { CATEGORIES, categoryHref } from "@/lib/navigation";

import {
  DEMO_ALTERNATIVES,
  DEMO_CHECK,
  DEMO_COMPARISON_GROUPS,
  DEMO_COMPARISON_PRODUCTS,
  DEMO_CONSENT_SERVICES,
  DEMO_COST_ROWS,
  DEMO_DETAILS,
  DEMO_NOTE,
  DEMO_PLANS,
  DEMO_PRICE_BARS,
  DEMO_RADAR,
  DEMO_REVIEW,
  DEMO_SCATTER,
  DEMO_SOFTWARE,
  DEMO_WEIGHTS,
} from "./_demo/data";
import {
  CompareTrayDemo,
  IconButtonDemo,
  OverlayDemo,
  ResultsHeaderDemo,
  SoftwarefinderDemo,
} from "./_demo/interactive";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "farben", label: "Farben" },
  { id: "typografie", label: "Typografie" },
  { id: "flaechen", label: "Radien und Schatten" },
  { id: "icons", label: "Icons" },
  { id: "buttons", label: "Buttons" },
  { id: "chips", label: "Chips und Wertung" },
  { id: "formulare", label: "Formulare" },
  { id: "navigation", label: "Navigation" },
  { id: "karten", label: "Karten" },
  { id: "daten", label: "Datenanzeige" },
  { id: "preise", label: "Preise" },
  { id: "vergleichstabelle", label: "Vergleichstabelle" },
  { id: "diagramme", label: "Diagramme" },
  { id: "interaktion", label: "Interaktion" },
  { id: "einwilligung", label: "Einwilligung" },
  { id: "rueckmeldung", label: "Rückmeldung" },
];

const COLORS: { token: string; hex: string; use: string; dark?: boolean }[] = [
  { token: "brand-500", hex: "#ffa028", use: "Primäre Buttons, aktiver Reiter, Sterne" },
  { token: "brand-700", hex: "#e06601", use: "Hover, Verlaufsende, Diagrammbetonung" },
  { token: "ink", hex: "#0a0e09", use: "Text, dunkle Flächen, Footer", dark: true },
  { token: "canvas", hex: "#eceefe", use: "Seitenhintergrund" },
  { token: "brand-50", hex: "#fff6ea", use: "Hervorhebungen, Rangreiter" },
  { token: "brand-100", hex: "#ffe6c4", use: "Musterflächen, Auswahl" },
  { token: "brand-200", hex: "#ffd08f", use: "Musterakzente" },
  { token: "brand-ink", hex: "#a84800", use: "Orangefarbener Text und Links", dark: true },
  { token: "surface", hex: "#ffffff", use: "Karten, Felder" },
  { token: "surface-tint", hex: "#f6f7ff", use: "Wechselzeilen, Themenkarten" },
  { token: "line", hex: "#dfe2fb", use: "Rahmen, Trennlinien" },
  { token: "line-strong", hex: "#c9cdf3", use: "Hover-Rahmen, leere Sterne" },
  { token: "text-muted", hex: "#4b5068", use: "Sekundärtext", dark: true },
  { token: "text-subtle", hex: "#6b7088", use: "Tertiärtext, nur auf Weiß", dark: true },
  { token: "ink-800", hex: "#151a14", use: "Erhöhte Flächen im Dunkeln", dark: true },
  { token: "ink-700", hex: "#23291f", use: "Rahmen im Dunkeln", dark: true },
  { token: "on-dark-muted", hex: "#b9bccb", use: "Sekundärtext auf Ink" },
  { token: "positive", hex: "#1d7a4c", use: "Stärken, erfüllt", dark: true },
  { token: "negative", hex: "#b42318", use: "Schwächen, nicht erfüllt", dark: true },
  { token: "info", hex: "#4a4fc4", use: "Hinweise, zweite Datenreihe", dark: true },
];

const TYPE_SCALE = [
  { cls: "type-display", label: "Display", sample: "Die Software, die passt." },
  { cls: "type-h1", label: "H1", sample: "Buchhaltungssoftware im Vergleich" },
  { cls: "type-h2", label: "H2", sample: "Beliebte Software und Tools" },
  { cls: "type-h3", label: "H3", sample: "Belegerfassung per Smartphone" },
  { cls: "type-h4", label: "H4", sample: "Deutschland-Check" },
  { cls: "type-score", label: "Wertung", sample: "4,6" },
  { cls: "type-stat", label: "Kennzahl", sample: "1.234" },
  { cls: "type-lead", label: "Lead", sample: "Wir bewerten Unternehmenssoftware für den deutschen Markt." },
  {
    cls: "type-body-lg",
    label: "Fließtext groß",
    sample: "Langer Testbericht mit 18 Pixeln und großzügigem Zeilenabstand.",
  },
  { cls: "type-body", label: "Fließtext", sample: "Beschreibungen und Erklärungen in Nunito Sans." },
  { cls: "type-small", label: "Klein", sample: "Stand: 14. Oktober 2026 · Quelle: Website des Anbieters" },
  { cls: "type-label", label: "UI-Label", sample: "Unternehmensgröße" },
  { cls: "type-button", label: "Button", sample: "Website besuchen" },
  { cls: "type-eyebrow", label: "Eyebrow und Reiter", sample: "Projektmanagement" },
  { cls: "type-micro", label: "Mikro", sample: "Anzeige" },
];

const LONG_WORDS = [
  "Zeiterfassungssoftware",
  "Dokumentenmanagementsystem",
  "Warenwirtschaftssystem",
  "Personalverwaltungssoftware",
  "Buchhaltungsprogramme",
];

const ICONS = [
  { label: "Preis", icon: Euro },
  { label: "Datenschutz", icon: ShieldCheck },
  { label: "Serverstandort", icon: Server },
  { label: "Support", icon: Headset },
  { label: "Integrationen", icon: Plug },
  { label: "Testphase", icon: CalendarCheck },
  { label: "Methodik", icon: ListChecks },
  { label: "Redaktion", icon: PenLine },
  { label: "Vergleich", icon: ArrowLeftRight },
  { label: "Filter", icon: SlidersHorizontal },
  { label: "Download", icon: Download },
  { label: "Hilfreich", icon: ThumbsUp },
  { label: "Teilen", icon: Share2 },
  { label: "Melden", icon: Flag },
  { label: "Unternehmensgröße", icon: Building2 },
  { label: "Mobile App", icon: Smartphone },
  { label: "Aktualisiert", icon: History },
  { label: "Verifiziert", icon: BadgeCheck },
  { label: "Lohnabrechnung", icon: Banknote },
  { label: "Dokumente", icon: FolderOpen },
];

const AWARDS: AwardKind[] = ["redaktion", "preisLeistung", "selbststaendige", "mittelstand", "datenschutz"];

const SEARCH_ITEMS = [
  ...DEMO_SOFTWARE.map((s) => ({
    id: s.slug,
    group: "Software" as const,
    label: s.name,
    hint: s.categoryLabel,
    href: "/styleguide#karten",
  })),
  ...CATEGORIES.map((c) => ({
    id: c.slug,
    group: "Kategorien" as const,
    label: c.name,
    href: "/styleguide#navigation",
  })),
  {
    id: "vergleich-1",
    group: "Vergleiche" as const,
    label: "Musterbuch oder Belegwerk Beispiel?",
    href: "/styleguide#karten",
  },
  {
    id: "ratgeber-1",
    group: "Ratgeber" as const,
    label: "Unternehmensgröße richtig einschätzen (Beispiel)",
    href: "/styleguide#karten",
  },
];

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      className="scroll-mt-24 border-t border-line pt-14 pb-6 first:border-t-0 first:pt-0"
    >
      <h2 id={`${id}-titel`} className="type-h2 text-ink">
        {title}
      </h2>
      {intro && <p className="mt-3 measure type-body text-text-muted">{intro}</p>}
      <div className="mt-8 flex flex-col gap-10">{children}</div>
    </section>
  );
}

function Specimen({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="type-eyebrow text-text-muted">{title}</h3>
      <div className={className}>{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  const [first, second, third, fourth, fifth] = DEMO_SOFTWARE as [
    (typeof DEMO_SOFTWARE)[number],
    (typeof DEMO_SOFTWARE)[number],
    (typeof DEMO_SOFTWARE)[number],
    (typeof DEMO_SOFTWARE)[number],
    (typeof DEMO_SOFTWARE)[number],
  ];

  return (
    <CompareProvider>
      <a
        href="#inhalt"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 type-label text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Zum Inhalt springen
      </a>
      <Header
        searchItems={SEARCH_ITEMS}
        categoryCounts={{ buchhaltung: 9, "hr-software": 7, zeiterfassung: 7 }}
        popularComparisons={[
          { label: "Musterbuch oder Belegwerk Beispiel", href: "/styleguide#karten" },
          { label: "Kontoklar Demo oder Zahlenwerk Muster", href: "/styleguide#karten" },
        ]}
        guideTeaser={{ title: "HR-Software im Überblick (Beispiel)", href: "/styleguide#karten" }}
      />
      <main id="inhalt" tabIndex={-1} className="container-wide py-12 outline-none lg:py-16">
        <div className="mb-12 flex flex-col gap-4">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Styleguide", href: "/styleguide" },
            ]}
          />
          <p className="type-eyebrow text-brand-ink">Intern, nicht indexiert</p>
          <h1 className="type-h1 text-ink">Styleguide</h1>
          <Notice tone="info" icon={Info} className="measure">
            {DEMO_NOTE}
          </Notice>
        </div>

        <div className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <TableOfContents items={SECTIONS} title="Bereiche" className="max-lg:hidden" />
          <div className="min-w-0">
            <Section
              id="farben"
              title="Farben"
              intro="Nur diese Tokens existieren. Die Standardpalette von Tailwind ist entfernt."
            >
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {COLORS.map((c) => (
                  <li key={c.token} className="overflow-hidden rounded-lg border border-line bg-white">
                    <div className="h-20 border-b border-line" style={{ background: c.hex }} />
                    <div className="p-3">
                      <p className="type-label font-semibold text-ink">{c.token}</p>
                      <p className="type-small text-text-muted tabular-nums">{c.hex}</p>
                      <p className="mt-1 type-small text-text-muted">{c.use}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Specimen title="Verläufe" className="grid gap-4 sm:grid-cols-3">
                <div className="btn-primary h-20 rounded-lg" aria-label="CTA-Verlauf" role="img" />
                <div className="h-20 rounded-lg bg-ink-glow" aria-label="Ink mit Glow" role="img" />
                <div
                  className="h-20 rounded-lg border border-line bg-canvas-light"
                  aria-label="Canvas hell"
                  role="img"
                />
              </Specimen>
            </Section>

            <Section
              id="typografie"
              title="Typografie"
              intro="Outfit für Überschriften und Zahlen, Work Sans für die Oberfläche, Nunito Sans für Fließtext."
            >
              <ul className="flex flex-col divide-y divide-line rounded-lg border border-line bg-white">
                {TYPE_SCALE.map((t) => (
                  <li key={t.cls} className="grid gap-2 p-5 md:grid-cols-[10rem_1fr] md:items-baseline">
                    <p className="type-small text-text-muted">
                      {t.label} <span className="block text-text-subtle">{t.cls}</span>
                    </p>
                    <p className={`${t.cls} text-ink`}>{t.sample}</p>
                  </li>
                ))}
              </ul>
              <Specimen
                title="Lange Komposita in schmalen Karten"
                className="grid grid-cols-2 gap-3 sm:grid-cols-5"
              >
                {LONG_WORDS.map((w) => (
                  <div key={w} className="rounded-md border border-line bg-white p-3">
                    <p className="type-h4 text-ink">{w}</p>
                  </div>
                ))}
              </Specimen>
              <Specimen title="Typografische Details">
                <p className="measure type-body text-ink">
                  „Deutsche Anführungszeichen“, Auslassung …, 29&nbsp;€, 19&nbsp;%, 14&nbsp;Tage, z.&#8239;B.
                  und tabellarische Ziffern: <span className="tabular-nums">1.234,56&nbsp;€</span>.{" "}
                  <em>Kursiver Fließtext in Nunito Sans.</em>
                </p>
              </Specimen>
            </Section>

            <Section id="flaechen" title="Radien, Schatten und Muster">
              <Specimen title="Radien" className="flex flex-wrap gap-4">
                {[
                  ["xs", "rounded-xs", "6 px"],
                  ["sm", "rounded-sm", "10 px"],
                  ["md", "rounded-md", "14 px"],
                  ["lg", "rounded-lg", "20 px"],
                  ["xl", "rounded-xl", "28 px"],
                  ["Logo", "rounded-logo", "16 px"],
                  ["full", "rounded-full", "Pille"],
                ].map(([name, cls, px]) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className={`size-20 border border-line-strong bg-white ${cls}`} />
                    <p className="type-small text-text-muted">
                      {name} · {px}
                    </p>
                  </div>
                ))}
              </Specimen>
              <Specimen title="Schatten" className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"].map((s) => (
                  <div key={s} className={`flex h-24 items-center justify-center rounded-lg bg-white ${s}`}>
                    <span className="type-small text-text-muted">{s}</span>
                  </div>
                ))}
              </Specimen>
              <Specimen title="Blockraster" className="grid gap-4 sm:grid-cols-3">
                <div className="relative h-40 overflow-hidden rounded-lg bg-brand-500">
                  <BlockPattern seed="hr" cols={40} rows={20} className="absolute inset-0 size-full" />
                </div>
                <div className="relative h-40 overflow-hidden rounded-lg bg-brand-500">
                  <BlockPattern
                    seed="buchhaltung"
                    cols={40}
                    rows={20}
                    corners={["br", "tl"]}
                    className="absolute inset-0 size-full"
                  />
                </div>
                <div className="relative h-40 overflow-hidden rounded-lg border border-line bg-canvas">
                  <BlockPattern
                    seed="crm"
                    cols={40}
                    rows={20}
                    tone="canvas"
                    className="absolute inset-0 size-full"
                  />
                </div>
              </Specimen>
            </Section>

            <Section
              id="icons"
              title="Icons"
              intro="lucide-react mit Strichstärke 1,75, immer ohne Hintergrundform. Gesperrte Icons blockiert ESLint."
            >
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
                {[...CATEGORIES.map((c) => ({ label: c.shortName, icon: c.icon })), ...ICONS].map((item) => (
                  <li
                    key={item.label}
                    className="flex min-h-12 items-center gap-3 rounded-md border border-line bg-white px-3 type-small text-ink"
                  >
                    <Icon icon={item.icon} size={20} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              id="buttons"
              title="Buttons"
              intro="Ein primärer Button pro Bereich. Nie zwei orangefarbene Buttons nebeneinander."
            >
              <Specimen title="Primär (Signature)" className="flex flex-wrap items-center gap-4">
                <Button size="lg">Jetzt vergleichen</Button>
                <Button>Beratung anfordern</Button>
                <Button size="sm">Kostenlos testen</Button>
                <Button disabled>Deaktiviert</Button>
                <Button loading>Wird gesendet</Button>
                <ButtonLink href="/styleguide#buttons" icon="download">
                  Leitfaden herunterladen
                </ButtonLink>
              </Specimen>
              <Specimen title="Affiliate" className="flex flex-wrap items-start gap-8">
                <AffiliateButton href="/styleguide#buttons" label="Website besuchen" sponsored />
                <AffiliateButton
                  href="/styleguide#buttons"
                  label="Kostenlos testen"
                  sponsored
                  adLabel="inline"
                  size="sm"
                />
                <AffiliateButton href="https://example.com" label="Website besuchen" sponsored={false} />
              </Specimen>
              <Specimen title="Ink, Outline, Ghost" className="flex flex-wrap items-center gap-4">
                <Button variant="ink">Kostenlose Beratung</Button>
                <Button variant="ink" disabled>
                  Deaktiviert
                </Button>
                <Button variant="outline" icon="none">
                  Zum Vergleich hinzufügen
                </Button>
                <ButtonLink href="/styleguide#buttons" variant="outline">
                  Zur Kategorie
                </ButtonLink>
                <Button variant="outline" icon="none" disabled>
                  Deaktiviert
                </Button>
                <Button variant="ghost" icon="none">
                  Ghost
                </Button>
              </Specimen>
              <Specimen title="Link und runde Steuerung" className="flex flex-wrap items-center gap-6">
                <TextLink href="/styleguide#buttons">Zum Testbericht</TextLink>
                <TextLink href="/styleguide#buttons">Alle Bewertungen ansehen</TextLink>
                <IconButtonDemo />
              </Specimen>
              <Specimen
                title="Auf dunklem Grund"
                className="flex flex-wrap items-center gap-4 rounded-xl p-8 bg-ink-glow"
              >
                <Button>Beratung anfordern</Button>
                <Button variant="onDark" icon="none">
                  Mehr erfahren
                </Button>
              </Specimen>
            </Section>

            <Section id="chips" title="Chips, Wertung und Siegel">
              <Specimen title="Status" className="flex flex-wrap gap-3">
                <StatusChip icon={BadgeCheck} tone="positive">
                  Profil verifiziert
                </StatusChip>
                <StatusChip flag>Anbieter aus Deutschland</StatusChip>
                <StatusChip icon={Server}>Server in Deutschland</StatusChip>
                <StatusChip icon={CalendarCheck}>Kostenlose Testphase: 14&nbsp;Tage</StatusChip>
                <StatusChip icon={Plug}>DATEV-Schnittstelle</StatusChip>
                <Tag>Bankabgleich</Tag>
                <AdLabel />
              </Specimen>
              <Specimen title="ScoreChip und Sterne" className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <ScoreChip score={4.6} />
                  <ScoreChip score={3.9} size="sm" />
                </div>
                <div className="flex flex-col gap-3">
                  <RatingStars value={4.6} size={24} />
                  <RatingStars value={4.3} size={20} />
                  <RatingStars value={3.5} size={16} />
                  <RatingStars value={1.2} size={14} />
                </div>
              </Specimen>
              <Specimen title="Siegel" className="flex flex-wrap items-end gap-6">
                {AWARDS.map((kind) => (
                  <AwardSeal key={kind} kind={kind} year={2026} />
                ))}
                <AwardSeal kind="redaktion" year={2026} size="lg" />
                <AwardSeal kind="redaktion" year={2026} size="sm" />
              </Specimen>
              <Specimen title="Logo-Kacheln" className="flex flex-wrap items-end gap-4">
                <LogoTile name="Musterbuch" size={96} />
                <LogoTile name="Belegwerk Beispiel" size={88} />
                <LogoTile name="Kontoklar Demo" size={72} />
                <LogoTile name="Zahlenwerk Muster" size={48} />
                <LogoTile name="Personalakte Probe" size={40} />
              </Specimen>
            </Section>

            <Section
              id="formulare"
              title="Formulare"
              intro="Sichtbare Labels, Fehler auf Deutsch und per aria-describedby verknüpft, nichts vorausgewählt."
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Name" required>
                  {(a11y) => <Input {...a11y} defaultValue="" autoComplete="name" />}
                </Field>
                <Field
                  label="Geschäftliche E-Mail"
                  required
                  hint="Wir nutzen sie nur für die Antwort."
                  error="Bitte geben Sie eine geschäftliche E-Mail-Adresse ein."
                >
                  {(a11y) => <Input {...a11y} type="email" defaultValue="name@gmail.com" />}
                </Field>
                <Field label="Unternehmensgröße">
                  {(a11y) => (
                    <Select
                      triggerProps={a11y}
                      options={[
                        { value: "solo", label: "Selbstständige" },
                        { value: "1-9", label: "1 bis 9 Mitarbeitende" },
                      ]}
                    />
                  )}
                </Field>
                <Field label="Deaktiviertes Feld">
                  {(a11y) => <Input {...a11y} disabled defaultValue="Nicht änderbar" />}
                </Field>
                <Field label="Nachricht" optional className="md:col-span-2">
                  {(a11y) => <Textarea {...a11y} />}
                </Field>
              </div>
              <Specimen title="Auswahl" className="flex flex-col gap-2">
                <Checkbox
                  label="Ich stimme der Verarbeitung meiner Angaben zu."
                  description="Die Einwilligung ist freiwillig und jederzeit widerrufbar."
                />
                <Checkbox label="Bereits ausgewählt" defaultChecked />
                <Checkbox label="Deaktiviert" disabled />
                <Switch label="Nur Unterschiede anzeigen" />
                <Switch label="Nur Anbieter aus Deutschland" flag defaultChecked />
              </Specimen>
              <Specimen title="Schieberegler" className="max-w-md">
                <Slider label="Nutzerzahl" defaultValue={[25]} min={1} max={250} />
              </Specimen>
            </Section>

            <Section
              id="navigation"
              title="Navigation"
              intro="Kopfzeile oben, Fußzeile unten auf dieser Seite. Suche mit Strg K oder ⌘ K."
            >
              <Specimen title="Reiter">
                <Tabs
                  label="Beliebte Software nach Bereich"
                  items={[
                    { value: "kollaboration", label: "Kollaboration" },
                    { value: "hr", label: "HR" },
                    { value: "buchhaltung", label: "Buchhaltung" },
                    { value: "crm", label: "CRM" },
                    { value: "erp", label: "ERP" },
                    { value: "projektmanagement", label: "Projektmanagement" },
                    { value: "zeiterfassung", label: "Zeiterfassung" },
                    { value: "e-commerce", label: "E-Commerce" },
                  ]}
                  defaultValue="buchhaltung"
                >
                  {[
                    "kollaboration",
                    "hr",
                    "buchhaltung",
                    "crm",
                    "erp",
                    "projektmanagement",
                    "zeiterfassung",
                    "e-commerce",
                  ].map((v) => (
                    <TabPanel key={v} value={v} className="pt-4 type-small text-text-muted">
                      Inhalt für den Reiter {v}.
                    </TabPanel>
                  ))}
                </Tabs>
              </Specimen>
              <Specimen title="Brotkrumen">
                <Breadcrumbs
                  items={[
                    { label: "Startseite", href: "/" },
                    { label: "Buchhaltung", href: categoryHref("buchhaltung") },
                    { label: "Musterbuch", href: "/styleguide" },
                  ]}
                />
              </Specimen>
              <Specimen title="Profil-Unternavigation">
                <p className="type-small text-text-muted">
                  Erscheint am oberen Rand, sobald die Überschrift dieses Bereichs aus dem Bild scrollt.
                </p>
                <StickySubNav
                  sentinelId="navigation-titel"
                  score={4.6}
                  items={[
                    { id: "karten", label: "Überblick" },
                    { id: "daten", label: "Bewertung" },
                    { id: "preise", label: "Preise" },
                    { id: "vergleichstabelle", label: "Funktionen" },
                    { id: "interaktion", label: "Deutschland-Check" },
                    { id: "rueckmeldung", label: "Nutzerbewertungen" },
                  ]}
                  cta={
                    <AffiliateButton
                      href="/styleguide#navigation"
                      label="Website besuchen"
                      sponsored
                      adLabel="inline"
                      size="sm"
                    />
                  }
                />
              </Specimen>
            </Section>

            <Section id="karten" title="Karten">
              <Specimen title="Softwarekarten im Karussell">
                <Carousel label="Beliebte Software im Bereich Buchhaltung">
                  {DEMO_SOFTWARE.map((s) => (
                    <SoftwareCard key={s.slug} software={s} />
                  ))}
                </Carousel>
              </Specimen>
              <Specimen
                title="Bezahlte Platzierung (nur mit Anzeige)"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                <FeaturedCard software={first} />
                <FeaturedCard software={second} />
              </Specimen>
              <Specimen title="Rangliste" className="flex flex-col gap-6">
                <RankedListItem rank={1} software={first} details={DEMO_DETAILS} />
                <RankedListItem
                  rank={2}
                  software={second}
                  details={{ ...DEMO_DETAILS, verdict: "Zweites Beispiel für die Rangliste." }}
                />
              </Specimen>
              <Specimen
                title="Kategorien"
                className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4"
              >
                {CATEGORIES.slice(0, 4).map((c, i) => (
                  <CategoryTile
                    key={c.slug}
                    name={c.name}
                    icon={c.icon}
                    href="/styleguide#karten"
                    count={[9, 6, 5, 7][i] ?? 1}
                    logos={DEMO_SOFTWARE.slice(0, 3)}
                  />
                ))}
              </Specimen>
              <Specimen title="Vergleiche" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ComparisonCard
                  a={first}
                  b={second}
                  teaser="Zwei Beispielprogramme im direkten Vergleich."
                  href="/styleguide#karten"
                />
                <ComparisonCard
                  a={third}
                  b={fourth}
                  teaser="Noch ein Beispiel für eine Vergleichskarte."
                  href="/styleguide#karten"
                />
              </Specimen>
              <Specimen title="Leitfäden" className="flex flex-col gap-6">
                <div className="-mx-4 bg-canvas px-4 py-10 sm:mx-0 sm:rounded-xl sm:px-8">
                  <SectionHeading
                    align="center"
                    title="Software-Leitfäden zum Download"
                    intro="Kompaktes Wissen für Ihre Entscheidung: Funktionen, Preise, Stärken und Schwächen der wichtigsten Anbieter je Kategorie, als PDF zum Mitnehmen."
                  />
                  <Carousel
                    label="Software-Leitfäden"
                    slideClassName="basis-[75%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <GuideCard
                      title="HR-Software"
                      stickers={["HR"]}
                      slug="hr"
                      pages={24}
                      href="/styleguide#karten"
                    />
                    <GuideCard
                      title="Projektmanagement"
                      stickers={["Projektmanagement"]}
                      slug="projektmanagement"
                      pages={31}
                      href="/styleguide#karten"
                    />
                    <GuideCard
                      title="Sales"
                      stickers={["Sales"]}
                      slug="sales"
                      pages={18}
                      href="/styleguide#karten"
                    />
                    <GuideCard
                      title="Social und Intranet"
                      stickers={["Social", "Intranet"]}
                      slug="social-intranet"
                      pages={22}
                      href="/styleguide#karten"
                    />
                    <GuideCard
                      title="Buchhaltung"
                      stickers={["Buchhaltung"]}
                      slug="buchhaltung"
                      pages={27}
                      href="/styleguide#karten"
                    />
                  </Carousel>
                </div>
                <div className="grid max-w-xs grid-cols-2 gap-4">
                  <GuideCover stickers={["E-Rechnung"]} seed="e-rechnung" />
                  <GuideCover stickers={["Zeit", "Erfassung"]} seed="zeit" />
                </div>
              </Specimen>
              <Specimen title="Themen und Transparenz" className="grid gap-4 md:grid-cols-3">
                <TopicCard
                  topic="Kundenservice"
                  summary="Zusammenfassung erscheint erst ab zehn echten Bewertungen. Dieser Text ist ein Beispiel."
                  href="/styleguide#karten"
                />
                <TransparencyCard
                  icon={ListChecks}
                  title="So prüfen wir Bewertungen"
                  link={{ href: "/methodik", label: "Mehr zur Prüfung" }}
                >
                  Jede Bewertung wird über eine geschäftliche E-Mail-Adresse bestätigt.
                </TransparencyCard>
                <TransparencyCard icon={ShieldCheck} title="Wir löschen keine kritischen Bewertungen">
                  Kritik bleibt sichtbar, solange sie unsere Richtlinien einhält.
                </TransparencyCard>
              </Specimen>
              <Specimen title="Nutzerbewertung" className="grid gap-6 lg:grid-cols-2">
                <ReviewCard review={DEMO_REVIEW} />
                <EmptyState
                  title="Noch keine verifizierten Nutzerbewertungen"
                  text={`Sie arbeiten mit ${fifth.name}? Ihre Erfahrung hilft anderen Unternehmen bei der Entscheidung.`}
                  action={
                    <ButtonLink href="/styleguide#karten" variant="ink">
                      Bewertung schreiben
                    </ButtonLink>
                  }
                  icon={PenLine}
                />
              </Specimen>
            </Section>

            <Section id="daten" title="Datenanzeige">
              <div className="grid gap-6 lg:grid-cols-3">
                <ScoreCard score={4.6} methodHref="/methodik" />
                <ScoreCard
                  score={4.6}
                  methodHref="/methodik"
                  userRatings={{ average: 4.4, count: 3, distribution: [2, 1, 0, 0, 0] }}
                />
                <ScoreCard
                  score={4.6}
                  methodHref="/methodik"
                  userRatings={{ average: 4.4, count: 87, distribution: [52, 22, 8, 3, 2] }}
                />
              </div>
              <div className="grid gap-10 lg:grid-cols-2">
                <Specimen title="Kriterien">
                  <CriterionBars
                    scores={{
                      funktionsumfang: 4.8,
                      bedienung: 4.5,
                      preisLeistung: 4.2,
                      datenschutz: 4.6,
                      support: 4.0,
                      integrationen: 4.4,
                    }}
                  />
                </Specimen>
                <Specimen title="Stärken und Schwächen">
                  <ProsCons pros={DEMO_DETAILS.pros} cons={DEMO_DETAILS.cons} />
                </Specimen>
              </div>
              <Specimen title="Deutschland-Check">
                <DeutschlandCheck rows={DEMO_CHECK} />
              </Specimen>
              <Specimen title="Kennzahlen" className="grid gap-8 rounded-xl p-8 bg-ink-glow sm:grid-cols-3">
                <StatTile
                  onDark
                  value="128"
                  label="Softwareprofile"
                  footnote="Basis: eigene Daten, Stand Oktober 2026 (Beispielwert)"
                />
                <StatTile onDark value="14" label="Kategorien" />
                <StatTile
                  onDark
                  value={formatPrice(2490)}
                  label="Mittlerer Einstiegspreis"
                  footnote="netto pro Monat (Beispielwert)"
                />
              </Specimen>
            </Section>

            <Section id="preise" title="Preise">
              <PricingTable plans={DEMO_PLANS} verifiedAt="2026-10-14" />
              <CostCalculator
                product={{ name: "Musterbuch", plans: DEMO_PLANS }}
                alternatives={DEMO_ALTERNATIVES}
                verifiedAt="2026-10-14"
              />
            </Section>

            <Section id="vergleichstabelle" title="Vergleichstabelle">
              <ComparisonTable
                caption="Beispielvergleich von drei Programmen"
                products={DEMO_COMPARISON_PRODUCTS}
                groups={DEMO_COMPARISON_GROUPS}
              />
            </Section>

            <Section
              id="diagramme"
              title="Diagramme"
              intro="Recharts, erst im Browser geladen. Jedes Diagramm mit Titel, Kernaussage, Fußnote und Tabellenansicht. Erfundene Beispieldaten."
            >
              <div className="grid gap-10 lg:grid-cols-2">
                <ChartFrame
                  title="Einstiegspreise"
                  takeaway="Am günstigsten startet Musterbuch mit 9,90 € im Monat."
                  summary="Balkendiagramm mit Beispielpreisen."
                  footnote="Beispieldaten, netto pro Monat"
                  table={{
                    columns: ["Programm", "Preis"],
                    rows: DEMO_PRICE_BARS.map((d) => [d.label, formatPrice(d.cents)]),
                  }}
                  height={200}
                >
                  <PriceBars data={DEMO_PRICE_BARS} />
                </ChartFrame>
                <ChartFrame
                  title="Preis und Wertung"
                  takeaway="Belegwerk Beispiel hat die höchste Wertung je Euro."
                  summary="Streudiagramm mit Beispieldaten."
                  footnote="Beispieldaten"
                  table={{
                    columns: ["Programm", "Preis", "Wertung"],
                    rows: DEMO_SCATTER.map((d) => [d.name, `${d.euros} €`, formatRating(d.score)]),
                  }}
                  height={260}
                >
                  <ScoreScatter data={DEMO_SCATTER} />
                </ChartFrame>
                <ChartFrame
                  title="Stärken auf einen Blick"
                  takeaway="Am stärksten bewertet: Datenschutz."
                  summary="Netzdiagramm mit Beispielwerten."
                  footnote="Beispieldaten, Skala 0 bis 5"
                  table={{
                    columns: ["Kriterium", "Wertung"],
                    rows: DEMO_RADAR.map((d) => [d.label, formatRating(d.value)]),
                  }}
                  height={280}
                >
                  <CriteriaRadar data={DEMO_RADAR} />
                </ChartFrame>
                <ChartFrame
                  title="Gewichtung der Kriterien"
                  takeaway="Funktionsumfang zählt am meisten."
                  summary="Ringdiagramm der Standardgewichtung."
                  footnote="Standardgewichtung"
                  table={{
                    columns: ["Kriterium", "Gewichtung"],
                    rows: DEMO_RADAR.map((d, i) => [d.label, formatPercent(DEMO_WEIGHTS[i]!)]),
                  }}
                  height={260}
                >
                  <WeightsDonut
                    data={DEMO_RADAR.map((d, i) => ({ label: d.label, percent: DEMO_WEIGHTS[i]! }))}
                  />
                </ChartFrame>
                <ChartFrame
                  title="Kosten nach Nutzerzahl"
                  takeaway="Ab 5 Nutzern ist der Pauschaltarif günstiger."
                  summary="Stufenlinien mit Beispieltarifen."
                  footnote="Beispieldaten, netto pro Monat"
                  table={{
                    columns: ["Nutzer", "Musterbuch", "Belegwerk Beispiel"],
                    rows: DEMO_COST_ROWS.map((r) => [
                      String(r.users),
                      `${r.Musterbuch} €`,
                      `${r["Belegwerk Beispiel"]} €`,
                    ]),
                  }}
                  height={280}
                >
                  <CostLines rows={DEMO_COST_ROWS} series={["Musterbuch", "Belegwerk Beispiel"]} />
                </ChartFrame>
                <ChartFrame
                  title="Die Kriterien im direkten Vergleich"
                  takeaway="Musterbuch liegt in 4 von 6 Kriterien vorn."
                  summary="Gegenüberstellung mit Beispielwerten."
                  footnote="Beispieldaten, Skala 0 bis 5"
                  table={{
                    columns: ["Kriterium", "Musterbuch", "Belegwerk Beispiel"],
                    rows: DEMO_RADAR.map((d) => [
                      d.label,
                      formatRating(d.value),
                      formatRating(d.value - 0.3),
                    ]),
                  }}
                  height={300}
                >
                  <Butterfly
                    nameA="Musterbuch"
                    nameB="Belegwerk Beispiel"
                    rows={DEMO_RADAR.map((d, i) => ({
                      label: d.label,
                      a: d.value,
                      b: i % 3 === 0 ? d.value + 0.2 : d.value - 0.3,
                    }))}
                  />
                </ChartFrame>
              </div>
            </Section>

            <Section id="interaktion" title="Interaktion">
              <Specimen title="Ergebniskopf mit Filtern">
                <ResultsHeaderDemo />
              </Specimen>
              <Specimen title="Methodik-Hinweis">
                <MethodologyBar methodHref="/methodik" />
              </Specimen>
              <Specimen title="Softwarefinder">
                <SoftwarefinderDemo />
              </Specimen>
              <Specimen title="Beratung" className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
                <Accordion
                  items={[
                    {
                      id: "f1",
                      title: "Was kostet die Beratung?",
                      content: "Die Beratung ist für Unternehmen kostenlos und unverbindlich.",
                    },
                    {
                      id: "f2",
                      title: "Wie schnell melden Sie sich?",
                      content: "Beispielantwort für die Darstellung eines geöffneten Eintrags.",
                    },
                    {
                      id: "f3",
                      title: "Welche Daten brauchen Sie?",
                      content: "Name, geschäftliche E-Mail-Adresse und Unternehmensgröße.",
                    },
                  ]}
                />
                <AdvisorPanel
                  sticky={false}
                  privacyHref="/datenschutz"
                  categories={CATEGORIES.map((c) => ({ value: c.slug, label: c.shortName }))}
                  defaultCategory="buchhaltung"
                  onSubmit={requestAdvice}
                />
              </Specimen>
              <Specimen title="Dialog, Seitenleiste, Popover, Tooltip, Toast">
                <OverlayDemo />
              </Specimen>
            </Section>

            <Section
              id="einwilligung"
              title="Einwilligung"
              intro="Erscheint auf der Seite erst, wenn ein einwilligungspflichtiger Dienst eingetragen ist. Hier mit erfundenen Diensten und ohne Speicherung."
            >
              <ConsentProvider services={DEMO_CONSENT_SERVICES} demo>
                <p className="type-small text-text-muted">Banner der ersten Ebene:</p>
              </ConsentProvider>
            </Section>

            <Section id="rueckmeldung" title="Rückmeldung">
              <div className="grid gap-4 md:grid-cols-3">
                <Notice tone="info" icon={Info} title="Hinweis">
                  Preise netto zzgl. MwSt.
                </Notice>
                <Notice tone="positive" icon={CircleCheck} title="Gesendet">
                  Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns per E-Mail.
                </Notice>
                <Notice tone="negative" icon={CircleAlert} title="Fehler">
                  Das hat leider nicht geklappt. Bitte versuchen Sie es in einem Moment erneut.
                </Notice>
              </div>
              <Specimen title="Ladezustand einer Softwarekarte" className="max-w-xs">
                <LoadingRegion>
                  <div className="overflow-hidden rounded-lg border border-line bg-white">
                    <Skeleton className="h-24 rounded-none" />
                    <div className="flex flex-col items-center gap-3 p-5">
                      <Skeleton className="-mt-16 size-22 rounded-logo border-4 border-white" />
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </LoadingRegion>
              </Specimen>
              <EmptyState
                title="Keine Treffer"
                text="Versuchen Sie einen allgemeineren Begriff oder stöbern Sie in den Kategorien."
                icon={Search}
                action={
                  <ButtonLink href="/styleguide#navigation" variant="outline">
                    Alle Kategorien
                  </ButtonLink>
                }
              />
            </Section>
          </div>
        </div>
      </main>
      <Footer
        popularComparisons={[{ label: "Musterbuch oder Belegwerk Beispiel", href: "/styleguide#karten" }]}
        latestGuides={[{ label: "Beispielratgeber", href: "/styleguide#karten" }]}
      />
      <CompareTrayDemo />
    </CompareProvider>
  );
}
