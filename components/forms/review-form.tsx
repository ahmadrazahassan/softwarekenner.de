"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Honeypot, Input, Textarea } from "@/components/ui/field";
import { type SelectOption } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { COMPANY_SIZE_LABEL, type CompanySize } from "@/lib/format";
import {
  REVIEW_RATINGS,
  REVIEW_STEPS,
  ReviewSchema,
  USAGE_DURATION,
  type ReviewInput,
} from "@/lib/forms/schemas";
import type { FormResult } from "@/lib/forms/types";
import { cn } from "@/lib/utils/cn";

import {
  ConsentLabel,
  ControlledCheckbox,
  ControlledSelect,
  errorOf,
  SentNotice,
  ServerError,
  StepProgress,
  useActionForm,
} from "./form-kit";

const STEPS = ["Programm und Sterne", "Ihre Erfahrung", "Über Sie und Bestätigung"];
const SIZE_OPTIONS: SelectOption[] = (Object.keys(COMPANY_SIZE_LABEL) as CompanySize[]).map((value) => ({
  value,
  label: COMPANY_SIZE_LABEL[value],
}));
const DURATION_OPTIONS = Object.entries(USAGE_DURATION).map(([value, label]) => ({ value, label }));

/** One to five stars as a native radio group: keyboard and screen reader friendly. */
function StarRating({
  control,
  name,
  label,
}: {
  control: Control<ReviewInput>;
  name: `bewertungen.${keyof typeof REVIEW_RATINGS}`;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <fieldset aria-invalid={fieldState.error ? true : undefined} className="flex flex-col gap-1">
          <legend className="type-label text-ink">{label}</legend>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
              const on = typeof field.value === "number" && n <= field.value;
              return (
                <label
                  key={n}
                  className="relative flex size-11 cursor-pointer items-center justify-center rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-ink"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={n}
                    checked={field.value === n}
                    onChange={() => field.onChange(n)}
                    onBlur={field.onBlur}
                    className="sr-only"
                  />
                  <Icon
                    icon={Star}
                    size={28}
                    className={cn(on ? "fill-brand-500 text-brand-700" : "text-line-strong")}
                  />
                  <span className="sr-only">{n === 1 ? "1 Stern" : `${n} Sterne`}</span>
                </label>
              );
            })}
          </div>
          <p aria-live="polite" className={cn("type-small text-negative", !fieldState.error && "sr-only")}>
            {fieldState.error?.message}
          </p>
        </fieldset>
      )}
    />
  );
}

/**
 * Bewertung schreiben (Section 13.11): three steps, business email check, confirmation link.
 * Submissions go to the moderation queue (email adapter) and appear only after review.
 */
