"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  Checkbox as CheckboxPrimitive,
  Select as SelectPrimitive,
  Slider as SliderPrimitive,
  Switch as SwitchPrimitive,
} from "radix-ui";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { GermanFlag } from "./german-flag";
import { Icon } from "./icon";

import { controlClass as control, type FieldA11y } from "./field";

export type SelectOption = { value: string; label: string };

/** Styled select on Radix Select. Pass the Field a11y props through `triggerProps`. */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Bitte auswählen",
  disabled,
  name,
  triggerProps,
  className,
}: {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  triggerProps?: Partial<FieldA11y> & { "aria-label"?: string };
  className?: string;
}) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        className={cn(
          control,
          "flex h-12 items-center justify-between gap-3 text-left data-placeholder:text-text-subtle",
          className,
        )}
        {...triggerProps}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <Icon icon={ChevronDown} size={20} className="text-text-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) animate-pop-in overflow-hidden rounded-md border border-line bg-white p-1.5 shadow-md"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex min-h-11 cursor-pointer items-center rounded-sm py-2 pr-3 pl-9 font-body text-body text-ink outline-none select-none data-highlighted:bg-surface-tint data-[state=checked]:font-semibold"
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2.5">
                  <Icon icon={Check} size={16} />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

/** Checkbox with its label as one 44 px target. Never pre ticked for consent. */
export function Checkbox({
  label,
  description,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { label: ReactNode; description?: ReactNode }) {
  const autoId = useId();
  const boxId = id ?? autoId;
  return (
    <div className={cn("flex min-h-11 items-start gap-3", className)}>
      <CheckboxPrimitive.Root
        id={boxId}
        className="peer mt-0.5 flex size-5 flex-none items-center justify-center rounded-[5px] border border-line-strong bg-white transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-negative data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-white"
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Icon icon={Check} size={14} strokeWidth={2.5} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={boxId}
        className="flex cursor-pointer flex-col gap-0.5 peer-disabled:cursor-not-allowed"
      >
        <span className="type-body leading-snug text-ink">{label}</span>
        {description && <span className="type-small text-text-muted">{description}</span>}
      </label>
    </div>
  );
}

export function Switch({
  label,
  flag,
  className,
  id,
  ...props
}: ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & { label: ReactNode; flag?: boolean }) {
  const autoId = useId();
  const switchId = id ?? autoId;
  return (
    <div className={cn("inline-flex min-h-11 items-center gap-3", className)}>
      <SwitchPrimitive.Root
        id={switchId}
        className="relative inline-flex h-6.5 w-11 flex-none items-center rounded-full border border-line-strong bg-line transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-ink data-[state=checked]:bg-ink"
        {...props}
      >
        <SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-(--ease-soft) data-[state=checked]:translate-x-5" />
      </SwitchPrimitive.Root>
      <label htmlFor={switchId} className="inline-flex cursor-pointer items-center gap-2 type-label text-ink">
        {flag && <GermanFlag className="h-3 w-5" />}
        {label}
      </label>
    </div>
  );
}

/** "Nur Anbieter aus Deutschland" toggle with flag (Section 7.4). */
export function LocalVendorToggle(
  props: Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "children">,
) {
  return <Switch label="Nur Anbieter aus Deutschland" flag {...props} />;
}

export function Slider({
  className,
  label,
  valueText,
  ...props
}: ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { label: string; valueText?: string }) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-11 w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-line">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={valueText}
        className="block size-6 rounded-full border-2 border-ink bg-white shadow-sm transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
    </SliderPrimitive.Root>
  );
}
