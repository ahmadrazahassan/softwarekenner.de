"use client";

import { Button } from "@/components/ui/button";
import { Field, Honeypot, Input, Textarea } from "@/components/ui/field";
import { LISTING_REQUESTS, ListingSchema, type ListingInput } from "@/lib/forms/schemas";
import type { FormResult } from "@/lib/forms/types";

import {
  ConsentLabel,
  ControlledCheckbox,
  ControlledSelect,
  SentNotice,
  ServerError,
  useActionForm,
} from "./form-kit";

const REQUEST_OPTIONS = Object.entries(LISTING_REQUESTS).map(([value, label]) => ({ value, label }));

/** Software eintragen, Profil übernehmen, Fehler melden (Section 13.10). Free; nothing here is for sale. */
export function ListingForm({
  action,
  defaultRequest,
}: {
  action: (data: ListingInput) => Promise<FormResult>;
  defaultRequest?: keyof typeof LISTING_REQUESTS;
}) {
  const { form, status, serverError, onSubmit, formRef } = useActionForm(ListingSchema, action, {
    anliegen: defaultRequest,
    einwilligung: false as unknown as true,
  });
  const {
    control,
    register,
    formState: { errors },
  } = form;

  if (status === "sent") {
    return (
      <SentNotice title="Angaben gesendet">
        Vielen Dank. Wir prüfen Ihre Angaben anhand öffentlicher Quellen und melden uns per E-Mail, falls wir
        Rückfragen haben.
      </SentNotice>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label="Angaben zur Software senden"
      className="relative flex flex-col gap-5 rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <Honeypot />
      <ControlledSelect
        control={control}
        name="anliegen"
        label="Ihr Anliegen"
        required
        options={REQUEST_OPTIONS}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Produktname" required error={errors.produkt?.message}>
          {(a11y) => <Input {...register("produkt")} {...a11y} />}
        </Field>
        <Field label="Website des Produkts" required error={errors.website?.message} hint="Mit https://">
          {(a11y) => (
            <Input type="url" inputMode="url" placeholder="https://" {...register("website")} {...a11y} />
          )}
        </Field>
      </div>
      <Field label="Anbieter laut Impressum" required error={errors.anbieter?.message}>
        {(a11y) => <Input autoComplete="organization" {...register("anbieter")} {...a11y} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ihr Name" required error={errors.name?.message}>
          {(a11y) => <Input autoComplete="name" {...register("name")} {...a11y} />}
        </Field>
        <Field label="Geschäftliche E-Mail" required error={errors.email?.message}>
          {(a11y) => (
            <Input type="email" autoComplete="email" inputMode="email" {...register("email")} {...a11y} />
          )}
        </Field>
      </div>
      <Field
        label="Nachricht"
        optional
        hint="Zum Beispiel Link zur Preisseite, Serverstandort mit Quelle oder der Fehler, den Sie gefunden haben."
        error={errors.nachricht?.message}
      >
        {(a11y) => <Textarea rows={5} {...register("nachricht")} {...a11y} />}
      </Field>
      <ControlledCheckbox
        control={control}
        name="einwilligung"
        label={<ConsentLabel purpose="zur Bearbeitung meines Anliegens" />}
      />
      <ServerError message={serverError} />
      <Button type="submit" loading={status === "sending"} className="self-start">
        Angaben senden
      </Button>
    </form>
  );
}
