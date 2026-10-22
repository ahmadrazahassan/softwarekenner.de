"use client";

import { CircleCheck } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { Honeypot } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import type { FormResult } from "@/lib/forms/types";
import { cn } from "@/lib/utils/cn";

/**
 * Newsletter sign up (Sections 13.1 and 19): email only, double opt in, privacy link.
 * Validates on the client, then calls the server action. Success is shown only when the server confirms it.
 */
export function NewsletterForm({
  privacyHref,
  onDark,
  onBrand,
  onSubmit,
  className,
}: {
  privacyHref: string;
  onDark?: boolean;
  /** On a brand-500 surface (footer): white field, ink button, ink texts. */
  onBrand?: boolean;
  onSubmit: (data: FormData) => Promise<FormResult>;
  className?: string;
}) {
  const id = useId();
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    setError(undefined);
    setPending(true);
    const result = await onSubmit(data);
    setPending(false);
    if (result.ok) setSent(true);
    else setError(result.message);
  }

  if (sent) {
    return (
      <p
        role="status"
        className={cn("flex items-start gap-2 type-body", onDark ? "text-white" : "text-ink", className)}
      >
        <Icon icon={CircleCheck} size={20} className="mt-0.5 flex-none text-brand-500" />
        Fast geschafft. Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail, die wir Ihnen gerade
        geschickt haben.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className={cn("relative flex flex-col gap-3", className)}>
      <Honeypot name="newsletter_website" />
      <label htmlFor={`${id}-email`} className={cn("type-label", onDark ? "text-white" : "text-ink")}>
        E-Mail-Adresse
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint ${error ? `${id}-error` : ""}`.trim()}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-full border px-5 font-body text-body outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
            onDark
              ? "border-ink-700 bg-ink-800 text-white placeholder:text-on-dark-muted focus-visible:outline-white aria-invalid:border-brand-500"
              : onBrand
                ? "border-ink bg-white text-ink focus-visible:outline-ink aria-invalid:border-2"
                : "border-line-strong bg-white text-ink focus-visible:outline-ink aria-invalid:border-negative",
          )}
        />
        <Button type="submit" variant={onBrand ? "ink" : "primary"} size="md" loading={pending}>
          Anmelden
        </Button>
      </div>
      <p
        id={`${id}-error`}
        aria-live="polite"
        className={cn(
          "type-small",
          onDark ? "text-brand-200" : onBrand ? "font-semibold text-ink" : "text-negative",
          !error && "sr-only",
        )}
      >
        {error}
      </p>
      <p
        id={`${id}-hint`}
        className={cn("type-small", onDark ? "text-on-dark-muted" : onBrand ? "text-ink" : "text-text-muted")}
      >
        Sie erhalten eine E-Mail zur Bestätigung (Double Opt-in). Abmeldung jederzeit über den Link in jeder
        Ausgabe. Mehr in der{" "}
        <AppLink
          href={privacyHref}
          className={cn(
            "underline underline-offset-3",
            onDark ? "text-white" : onBrand ? "font-semibold text-ink" : "text-brand-ink",
          )}
        >
          Datenschutzerklärung
        </AppLink>
        .
      </p>
    </form>
  );
}
