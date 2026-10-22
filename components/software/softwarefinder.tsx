"use client";

import { Check, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

export type FinderOption = { value: string; label: string; icon?: LucideIcon };
export type FinderStep = {
  id: string;
  question: string;
  hint?: string;
  multiple?: boolean;
  options: FinderOption[];
};
export type FinderAnswers = Record<string, string[]>;

/**
 * Softwarefinder shell (Section 7.4): three steps, selectable option cards, progress.
 * `resolveOptions` lets a later step depend on earlier answers (requirements per category).
 * The scoring lives in lib/finder; FinderBlock wires both together.
 */
export function Softwarefinder({
  steps,
  onComplete,
  resolveOptions,
  className,
}: {
  steps: FinderStep[];
  onComplete: (answers: FinderAnswers) => void;
  resolveOptions?: (step: FinderStep, answers: FinderAnswers) => FinderOption[];
  className?: string;
}) {
  const headingId = useId();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const step = steps[index]!;
  const options = resolveOptions ? resolveOptions(step, answers) : step.options;
  // Answers that no longer fit (another category was chosen) do not count.
  const selected = (answers[step.id] ?? []).filter((v) => options.some((o) => o.value === v));
  const last = index === steps.length - 1;

  const choose = (value: string) =>
    setAnswers((current) => {
      const list = current[step.id] ?? [];
      const next = step.multiple
        ? list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value]
        : [value];
      return { ...current, [step.id]: next };
    });

  return (
    <section
      aria-labelledby={headingId}
      className={cn("rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8", className)}
    >
      <div className="flex items-center gap-3">
        <p className="type-eyebrow text-text-muted">
          Schritt {index + 1} von {steps.length}
        </p>
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={cn("h-1.5 flex-1 rounded-full", i <= index ? "bg-brand-500" : "bg-line")}
            />
          ))}
        </div>
      </div>
      <h3 id={headingId} className="mt-5 type-h3 text-ink">
        {step.question}
      </h3>
      {step.hint && <p className="mt-1 type-small text-text-muted">{step.hint}</p>}

      <div
        role={step.multiple ? "group" : "radiogroup"}
        aria-labelledby={headingId}
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {options.map((option) => {
          const isOn = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role={step.multiple ? "checkbox" : "radio"}
              aria-checked={isOn}
              onClick={() => choose(option.value)}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                isOn ? "border-2 border-ink bg-surface-tint" : "border-line-strong hover:border-ink",
              )}
            >
              {option.icon && <Icon icon={option.icon} size={24} className="flex-none text-ink" />}
              <span className="flex-1 type-label text-ink">{option.label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 flex-none items-center justify-center border",
                  step.multiple ? "rounded-[5px]" : "rounded-full",
                  isOn ? "border-ink bg-ink text-white" : "border-line-strong",
                )}
              >
                {isOn && <Icon icon={Check} size={14} strokeWidth={2.5} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button variant="ghost" icon="none" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          Zurück
        </Button>
        <Button
          variant={last ? "primary" : "ink"}
          disabled={selected.length === 0}
          onClick={() => (last ? onComplete({ ...answers, [step.id]: selected }) : setIndex((i) => i + 1))}
        >
          {last ? "Passende Software anzeigen" : "Weiter"}
        </Button>
      </div>
    </section>
  );
}
