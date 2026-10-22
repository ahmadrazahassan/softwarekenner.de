import {
  BadgeCheck,
  CalendarCheck,
  Euro,
  Gift,
  Headset,
  History,
  ListChecks,
  PenLine,
  Plug,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AppLink } from "@/components/ui/app-link";

import { StatusChip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { TransparencyCard } from "@/components/review/cards";
import type { AuthorData, SoftwareData } from "@/lib/content/schemas";
import { entryPrice } from "@/lib/content/query";
import { formatDate, formatPrice, initials, PRICE_UNIT_LABEL } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

const SERVER: Record<string, string> = {
  DE: "Deutschland",
  EU: "EU",
  USA: "USA",
  weltweit: "weltweit",
  unbekannt: "Keine Angabe",
};

/** Honest wording switch for headings and links (Section 11.4). */
export const profileTitle = (s: SoftwareData) =>
  s.editorial.handsOnTest
    ? `${s.name} im Test: Funktionen, Preise und Bewertung`
    : `${s.name} im Überblick: Funktionen, Preise und Bewertung`;

export function ProfileChips({ software }: { software: SoftwareData }) {
  return (
    <div className="flex flex-wrap gap-2">
      {software.madeInGermany && <StatusChip flag>Anbieter aus Deutschland</StatusChip>}
      {software.hosting.serverLocation === "DE" && (
        <StatusChip icon={Server}>Server in Deutschland</StatusChip>
      )}
      {software.pricing.trialDays && (
        <StatusChip icon={CalendarCheck}>
          Kostenlose Testphase: {software.pricing.trialDays}&nbsp;Tage
        </StatusChip>
      )}
      {software.pricing.freePlan && <StatusChip icon={Gift}>Kostenlose Version</StatusChip>}
      {software.integrations.some((i) => i.toLowerCase().includes("datev")) && (
        <StatusChip icon={Plug}>DATEV-Schnittstelle</StatusChip>
      )}
    </div>
  );
}

export function KeyFacts({ software, className }: { software: SoftwareData; className?: string }) {
  const price = entryPrice(software);
  const facts = [
    {
      icon: Euro,
      label: "Preis ab",
      value: price ? `${formatPrice(price.cents)} ${PRICE_UNIT_LABEL[price.unit]}` : "Preis auf Anfrage",
    },
    {
      icon: CalendarCheck,
      label: "Testphase",
      value: software.pricing.trialDays ? `${software.pricing.trialDays} Tage` : "Keine Angabe",
    },
    { icon: Gift, label: "Kostenlose Version", value: software.pricing.freePlan ? "Ja" : "Nein" },
    {
      icon: Server,
      label: "Serverstandort",
      value: SERVER[software.hosting.serverLocation] ?? "Keine Angabe",
    },
    { icon: Headset, label: "Support", value: software.germanSupport ? "Auf Deutsch" : "Keine Angabe" },
    { icon: Users, label: "Ideal für", value: software.editorial.bestFor[0] ?? "" },
  ];
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6", className)}>
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 type-micro text-text-muted">
            <Icon icon={f.icon} size={14} />
            {f.label}
          </dt>
          <dd className="type-label font-semibold text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Avatar({ author, size = 48 }: { author: AuthorData; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex flex-none items-center justify-center rounded-full bg-line font-display font-bold text-ink"
      style={{ width: size, height: size }}
    >
      {initials(author.name)}
    </span>
  );
}

/** Kurzfazit panel with author (Section 13.3, step 4). */
export function Kurzfazit({ software, author }: { software: SoftwareData; author?: AuthorData }) {
  return (
    <aside className="rounded-lg bg-brand-50 p-6 sm:p-8">
      <p className="type-eyebrow text-brand-ink">Kurzfazit</p>
      <p className="mt-3 type-body-lg text-ink">{software.editorial.verdict}</p>
      {author && (
        <div className="mt-5 flex items-center gap-3">
          <Avatar author={author} size={40} />
          <p className="type-small text-text-muted">
            <AppLink href={routes.author(author.slug)} className="font-semibold text-ink hover:underline">
              {author.name}
            </AppLink>
            , {author.role}
          </p>
        </div>
      )}
    </aside>
  );
}

export function FitLists({ software }: { software: SoftwareData }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h3 className="type-h4 text-ink">Ideal für</h3>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 type-body text-ink marker:text-positive">
          {software.editorial.bestFor.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="type-h4 text-ink">Weniger geeignet für</h3>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 type-body text-ink marker:text-negative">
          {software.editorial.notFor.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SourcesList({ software }: { software: SoftwareData }) {
  return (
    <div>
      <h3 className="type-h4 text-ink">Quellen</h3>
      <ul className="mt-3 flex flex-col gap-1.5 type-small text-text-muted">
        {software.editorial.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener" className="link-inline">
              {s.label}
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
            , abgerufen am {formatDate(s.accessedAt)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuthorBox({
  software,
  author,
  reviewer,
}: {
  software: SoftwareData;
  author?: AuthorData;
  reviewer?: AuthorData;
}) {
  return (
    <section
      aria-labelledby="autorenbox"
      className="flex flex-col gap-6 rounded-lg border border-line bg-white p-6 sm:p-8"
    >
      <h2 id="autorenbox" className="sr-only">
        Über diese Bewertung
      </h2>
      {author && (
        <div className="flex gap-4">
          <Avatar author={author} />
          <div>
            <p className="type-label font-semibold text-ink">
              <AppLink href={routes.author(author.slug)} className="hover:underline">
                {author.name}
              </AppLink>
            </p>
            <p className="type-small text-text-muted">{author.role}</p>
            <p className="mt-2 type-body text-ink">{author.bio}</p>
          </div>
        </div>
      )}
      <dl className="grid gap-2 border-t border-line pt-5 type-small text-text-muted sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Icon icon={PenLine} size={16} />
          <dt>Fachlich geprüft von</dt>
          <dd className="font-semibold text-ink">{reviewer?.name ?? "Keine Angabe"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon={History} size={16} />
          <dt>Zuletzt aktualisiert am</dt>
          <dd className="font-semibold text-ink">{formatDate(software.editorial.updatedAt)}</dd>
        </div>
      </dl>
      {software.editorial.changelog.length > 0 && (
        <div>
          <h3 className="type-label font-semibold text-ink">Änderungsprotokoll</h3>
          <ul className="mt-2 flex flex-col gap-1 type-small text-text-muted">
            {software.editorial.changelog.map((c) => (
              <li key={`${c.date}-${c.note}`}>
                <time dateTime={c.date}>{formatDate(c.date)}</time>: {c.note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** How we handle user reviews (Section 13.3, step 10; § 5b Abs. 3 UWG). */
export function ReviewTransparency() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TransparencyCard
        icon={BadgeCheck}
        title="So prüfen wir Bewertungen"
        link={{ href: routes.methodology(), label: "Zur Methodik" }}
      >
        Jede Bewertung wird vor der Veröffentlichung über eine geschäftliche E-Mail-Adresse bestätigt.
      </TransparencyCard>
      <TransparencyCard icon={ShieldCheck} title="Wir löschen keine kritischen Bewertungen">
        Kritik bleibt sichtbar, solange sie unsere Richtlinien einhält. Anbieter können antworten, aber nicht
        löschen.
      </TransparencyCard>
      <TransparencyCard icon={ListChecks} title="Getrennt von unserer Wertung">
        Nutzerbewertungen fließen nicht in die Redaktionswertung ein und werden getrennt angezeigt.
      </TransparencyCard>
    </div>
  );
}
