"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Honeypot, Input, Textarea } from "@/components/ui/field";
import { Checkbox, type SelectOption } from "@/components/ui/form";
import { COMPANY_SIZE_LABEL, type CompanySize } from "@/lib/format";
import { AdviceSchema, type AdviceInput } from "@/lib/forms/schemas";
import type { FormResult } from "@/lib/forms/types";

import {
  ConsentLabel,
  ControlledCheckbox,
  ControlledSelect,
  SentNotice,
  ServerError,
  StepProgress,
  useActionForm,
} from "./form-kit";

const SIZE_OPTIONS: SelectOption[] = (Object.keys(COMPANY_SIZE_LABEL) as CompanySize[]).map((value) => ({
  value,
  label: COMPANY_SIZE_LABEL[value],
}));

const STEPS = ["Kategorie", "Unternehmen und Anforderungen", "Kontakt"];
const STEP_FIELDS = [
  ["kategorie"],
  ["groesse", "anforderungen"],
  ["name", "email", "nachricht", "einwilligung"],
] as const;

/**
 * Multi step advice request for /beratung (Section 13.8): Kategorie, Unternehmensgröße und
 * Anforderungen, Kontakt. Every step validates before the next one opens.
 */
export function AdviceWizard({
  categories,
  requirements,
  action,
}: {
  categories: SelectOption[];
  requirements: SelectOption[];
  action: (data: AdviceInput) => Promise<FormResult>;
}) {
  const [step, setStep] = useState(0);
  const { form, status, serverError, onSubmit, formRef, focusFirstError } = useActionForm(
    AdviceSchema,
    action,
    {
      anforderungen: [],
      einwilligung: false as unknown as true,
    },
  );
  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = form;

  if (status === "sent") {
    return (
      <SentNotice title="Anfrage gesendet">
        Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns per E-Mail. Eine Bestätigung ist auf dem
        Weg in Ihr Postfach.
      </SentNotice>
    );
  }

  const next = async () => {
    const fields = [...STEP_FIELDS[step]] as (keyof AdviceInput)[];
    if (step === 0 && !form.getValues("kategorie")) {
      form.setError("kategorie", { message: "Bitte wählen Sie eine Kategorie oder „Noch unklar“." });
      focusFirstError();
      return;
    }
    if (await trigger(fields)) setStep((s) => s + 1);
    else focusFirstError();
  };

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={step === STEPS.length - 1 ? onSubmit : (e) => (e.preventDefault(), void next())}
      className="relative flex flex-col gap-6 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
      aria-label="Beratung anfragen"
    >
      <Honeypot />
      <StepProgress index={step} steps={STEPS} />

      {step === 0 && (
        <ControlledSelect
          control={control}
          name="kategorie"
          label="Für welchen Bereich suchen Sie Software?"
          required
          options={[...categories, { value: "unklar", label: "Noch unklar" }]}
        />
      )}

      {step === 1 && (
        <>
          <ControlledSelect
            control={control}
            name="groesse"
            label="Unternehmensgröße"
            required
            options={SIZE_OPTIONS}
          />
          <Controller
            control={control}
            name="anforderungen"
            render={({ field }) => (
              <fieldset className="flex flex-col gap-1">
                <legend className="mb-2 type-label text-ink">
                  Was ist Ihnen wichtig? <span className="font-normal text-text-muted">(optional)</span>
                </legend>
                <div className="grid gap-x-6 sm:grid-cols-2">
                  {requirements.map((r) => {
                    const list = (field.value as string[] | undefined) ?? [];
                    return (
                      <Checkbox
                        key={r.value}
                        label={r.label}
                        checked={list.includes(r.label)}
                        onCheckedChange={(v) =>
                          field.onChange(v === true ? [...list, r.label] : list.filter((x) => x !== r.label))
                        }
                      />
                    );
                  })}
                </div>
              </fieldset>
            )}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Field label="Name" required error={errors.name?.message}>
            {(a11y) => <Input autoComplete="name" {...register("name")} {...a11y} />}
          </Field>
          <Field label="Geschäftliche E-Mail" required error={errors.email?.message}>
            {(a11y) => (
              <Input type="email" autoComplete="email" inputMode="email" {...register("email")} {...a11y} />
            )}
          </Field>
          <Field
            label="Ihre Nachricht"
            optional
            hint="Zum Beispiel: Welche Software nutzen Sie heute, und was soll besser werden?"
            error={errors.nachricht?.message}
          >
            {(a11y) => <Textarea rows={4} {...register("nachricht")} {...a11y} />}
          </Field>
          <ControlledCheckbox
            control={control}
            name="einwilligung"
            label={<ConsentLabel purpose="zur Bearbeitung meiner Anfrage" />}
          />
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
            Beratung anfordern
          </Button>
        )}
      </div>
    </form>
  );
}
