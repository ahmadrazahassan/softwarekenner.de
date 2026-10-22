import { ArrowRight, Euro, ListChecks, ShieldCheck, type LucideIcon } from "lucide-react";

import { subscribeNewsletter } from "@/app/actions/forms";
import { AppLink } from "@/components/ui/app-link";
import { Icon } from "@/components/ui/icon";
import { CATEGORIES, categoryHref, FOOTER_COMPANY, FOOTER_LEGAL } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/site.config";

import { LogoMark } from "./logo-mark";
import { NewsletterForm } from "./newsletter-form";

type LinkItem = { href: string; label: string };

/** The three big entry cells across the full width (owner reference: Superfluid footer). */
const ENTRY_CELLS = [
  { href: routes.categories(), label: "Kategorien" },
  { href: routes.compareTool(), label: "Vergleiche" },
  { href: routes.advisory(), label: "Beratung" },
] as const;

/** Facts about how we work, each one true for the whole site. Two lines per label. */
const PRINCIPLES: { icon: LucideIcon; lines: [string, string] }[] = [
  { icon: ListChecks, lines: ["Offene", "Methodik"] },
  { icon: Euro, lines: ["Preise", "in Euro"] },
  { icon: ShieldCheck, lines: ["Ohne", "Tracking-Cookies"] },
];

const linkClass =
  "inline-flex min-h-9 items-center font-ui text-label whitespace-nowrap text-ink decoration-[1.5px] underline-offset-4 hover:underline";

