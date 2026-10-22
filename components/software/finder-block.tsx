"use client";

import { ArrowRight, Building2, User, Users } from "lucide-react";
import { useState } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import { ScoreChip } from "@/components/ui/score-chip";
import { CATEGORY_ICONS } from "@/lib/content/icons";
import type { CategoryData } from "@/lib/content/schemas";
import { findMatches, requirementsFor, type FinderMatch, type FinderProduct } from "@/lib/finder";
import { COMPANY_SIZE_LABEL, type CompanySize } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

import { Softwarefinder, type FinderAnswers, type FinderStep } from "./softwarefinder";

export type FinderCategory = { slug: string; label: string; icon: CategoryData["icon"] };

const SIZE_ICON: Record<CompanySize, typeof User> = {
  solo: User,
  "1-9": Users,
  "10-49": Users,
  "50-249": Building2,
  "250+": Building2,
};

/**
 * Softwarefinder with results (Section 7.4, home block 5). Everything is computed in the browser
 * from the products the server passes in; nothing is sent anywhere.
 */
export function FinderBlock({
  categories,
  products,
  className,
}: {
  categories: FinderCategory[];
  products: FinderProduct[];
  className?: string;
}) {
  const [result, setResult] = useState<{ category: string; matches: FinderMatch[] } | null>(null);
  const [run, setRun] = useState(0);

  const steps: FinderStep[] = [
    {
      id: "kategorie",
      question: "Welche Software suchen Sie?",
      options: categories.map((c) => ({ value: c.slug, label: c.label, icon: CATEGORY_ICONS[c.icon] })),
    },
    {
      id: "groesse",
      question: "Wie groß ist Ihr Unternehmen?",
      options: (Object.keys(COMPANY_SIZE_LABEL) as CompanySize[]).map((v) => ({
        value: v,
        label: COMPANY_SIZE_LABEL[v],
        icon: SIZE_ICON[v],
      })),
    },
    {
      id: "anforderungen",
      question: "Was ist Ihnen besonders wichtig?",
      hint: "Mehrfachauswahl möglich. Wir zeigen nur Anforderungen, die mindestens ein Programm erfüllt.",
      multiple: true,
      options: [],
    },
  ];

  const complete = (answers: FinderAnswers) => {
    const category = answers.kategorie?.[0];
    if (!category) return;
    setResult({
      category,
      matches: findMatches(products, {
        category,
        size: (answers.groesse?.[0] as CompanySize | undefined) ?? null,
        requirements: answers.anforderungen ?? [],
      }),
    });
  };

  if (result) {
    const category = categories.find((c) => c.slug === result.category);
    return (
      <section
        aria-labelledby="finder-ergebnis"
        className={cn("rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8", className)}
      >
        <p className="type-eyebrow text-text-muted">Ihr Ergebnis</p>
        <h3 id="finder-ergebnis" className="mt-2 type-h3 text-ink" tabIndex={-1}>
          Diese {result.matches.length === 1 ? "Software passt" : `${result.matches.length} Programme passen`}{" "}
          am besten
        </h3>
        <ol className="mt-6 flex flex-col gap-4">
          {result.matches.map((m, i) => (
            <li
              key={m.product.slug}
              className="flex flex-col gap-4 rounded-lg border border-line p-5 sm:flex-row"
            >
              <div className="flex items-center gap-4 sm:w-64 sm:flex-none">
                <span className="text-h4 font-display font-semibold text-text-muted tabular-nums">
                  {i + 1}
                </span>
                <LogoTile name={m.product.name} logo={m.product.logo} size={48} />
                <span className="flex flex-col items-start gap-1">
                  <span className="type-label font-semibold text-ink">{m.product.name}</span>
                  <ScoreChip score={m.score} size="sm" />
                </span>
              </div>
              <p className="flex-1 type-small text-text-muted">{m.reason}</p>
              <AppLink
                href={m.product.href}
                className="link-cta inline-flex min-h-11 flex-none items-center gap-1 self-start text-small sm:self-center"
                aria-label={`${m.product.name}: Profil ansehen`}
              >
                Profil ansehen <Icon icon={ArrowRight} size={16} />
              </AppLink>
            </li>
          ))}
        </ol>
        <p className="mt-5 type-small text-text-muted">
          Grundlage sind die Angaben der Anbieter und unsere Redaktionswertung. Platzierungen sind nicht
          käuflich.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {category && (
            <ButtonLink href={routes.category(category.slug)} variant="ink">
              Alle Programme: {category.label}
            </ButtonLink>
          )}
          <Button
            variant="ghost"
            icon="none"
            onClick={() => {
              setResult(null);
              setRun((r) => r + 1);
            }}
          >
            Neu starten
          </Button>
        </div>
      </section>
    );
  }

  return (
    <Softwarefinder
      key={run}
      steps={steps}
      className={className}
      onComplete={complete}
      resolveOptions={(step, answers) =>
        step.id === "anforderungen"
          ? requirementsFor(products, answers.kategorie?.[0] ?? "").map((r) => ({
              value: r.id,
              label: r.label,
            }))
          : step.options
      }
    />
  );
}
