"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useId, useRef, useState, type BaseSyntheticEvent, type ReactNode } from "react";
import {
  Controller,
  useForm,
  type Control,
  type DefaultValues,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import type { z } from "zod";

import { AppLink } from "@/components/ui/app-link";
import { Notice } from "@/components/ui/feedback";
import { Field } from "@/components/ui/field";
import { Checkbox, Select, type SelectOption } from "@/components/ui/form";
import type { FormResult } from "@/lib/forms/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

/**
 * Shared form plumbing (Section 7.5): React Hook Form with the Zod schema from lib/forms/schemas,
 * the same schema the server action checks again. Success shows only when the server says ok.
 */
export function useActionForm<S extends z.ZodType<FieldValues, FieldValues>>(
  schema: S,
  action: (data: z.input<S>) => Promise<FormResult>,
  defaultValues: DefaultValues<z.input<S>>,
) {
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema as never),
    defaultValues,
    mode: "onTouched",
    shouldFocusError: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);

  /** Moves focus to the first invalid control once the errors are rendered. */
  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const invalid = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      // A fieldset (star rating) is not focusable; its first control is.
      const target = invalid?.matches("fieldset") ? invalid.querySelector<HTMLElement>("input") : invalid;
      target?.focus();
    });

  const submit = async (values: z.output<S>) => {
    setStatus("sending");
    setServerError(undefined);
    const honeypot = formRef.current?.querySelector<HTMLInputElement>("input[name='firma_website']")?.value;
    const result = await action({ ...(values as object), firma_website: honeypot ?? "" } as z.input<S>);
    if (result.ok) setStatus("sent");
    else {
      setStatus("idle");
      setServerError(result.message);
    }
  };
  // handleSubmit runs at event time, so the ref is read in the handler, never during render.
  const onSubmit = (event?: BaseSyntheticEvent) => form.handleSubmit(submit, focusFirstError)(event);

  return { form, status, serverError, onSubmit, formRef, focusFirstError };
}

/** First error message of a nested field path, e.g. "bewertungen.overall". */
export function errorOf<T extends FieldValues>(errors: FieldErrors<T>, path: string): string | undefined {
  const node = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], errors);
  return (node as { message?: string } | undefined)?.message;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  required,
  optional,
  hint,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  optional?: boolean;
  hint?: ReactNode;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          label={label}
          required={required}
          optional={optional}
          hint={hint}
          error={fieldState.error?.message}
        >
          {(a11y) => (
            <Select
              options={options}
              value={(field.value as string | undefined) ?? undefined}
              onValueChange={(v) => {
                field.onChange(v);
                field.onBlur();
              }}
              triggerProps={a11y}
            />
          )}
        </Field>
      )}
    />
  );
}

/** Checkbox bound to a boolean field, with its error linked and announced. */
export function ControlledCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  description?: ReactNode;
}) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <Checkbox
            checked={field.value === true}
            onCheckedChange={(v) => field.onChange(v === true)}
            onBlur={field.onBlur}
            aria-invalid={fieldState.error ? true : undefined}
            aria-describedby={fieldState.error ? `${id}-error` : undefined}
            label={label}
            description={description}
          />
          <p
            id={`${id}-error`}
            aria-live="polite"
            className={cn("type-small text-negative", !fieldState.error && "sr-only")}
          >
            {fieldState.error?.message}
          </p>
        </div>
      )}
    />
  );
}

/** Consent text with the privacy link and the purpose (Section 19). */
export function ConsentLabel({ purpose }: { purpose: string }) {
  return (
    <>
      Ich bin einverstanden, dass meine Angaben {purpose} verwendet werden. Details in der{" "}
      <AppLink href={routes.legal.privacy()} className="link-inline">
        Datenschutzerklärung
      </AppLink>
      .
    </>
  );
}

export function ServerError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Notice tone="negative" icon={CircleAlert}>
      {message}
    </Notice>
  );
}

export function SentNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status">
      <Notice tone="positive" icon={CircleCheck} title={title}>
        {children}
      </Notice>
    </div>
  );
}

/** "Schritt 2 von 3" with a progress bar, as in the Softwarefinder. */
export function StepProgress({ index, steps }: { index: number; steps: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="type-eyebrow text-text-muted" aria-live="polite">
        Schritt {index + 1} von {steps.length}: {steps[index]}
      </p>
      <div className="flex gap-1.5" aria-hidden="true">
        {steps.map((s, i) => (
          <span
            key={s}
            className={cn("h-1.5 flex-1 rounded-full", i <= index ? "bg-brand-500" : "bg-line")}
          />
        ))}
      </div>
    </div>
  );
}
