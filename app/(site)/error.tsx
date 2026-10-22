"use client";

import { Button, ButtonLink } from "@/components/ui/button";

/** Error boundary for site pages (Section 13.12): friendly German, a retry and a way home. */
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-content flex flex-col gap-6 py-16 lg:py-24">
      <p className="type-eyebrow text-brand-ink">Fehler</p>
      <h1 className="type-h1 text-ink">Das hat leider nicht geklappt.</h1>
      <p className="measure type-lead text-text-muted">
        Beim Laden dieser Seite ist ein Fehler aufgetreten. Bitte versuchen Sie es in einem Moment erneut.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset} icon="none">
          Erneut versuchen
        </Button>
        <ButtonLink href="/" variant="outline" icon="none">
          Zur Startseite
        </ButtonLink>
      </div>
    </div>
  );
}
