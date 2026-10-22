"use client";

import { Button } from "@/components/ui/button";
import { Field, Honeypot, Input } from "@/components/ui/field";
import { DownloadSchema, type DownloadInput } from "@/lib/forms/schemas";
import type { FormResult } from "@/lib/forms/types";

import { ConsentLabel, ControlledCheckbox, SentNotice, ServerError, useActionForm } from "./form-kit";

/** Leitfaden request (Section 13.7): double opt in email with the download link. */
export function DownloadForm({
  slug,
  action,
}: {
  slug: string;
  action: (data: DownloadInput) => Promise<FormResult>;
}) {
  const { form, status, serverError, onSubmit, formRef } = useActionForm(DownloadSchema, action, {
    leitfaden: slug,
    einwilligung: false as unknown as true,
  });
  const {
    control,
    register,
    formState: { errors },
  } = form;

  if (status === "sent") {
    return (
      <SentNotice title="Fast geschafft">
        Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link, den wir Ihnen gerade geschickt haben. Danach
        können Sie den Leitfaden herunterladen.
      </SentNotice>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label="Leitfaden anfordern"
      className="relative flex flex-col gap-5 rounded-xl border border-line bg-white p-6 shadow-sm"
    >
      <Honeypot />
      <Field label="Name" required error={errors.name?.message}>
        {(a11y) => <Input autoComplete="name" {...register("name")} {...a11y} />}
      </Field>
      <Field label="Geschäftliche E-Mail" required error={errors.email?.message}>
        {(a11y) => (
          <Input type="email" autoComplete="email" inputMode="email" {...register("email")} {...a11y} />
        )}
      </Field>
      <Field label="Unternehmen" optional error={errors.unternehmen?.message}>
        {(a11y) => <Input autoComplete="organization" {...register("unternehmen")} {...a11y} />}
      </Field>
      <ControlledCheckbox
        control={control}
        name="einwilligung"
        label={<ConsentLabel purpose="für den Versand des Leitfadens" />}
      />
      <ServerError message={serverError} />
      <Button type="submit" loading={status === "sending"} block>
        Leitfaden anfordern
      </Button>
    </form>
  );
}
