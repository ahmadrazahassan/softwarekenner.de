import {
  Check,
  CircleCheck,
  CircleDot,
  CircleHelp,
  CircleX,
  ExternalLink,
  Minus,
  type LucideIcon,
} from "lucide-react";

import { GrowBar } from "@/components/ui/animated";
import { TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { RatingStars } from "@/components/ui/rating-stars";
import { formatPercent, formatRating } from "@/lib/format";
import { routes } from "@/lib/routes";
import { CRITERIA, CRITERION_LABEL, scoreLabel, type Scores } from "@/lib/scoring";
import { cn } from "@/lib/utils/cn";

import type { CheckRow, Status } from "./types";

/* ---------- Stärken und Schwächen (Section 7.3) ---------- */

export function ProsCons({ pros, cons, className }: { pros: string[]; cons: string[]; className?: string }) {
  return (
    <div className={cn("grid gap-8 sm:grid-cols-2", className)}>
      <div>
        <h3 className="mb-4 type-h4 text-ink">Stärken</h3>
        <ul className="flex flex-col gap-3">
          {pros.map((item) => (
            <li key={item} className="flex gap-3 type-body text-ink">
              <Icon icon={Check} size={20} className="mt-0.5 flex-none text-positive" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-4 type-h4 text-ink">Schwächen</h3>
        <ul className="flex flex-col gap-3">
          {cons.map((item) => (
            <li key={item} className="flex gap-3 type-body text-ink">
              <Icon icon={Minus} size={20} className="mt-0.5 flex-none text-negative" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Status icon (Deutschland-Check, comparison table) ---------- */

export const STATUS_META: Record<Status, { icon: LucideIcon; label: string; className: string }> = {
  ja: { icon: CircleCheck, label: "erfüllt", className: "text-positive" },
  teilweise: { icon: CircleDot, label: "teilweise erfüllt", className: "text-brand-ink" },
  nein: { icon: CircleX, label: "nicht erfüllt", className: "text-negative" },
  unbekannt: { icon: CircleHelp, label: "keine Angabe", className: "text-text-subtle" },
};

export function StatusIcon({ status, size = 20 }: { status: Status; size?: 16 | 20 | 24 }) {
  const meta = STATUS_META[status];
  return <Icon icon={meta.icon} size={size} label={meta.label} className={cn("flex-none", meta.className)} />;
}

/* ---------- Deutschland-Check grid (Section 7.3) ---------- */

export function DeutschlandCheck({ rows, className }: { rows: CheckRow[]; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-line bg-white", className)}>
      <ul className="divide-y divide-line">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[minmax(0,14rem)_1fr_auto] sm:items-center"
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={row.status} />
              <span className="type-label font-semibold text-ink">{row.label}</span>
            </div>
            <p className="pl-8 type-small text-text-muted sm:pl-0">
              <span className="sr-only">{STATUS_META[row.status].label}. </span>
              {row.note}
            </p>
            {row.source ? (
              <a
                href={row.source.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-1 pl-8 type-small font-ui font-medium text-brand-ink underline-offset-4 hover:underline sm:pl-0"
              >
                Quelle: {row.source.label}
                <Icon icon={ExternalLink} size={14} />
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
      <ul
        aria-label="Legende"
        className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line bg-surface-tint px-5 py-3"
      >
        {(Object.keys(STATUS_META) as Status[]).map((status) => (
          <li key={status} className="flex items-center gap-1.5 type-small text-text-muted">
            <Icon icon={STATUS_META[status].icon} size={16} className={STATUS_META[status].className} />
            {STATUS_META[status].label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- StatTile (Section 7.2 H) ---------- */

export function StatTile({
  value,
  label,
  footnote,
  onDark,
  className,
}: {
  /** Pre formatted, computed from our data only. */
  value: string;
  label: string;
  footnote?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className={cn("type-stat", onDark ? "text-white" : "text-ink")}>{value}</p>
      <p className={cn("type-label", onDark ? "text-white" : "text-ink")}>{label}</p>
      {footnote && (
        <p className={cn("type-small", onDark ? "text-on-dark-muted" : "text-text-muted")}>{footnote}</p>
      )}
    </div>
  );
}

/* ---------- ScoreCard (Section 7.2 I) ---------- */

export type UserRatingSummary = {
  average: number;
  count: number;
  /** Count per star, index 0 is 5 stars. */
  distribution: [number, number, number, number, number];
};

export function ScoreCard({
  score,
  methodHref,
  userRatings,
  className,
}: {
  score: number;
  methodHref: string;
  /** Only real, verified user reviews. Average is shown from 5 reviews on (Section 11.5). */
  userRatings?: UserRatingSummary | null;
  className?: string;
}) {
  const showUser = userRatings && userRatings.count > 0;
  return (
    <div className={cn("rounded-lg border border-line bg-white p-6 shadow-sm", className)}>
      <p className="type-eyebrow text-text-muted">Redaktionswertung</p>
      <div className="mt-3 flex items-end gap-4">
        <p className="type-score text-ink">
          <span aria-hidden="true">{formatRating(score)}</span>
          <span className="sr-only">{formatRating(score)} von 5</span>
        </p>
        <div className="flex flex-col gap-1.5 pb-1">
          <p className="type-h4 text-ink">{scoreLabel(score)}</p>
          <RatingStars value={score} size={20} showValue={false} />
        </div>
      </div>
      <TextLink href={methodHref} className="mt-3">
        So bewerten wir
      </TextLink>

      <div className="mt-5 border-t border-line pt-5">
        {showUser ? (
          <UserRatingBlock ratings={userRatings} />
        ) : (
          <div className="flex flex-col gap-1">
            <p className="type-small text-text-muted">Sie nutzen diese Software im Unternehmen?</p>
            <TextLink href={routes.writeReview()}>Erfahrung teilen</TextLink>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRatingBlock({ ratings }: { ratings: UserRatingSummary }) {
  const withAverage = ratings.count >= 5;
  const total = ratings.distribution.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex flex-col gap-3">
      <p className="type-label text-ink">
        Nutzerbewertungen{" "}
        {withAverage ? (
          <span className="font-display font-semibold tabular-nums">
            {formatRating(ratings.average)} ({ratings.count})
          </span>
        ) : (
          <span className="text-text-muted">({ratings.count}, Durchschnitt ab 5 Bewertungen)</span>
        )}
      </p>
      {withAverage && (
        <ul className="flex flex-col gap-2" aria-label="Verteilung der Nutzerbewertungen">
          {ratings.distribution.map((count, i) => {
            const stars = 5 - i;
            const share = (count / total) * 100;
            return (
              <li
                key={stars}
                className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 type-small text-text-muted"
              >
                <span>{stars === 1 ? "1 Stern" : `${stars} Sterne`}</span>
                <span className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
                  <span className="block h-full rounded-full bg-brand-500" style={{ width: `${share}%` }} />
                </span>
                <span className="text-right tabular-nums">{formatPercent(share)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------- Criterion bars (Section 14.3) ---------- */

export function CriterionBars({ scores, className }: { scores: Scores; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-4", className)}>
      {CRITERIA.map((key) => (
        <li key={key} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="type-label text-ink">{CRITERION_LABEL[key]}</span>
            <span className="font-display font-semibold text-ink tabular-nums">
              {formatRating(scores[key])}
              <span className="sr-only"> von 5</span>
            </span>
          </div>
          <GrowBar percent={(scores[key] / 5) * 100} delay={0.06 * CRITERIA.indexOf(key)} />
        </li>
      ))}
    </ul>
  );
}
