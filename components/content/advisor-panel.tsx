"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { AppLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { Field, Honeypot, Input, Textarea } from "@/components/ui/field";
import { Checkbox, Select, type SelectOption } from "@/components/ui/form";
import { COMPANY_SIZE_LABEL, type CompanySize } from "@/lib/format";
import type { FormResult } from "@/lib/forms/types";
import { cn } from "@/lib/utils/cn";

const SIZE_OPTIONS: SelectOption[] = (Object.keys(COMPANY_SIZE_LABEL) as CompanySize[]).map((value) => ({
  value,
  label: COMPANY_SIZE_LABEL[value],
}));

const FREE_MAIL = /@(gmail|googlemail|gmx|web|yahoo|outlook|hotmail|t-online|icloud|freenet|aol)\./i;

type Errors = Partial<Record<"name" | "email" | "size" | "consent", string>>;

/**
 * Advisory panel (Section 7.2 J, Reference 1 sidebar). Validates on the client, then calls the server
 * action; the thank you message appears only when the server confirms delivery.
 * No advisor photo until a real one exists; never an AI generated "employee".
 */
export function AdvisorPanel({
  categories,
  defaultCategory,
  privacyHref,
  onSubmit,
  sticky = true,
  className,
}: {
  categories: SelectOption[];
  defaultCategory?: string;
  privacyHref: string;
  onSubmit: (data: FormData) => Promise<FormResult>;
  sticky?: boolean;
  className?: string;
}) {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [size, setSize] = useState<string>();
  const [category, setCategory] = useState(defaultCategory);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitError, setSubmitError] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name) next.name = "Bitte geben Sie Ihren Namen ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    else if (FREE_MAIL.test(email)) next.email = "Bitte geben Sie eine geschäftliche E-Mail-Adresse ein.";
    if (!size) next.size = "Bitte wählen Sie die Größe Ihres Unternehmens.";
    if (!consent) next.consent = "Bitte bestätigen Sie die Einwilligung, damit wir Sie kontaktieren dürfen.";
    // Render the errors synchronously so the first invalid field can take focus.
    flushSync(() => setErrors(next));
    if (Object.keys(next).length > 0) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    data.set("groesse", size ?? "");
    data.set("kategorie", category ?? "");
    data.set("einwilligung", "true");
    setStatus("sending");
    setSubmitError(undefined);
    const result = await onSubmit(data);
    if (result.ok) setStatus("sent");
    else {
      setStatus("idle");
      setSubmitError(result.message);
    }
  }

  return (
    <aside
      aria-labelledby={`${id}-title`}
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-white shadow-md",
        sticky && "lg:sticky lg:top-24",
        className,
      )}
    >
      <div className="px-6 pt-6 pb-5 text-white bg-ink-glow">
        <p className="type-eyebrow text-brand-500">Noch unsicher?</p>
        <h2 id={`${id}-title`} className="mt-2 type-h3">
          Lassen Sie sich kostenlos beraten
        </h2>
        <p className="mt-2 type-small text-on-dark-muted">
          Unser Team kennt die Anbieter und hilft Ihnen, die Auswahl einzugrenzen. Unverbindlich und ohne
          Verkaufsdruck.
        </p>
      </div>

      {status === "sent" ? (
        <div className="p-6">
          <Notice tone="positive" icon={CircleCheck} title="Anfrage gesendet">
            Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns per E-Mail.
          </Notice>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="relative flex flex-col gap-4 p-6">
          <Honeypot />
          <Field label="Name" required error={errors.name}>
            {(a11y) => <Input name="name" autoComplete="name" {...a11y} />}
          </Field>
          <Field label="Geschäftliche E-Mail" required error={errors.email}>
            {(a11y) => <Input name="email" type="email" autoComplete="email" inputMode="email" {...a11y} />}
          </Field>
          <Field label="Unternehmensgröße" required error={errors.size}>
            {(a11y) => (
              <Select options={SIZE_OPTIONS} value={size} onValueChange={setSize} triggerProps={a11y} />
            )}
          </Field>
          <Field label="Kategorie">
            {(a11y) => (
              <Select options={categories} value={category} onValueChange={setCategory} triggerProps={a11y} />
            )}
          </Field>
          <Field label="Nachricht" optional>
            {(a11y) => <Textarea name="nachricht" rows={3} className="min-h-24" {...a11y} />}
          </Field>
          <div>
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              label={
                <>
                  Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.
                  Details in der{" "}
                  <AppLink href={privacyHref} className="link-inline">
                    Datenschutzerklärung
                  </AppLink>
                  .
                </>
              }
            />
            <p
              id={`${id}-consent-error`}
              aria-live="polite"
              className={cn("type-small text-negative", !errors.consent && "sr-only")}
            >
              {errors.consent}
            </p>
          </div>
          {submitError && (
            <Notice tone="negative" icon={CircleAlert}>
              {submitError}
            </Notice>
          )}
          <Button type="submit" block loading={status === "sending"}>
            Beratung anfordern
          </Button>
        </form>
      )}
    </aside>
  );
}
