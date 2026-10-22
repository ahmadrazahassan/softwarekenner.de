"use client";

import { ChevronDown, X } from "lucide-react";
import {
  Accordion as AccordionPrimitive,
  Dialog as DialogPrimitive,
  Popover as PopoverPrimitive,
  Tooltip as TooltipPrimitive,
} from "radix-ui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Icon } from "./icon";

/* ---------- Dialog and Sheet (Radix Dialog) ---------- */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const overlayClass = "fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in";

function CloseButton({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "btn btn-ghost size-11 rounded-full p-0 focus-visible:outline-2 focus-visible:outline-ink",
        className,
      )}
      aria-label="Schließen"
    >
      <Icon icon={X} size={20} />
    </DialogPrimitive.Close>
  );
}

export function DialogContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClass} />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-line bg-white p-6 shadow-lg data-[state=open]:animate-pop-in sm:p-8",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <DialogPrimitive.Title className="type-h3 text-ink">{title}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="type-body text-text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
            )}
          </div>
          <CloseButton className="-mt-2 -mr-2" />
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Side or bottom sheet: mobile navigation, "Alle Filter" (Section 7.4). */
export function SheetContent({
  title,
  side = "right",
  children,
  footer,
  className,
}: {
  title: string;
  side?: "right" | "bottom";
  children: ReactNode;
  /** Sticky footer, e.g. "{n} Ergebnisse anzeigen". */
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClass} />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-lg",
          side === "right" &&
            "inset-y-0 right-0 h-dvh w-full max-w-md data-[state=open]:animate-sheet-in sm:rounded-l-xl",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-xl data-[state=open]:animate-sheet-in-bottom",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <DialogPrimitive.Title className="type-h4 text-ink">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
          <CloseButton className="-mr-2" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-line bg-white px-5 py-4">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/* ---------- Popover ---------- */

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  align = "start",
  ...props
}: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          "z-50 w-72 max-w-[calc(100vw-2rem)] animate-pop-in rounded-md border border-line bg-white p-4 shadow-md outline-none",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/* ---------- Tooltip ---------- */

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            collisionPadding={16}
            className="z-50 max-w-64 animate-pop-in rounded-md bg-ink px-3 py-2 font-body text-small leading-snug text-white shadow-md"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-ink" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* ---------- Accordion ---------- */

export function Accordion({
  items,
  type = "single",
  className,
}: {
  items: { id: string; title: ReactNode; content: ReactNode }[];
  type?: "single" | "multiple";
  className?: string;
}) {
  const rootClass = cn("divide-y divide-line rounded-lg border border-line bg-white", className);
  const content = items.map((item) => (
    <AccordionPrimitive.Item key={item.id} value={item.id}>
      <AccordionPrimitive.Header asChild>
        <h3>
          <AccordionPrimitive.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-body-lg font-semibold text-ink transition-colors hover:bg-surface-tint focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink">
            {item.title}
            <Icon
              icon={ChevronDown}
              size={20}
              className="flex-none text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </AccordionPrimitive.Trigger>
        </h3>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="measure px-5 pb-5 type-body text-text-muted">{item.content}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  ));
  return type === "single" ? (
    <AccordionPrimitive.Root type="single" collapsible className={rootClass}>
      {content}
    </AccordionPrimitive.Root>
  ) : (
    <AccordionPrimitive.Root type="multiple" className={rootClass}>
      {content}
    </AccordionPrimitive.Root>
  );
}