function Column({ title, links, wrap }: { title: string; links: readonly LinkItem[]; wrap?: boolean }) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={title} className="lg:text-right">
      <h2 className="font-ui text-caption font-semibold tracking-[0.06em] text-ink uppercase">{title}</h2>
      <ul className="mt-3 flex flex-col lg:items-end">
        {links.map((link) => (
          <li key={link.href}>
            <AppLink href={link.href} className={cn(linkClass, wrap && "py-1 whitespace-normal")}>
              {link.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Brand name across the full width. An SVG with a fixed text length scales with the container, so
 * the name always runs edge to edge without measuring in the browser. The values fit Outfit 800 for
 * the current brand name; another name is stretched or squeezed to the same width.
 */
function GiantWordmark() {
  return (
    <svg
      viewBox="0 -152 1622 156"
      aria-hidden="true"
      focusable="false"
      className="block h-auto w-full overflow-visible"
    >
      <LogoMark x={0} y={-146} size={146} tone="ink" />
      <text
        x={176}
        y={0}
        textLength={1446}
        lengthAdjust="spacingAndGlyphs"
        className="fill-ink font-display"
        style={{ fontSize: 204, fontWeight: 800, letterSpacing: "-0.04em" }}
      >
        {siteConfig.brand.name}
      </text>
    </svg>
  );
}

/**
 * Footer (Section 7.1, owner reference: Superfluid). Brand orange with ink rules: three big entry
 * cells, an advice or newsletter block, link columns, the brand name across the full width, and the
 * disclosure line. Comparison and guide links come from content and are passed in.
 */
export function Footer({
  popularComparisons = [],
  latestGuides = [],
  year = siteConfig.brand.copyrightYear,
  categorySlugs,
}: {
  /** Only these categories are linked (the visible ones). All when omitted. */
  categorySlugs?: string[];
  popularComparisons?: LinkItem[];
  latestGuides?: LinkItem[];
  year?: number;
}) {
  const categoryLinks = CATEGORIES.filter((c) => !categorySlugs || categorySlugs.includes(c.slug))
    .slice(0, 8)
    .map((c) => ({
      href: categoryHref(c.slug),
      label: c.shortName,
    }));
  const { legal, contact } = siteConfig;

  return (
    <footer className="bg-brand-500 text-ink">
      <nav aria-label="Schnellzugriff" className="border-y-[1.5px] border-ink">
        <ul className="grid sm:grid-cols-3">
          {ENTRY_CELLS.map((cell, i) => (
            <li
              key={cell.href}
              className="border-ink not-last:border-b-[1.5px] sm:not-last:border-r-[1.5px] sm:not-last:border-b-0"
            >
              <AppLink
                href={cell.href}
                className="group relative flex h-20 items-center justify-between gap-4 px-(--gutter) transition-colors duration-200 ease-soft hover:bg-ink hover:text-brand-500 focus-visible:outline-offset-[-6px] sm:h-44 sm:justify-center lg:h-60"
              >
                <span
                  aria-hidden="true"
                  className="font-ui text-caption font-semibold tabular-nums sm:absolute sm:top-5 sm:left-6"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mr-auto font-display text-[1.625rem] leading-none font-semibold tracking-[-0.01em] uppercase sm:mr-0 lg:text-[2rem]">
                  {cell.label}
                </span>
                <Icon
                  icon={ArrowRight}
                  size={24}
                  className="transition-transform duration-200 ease-soft group-hover:-rotate-45 sm:absolute sm:top-5 sm:right-6"
                />
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-wide grid gap-14 pt-14 pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 lg:pt-20 lg:pb-24">
        <div className="flex max-w-sm flex-col gap-7">
          {siteConfig.features.newsletter ? (
            <>
              <h2 className="font-display text-[1.875rem] leading-[0.98] font-bold tracking-[-0.02em] uppercase">
                Einmal im Monat das Wichtigste
              </h2>
              <NewsletterForm privacyHref={routes.legal.privacy()} onBrand onSubmit={subscribeNewsletter} />
            </>
          ) : (
            <>
              <h2 className="font-display text-[1.875rem] leading-[0.98] font-bold tracking-[-0.02em] uppercase">
                Lassen Sie sich
                <br />
                kostenlos beraten
              </h2>
              <AppLink
                href={routes.advisory()}
                className="group flex items-center justify-between gap-4 border-b-2 border-ink pb-2.5 font-ui text-small font-semibold tracking-[0.06em] uppercase"
              >
                Beratung anfordern
                <Icon
                  icon={ArrowRight}
                  size={20}
                  className="transition-transform duration-200 ease-soft group-hover:translate-x-1"
                />
              </AppLink>
              <address className="flex flex-col gap-0.5 type-small not-italic">
                <span className="font-semibold">
                  {siteConfig.brand.name} · {legal.companyLegalName}
                </span>
                <span>{legal.companyAddress}</span>
                <a href={`mailto:${contact.email}`} className="w-fit underline-offset-4 hover:underline">
                  {contact.email}
                </a>
                <a href={contact.phoneHref} className="w-fit underline-offset-4 hover:underline">
                  {contact.phone}
                </a>
              </address>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:flex lg:gap-14 xl:gap-20">
          <Column
            title="Kategorien"
            links={[...categoryLinks, { href: routes.categories(), label: "Alle Kategorien" }]}
          />
          <Column title="Beliebte Vergleiche" links={popularComparisons} />
          <Column title="Ratgeber" links={latestGuides} wrap />
          <Column title="Unternehmen" links={FOOTER_COMPANY} />
          <Column title="Rechtliches" links={FOOTER_LEGAL} />
        </div>
      </div>

      <div className="container-wide">
        <GiantWordmark />
      </div>

      <div className="container-wide flex flex-col gap-6 pt-8 pb-8 lg:flex-row lg:items-end lg:justify-between lg:pt-10">
        <ul className="flex gap-8">
          {PRINCIPLES.map(({ icon, lines }) => (
            <li key={lines.join(" ")} className="flex flex-col items-center gap-1.5 text-center">
              <Icon icon={icon} size={24} />
              <span className="font-ui text-[0.625rem] leading-tight font-semibold tracking-[0.06em] whitespace-nowrap uppercase">
                {lines[0]}
                <br />
                {lines[1]}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-ui text-caption leading-relaxed lg:text-right">
          <span className="block">
            © {year} {siteConfig.brand.name} · Alle Preise zzgl. gesetzlicher MwSt., sofern nicht anders
            angegeben.
          </span>
          <span className="block">Mit&nbsp;* gekennzeichnete Links sind Affiliate-Links.</span>
        </p>
      </div>
    </footer>
  );
}