export function ReviewForm({
  products,
  defaultProduct,
  action,
}: {
  products: SelectOption[];
  defaultProduct?: string;
  action: (data: ReviewInput) => Promise<FormResult>;
}) {
  const [step, setStep] = useState(0);
  const { form, status, serverError, onSubmit, formRef, focusFirstError } = useActionForm(
    ReviewSchema,
    action,
    {
      produkt: defaultProduct,
      anreiz: false,
      richtlinien: false as unknown as true,
      einwilligung: false as unknown as true,
    },
  );
  const {
    control,
    register,
    trigger,
    watch,
    formState: { errors },
  } = form;
  const erfahrung = watch("erfahrung") ?? "";

  if (status === "sent") {
    return (
      <SentNotice title="Fast geschafft">
        Bitte bestätigen Sie Ihre geschäftliche E-Mail-Adresse über den Link, den wir Ihnen gerade geschickt
        haben. Danach prüfen wir Ihre Bewertung und veröffentlichen sie.
      </SentNotice>
    );
  }

  const next = async () => {
    const fields = REVIEW_STEPS[step]!.map((f) =>
      f === "bewertungen" ? "bewertungen" : f,
    ) as (keyof ReviewInput)[];
    if (await trigger(fields)) setStep((s) => s + 1);
    else focusFirstError();
  };

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={step === STEPS.length - 1 ? onSubmit : (e) => (e.preventDefault(), void next())}
      aria-label="Bewertung schreiben"
      className="relative flex flex-col gap-6 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <Honeypot />
      <StepProgress index={step} steps={STEPS} />

      {step === 0 && (
        <>
          <ControlledSelect
            control={control}
            name="produkt"
            label="Welches Programm bewerten Sie?"
            required
            options={products}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {(Object.keys(REVIEW_RATINGS) as (keyof typeof REVIEW_RATINGS)[]).map((key) => (
              <StarRating
                key={key}
                control={control}
                name={`bewertungen.${key}`}
                label={REVIEW_RATINGS[key]}
              />
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <Field label="Titel Ihrer Bewertung" required error={errors.titel?.message}>
            {(a11y) => <Input {...register("titel")} {...a11y} />}
          </Field>
          <Field label="Was gefällt Ihnen?" required error={errors.staerken?.message}>
            {(a11y) => <Textarea rows={3} {...register("staerken")} {...a11y} />}
          </Field>
          <Field label="Was gefällt Ihnen nicht?" required error={errors.schwaechen?.message}>
            {(a11y) => <Textarea rows={3} {...register("schwaechen")} {...a11y} />}
          </Field>
          <Field
            label="Ihre Erfahrung"
            required
            hint={`Mindestens 200 Zeichen, bisher ${erfahrung.trim().length}.`}
            error={errors.erfahrung?.message}
          >
            {(a11y) => <Textarea rows={7} {...register("erfahrung")} {...a11y} />}
          </Field>
          <ControlledSelect
            control={control}
            name="nutzungsdauer"
            label="Wie lange nutzen Sie das Programm?"
            required
            options={DURATION_OPTIONS}
          />
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Ihre Rolle im Unternehmen"
              required
              error={errors.rolle?.message}
              hint="Zum Beispiel Geschäftsführung"
            >
              {(a11y) => <Input autoComplete="organization-title" {...register("rolle")} {...a11y} />}
            </Field>
            <Field label="Branche" required error={errors.branche?.message}>
              {(a11y) => <Input {...register("branche")} {...a11y} />}
            </Field>
          </div>
          <ControlledSelect
            control={control}
            name="groesse"
            label="Unternehmensgröße"
            required
            options={SIZE_OPTIONS}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name für die Anzeige"
              required
              hint="Zum Beispiel Vorname und erster Buchstabe des Nachnamens."
              error={errors.anzeigename?.message}
            >
              {(a11y) => <Input autoComplete="nickname" {...register("anzeigename")} {...a11y} />}
            </Field>
            <Field
              label="Geschäftliche E-Mail"
              required
              hint="Nur zur Bestätigung, wird nicht veröffentlicht."
              error={errors.email?.message}
            >
              {(a11y) => (
                <Input type="email" autoComplete="email" inputMode="email" {...register("email")} {...a11y} />
              )}
            </Field>
          </div>
          <ControlledCheckbox
            control={control}
            name="anreiz"
            label="Ich habe für diese Bewertung eine Gegenleistung erhalten (zum Beispiel einen Gutschein)."
            description="Dann kennzeichnen wir die Bewertung entsprechend."
          />
          <ControlledCheckbox
            control={control}
            name="richtlinien"
            label="Ich nutze das Programm selbst beruflich und arbeite weder für den Anbieter noch für einen Wettbewerber."
          />
          <ControlledCheckbox
            control={control}
            name="einwilligung"
            label={<ConsentLabel purpose="zur Prüfung und Veröffentlichung meiner Bewertung" />}
          />
          {errorOf(errors, "bewertungen") && (
            <ServerError message="Bitte prüfen Sie die Sterne in Schritt 1." />
          )}
        </>
      )}

      <ServerError message={serverError} />

      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" icon="none" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Zurück
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="submit" variant="ink">
            Weiter
          </Button>
        ) : (
          <Button type="submit" loading={status === "sending"}>
            Bewertung senden
          </Button>
        )}
      </div>
    </form>
  );
}
