import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LegalReviewNote } from "@/components/content/page-parts";
import { Ph } from "@/components/content/placeholder";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Impressum",
  description: `Impressum von ${siteConfig.brand.name}: Anbieterkennzeichnung nach § 5 DDG und Verantwortliche nach § 18 Abs. 2 MStV.`,
  path: routes.legal.imprint(),
});

/** One row of the spec sheet: number and heading on the left, the data on the right. */
function Row({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-x-8 gap-y-3 border-b border-ink py-7 lg:grid-cols-12 lg:py-9">
      <div className="flex gap-4 lg:col-span-4">
        <span aria-hidden="true" className="font-ui text-caption font-semibold text-ink tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="font-ui text-caption font-semibold tracking-[0.08em] text-ink uppercase">{title}</h2>
      </div>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

const valueClass =
  "font-display text-[1.25rem] leading-[1.3] font-medium tracking-[-0.01em] text-ink sm:text-[1.5rem]";
const linkClass = "underline decoration-1 underline-offset-4 hover:decoration-2";

/**
 * Impressum (Section 13.13) as an editorial spec sheet, matching Über uns. The legal content is the
 * same as before; only the layout changed. Optional blocks stay hidden while their value is null.
 */
export default function ImprintPage() {
  const l = siteConfig.legal;
  const c = siteConfig.contact;
  const rows: { title: string; content: ReactNode }[] = [
    {
      title: "Angaben gemäß § 5 DDG",
      content: (
        <p className={valueClass}>
          <Ph value={l.companyLegalName} />
          <br />
          {siteConfig.brand.name}
          <br />
          {l.companyStreet}
          <br />
          {l.companyCity}
        </p>
      ),
    },
    ...(l.managingDirector
      ? [
          {
            title: "Vertretung",
            content: (
              <p className={valueClass}>
                Vertreten durch die Geschäftsführung: <Ph value={l.managingDirector} />
              </p>
            ),
          },
        ]
      : []),
    {
      title: "Kontakt",
      content: (
        <dl className={`${valueClass} grid grid-cols-[auto_1fr] gap-x-6 gap-y-1`}>
          <dt className="pt-1.5 font-ui text-caption font-semibold tracking-[0.08em] uppercase sm:pt-2">
            Telefon
          </dt>
          <dd>
            <a href={c.phoneHref} className={linkClass}>
              {c.phone}
            </a>
          </dd>
          <dt className="pt-1.5 font-ui text-caption font-semibold tracking-[0.08em] uppercase sm:pt-2">
            E-Mail
          </dt>
          <dd className="min-w-0 break-words">
            <a href={`mailto:${c.email}`} className={linkClass}>
              {c.email}
            </a>
          </dd>
        </dl>
      ),
    },
    ...(l.registerCourt && l.registerNumber
      ? [
          {
            title: "Registereintrag",
            content: (
              <p className={valueClass}>
                Registergericht: <Ph value={l.registerCourt} />
                <br />
                Registernummer: <Ph value={l.registerNumber} />
              </p>
            ),
          },
        ]
      : []),
    ...(l.vatId
      ? [
          {
            title: "Umsatzsteuer-Identifikationsnummer",
            content: (
              <p className={valueClass}>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {l.vatId}
              </p>
            ),
          },
        ]
      : []),
    {
      title: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      content: (
        <p className={valueClass}>
          <Ph value={l.editorInChief} />
          <br />
          {l.companyStreet}
          <br />
          {l.companyCity}
        </p>
      ),
    },
    {
      title: "Verbraucherstreitbeilegung",
      content: (
        <p className="measure type-body-lg text-ink">
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      ),
    },
  ];

  return (
    <div className="pb-24 lg:pb-32">
      <header className="container-content pt-8">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: routes.home() },
            { label: "Impressum", href: routes.legal.imprint() },
          ]}
        />
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-1 border-y border-ink py-2.5 font-ui text-micro tracking-[0.08em] text-ink uppercase lg:grid-cols-12">
          <span className="lg:col-span-4">Rechtliches · 01</span>
          <span className="text-right lg:col-span-4 lg:text-left">§ 5 DDG</span>
          <span className="lg:col-span-2">§ 18 Abs. 2 MStV</span>
          <span className="text-right lg:col-span-2">{siteConfig.brand.name}</span>
        </div>
        <h1 className="mt-10 font-display text-[clamp(3.25rem,13vw,11rem)] leading-[0.85] font-medium tracking-[-0.045em] text-ink uppercase lg:mt-14">
          Impressum
        </h1>
      </header>

      <div className="container-content mt-12 flex flex-col gap-8 lg:mt-16">
        <LegalReviewNote />
        <div className="border-t border-ink">
          {rows.map((row, i) => (
            <Row key={row.title} number={i + 1} title={row.title}>
              {row.content}
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}
