import { CircleAlert } from "lucide-react";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Icon } from "./icon";

// Server safe form parts: Field takes a render function, which cannot cross into a client module.
// Client controls (Select, Checkbox, Switch, Slider) live in ./form.

export const controlClass =
  "w-full rounded-sm border border-line-strong bg-white px-4 font-body text-body text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-text-subtle hover:border-ink/50 focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink aria-invalid:border-negative aria-invalid:hover:border-negative disabled:cursor-not-allowed disabled:bg-surface-tint disabled:text-text-subtle";

export function Label({ className, ...props }: ComponentPropsWithoutRef<"label">) {
  return <label className={cn("type-label text-ink", className)} {...props} />;
}

export type FieldA11y = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

/**
 * Label, control, hint and error as one unit (Section 7.5). Labels are always visible.
 * The error is linked through aria-describedby and announced politely.
 */
export function Field({
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Shows "(optional)" after the label. */
  optional?: boolean;
  className?: string;
  children: (a11y: FieldA11y) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-text-muted"> (optional)</span>}
      </Label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        "aria-required": required ? true : undefined,
      })}
      {hint && (
        <p id={hintId} className="type-small text-text-muted">
          {hint}
        </p>
      )}
      <p
        id={errorId}
        aria-live="polite"
        className={cn("flex items-start gap-1.5 type-small text-negative", !error && "sr-only")}
      >
        {error && (
          <>
            <Icon icon={CircleAlert} size={16} className="mt-0.5 flex-none" />
            {error}
          </>
        )}
      </p>
    </div>
  );
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(controlClass, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea className={cn(controlClass, "min-h-32 resize-y py-3 leading-relaxed", className)} {...props} />
  );
}

/** Honeypot field: hidden from people and assistive tech, bots fill it (Section 7.5). */
export function Honeypot({ name = "firma_website" }: { name?: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Bitte leer lassen
        <input type="text" name={name} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
