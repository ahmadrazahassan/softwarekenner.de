"use client";

import { BadgeCheck, Flag, Share2, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Tag } from "@/components/ui/chip";
import { Disclosure } from "@/components/ui/disclosure";
import { Icon } from "@/components/ui/icon";
import { RatingStars } from "@/components/ui/rating-stars";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

export type UserReview = {
  id: string;
  displayName: string;
  role: string;
  companySize: string;
  date: string;
  rating: number;
  verified: boolean;
  /** Reviews written for an incentive are labeled (Section 19). */
  incentivized: boolean;
  title: string;
  body: string;
  strengths: string[];
  weaknesses: string[];
  helpfulCount: number;
  vendorReply?: { vendorName: string; date: string; text: string };
};

const actionClass =
  "type-label inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-text-muted transition-colors hover:bg-surface-tint hover:text-ink focus-visible:outline-2 focus-visible:outline-ink aria-pressed:text-ink";

/**
 * Review card (Section 7.2 E, References 2 and 3). Rendered only for real, verified reviews.
 * At launch the collection is empty and pages show the empty state instead.
 */
export function ReviewCard({
  review,
  onShare,
  onReport,
  className,
}: {
  review: UserReview;
  onShare?: (id: string) => void;
  onReport?: (id: string) => void;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const bodyId = `review-${review.id}-body`;

  return (
    <article
      className={cn("flex flex-col gap-4 rounded-lg border border-line bg-white p-6 shadow-sm", className)}
    >
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 flex-none items-center justify-center rounded-full bg-line font-display font-bold text-ink"
        >
          {initials(review.displayName)}
        </span>
        <div className="flex min-w-0 flex-col">
          <p className="type-label font-semibold text-ink">{review.displayName}</p>
          <p className="type-small text-text-muted">
            {review.role}, {review.companySize}
          </p>
        </div>
        <p className="ml-auto flex-none type-small text-text-muted">
          <time dateTime={review.date}>{formatDate(review.date)}</time>
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <RatingStars value={review.rating} size={16} />
        {review.verified && (
          <span className="inline-flex items-center gap-1 type-small font-ui font-medium text-positive">
            <Icon icon={BadgeCheck} size={16} />
            Verifiziert
          </span>
        )}
        {review.incentivized && <span className="type-micro text-text-muted">Mit Anreiz verfasst</span>}
      </div>

      <div>
        <h3 className="type-body-lg font-bold text-ink">{review.title}</h3>
        <p id={bodyId} className={cn("mt-2 type-body text-ink", !expanded && "line-clamp-6")}>
          {review.body}
        </p>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded((v) => !v)}
          className="link-cta mt-1 text-small"
        >
          {expanded ? "Weniger anzeigen" : "Mehr anzeigen"}
        </button>
      </div>

      {(review.strengths.length > 0 || review.weaknesses.length > 0) && (
        <div className="flex flex-col gap-2">
          {review.strengths.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="type-small font-semibold text-positive">Stärken:</span>
              {review.strengths.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          )}
          {review.weaknesses.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="type-small font-semibold text-negative">Schwächen:</span>
              {review.weaknesses.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          )}
        </div>
      )}

      {review.vendorReply && (
        <div className="rounded-md bg-surface-tint px-4 py-1">
          <Disclosure label={`Antwort von ${review.vendorReply.vendorName}`}>
            <p className="pb-3 type-small text-text-muted">
              <time dateTime={review.vendorReply.date}>{formatDate(review.vendorReply.date)}</time>
            </p>
            <p className="pb-4 type-body text-ink">{review.vendorReply.text}</p>
          </Disclosure>
        </div>
      )}

      <footer className="-ml-3 flex flex-wrap items-center gap-1 border-t border-line pt-3">
        <button
          type="button"
          aria-pressed={helpful}
          onClick={() => setHelpful((v) => !v)}
          className={actionClass}
        >
          <Icon icon={ThumbsUp} size={16} />
          Hilfreich ({review.helpfulCount + (helpful ? 1 : 0)})
        </button>
        <button type="button" onClick={() => onShare?.(review.id)} className={actionClass}>
          <Icon icon={Share2} size={16} />
          Teilen
        </button>
        <button type="button" onClick={() => onReport?.(review.id)} className={actionClass}>
          <Icon icon={Flag} size={16} />
          Melden
        </button>
      </footer>
    </article>
  );
}
