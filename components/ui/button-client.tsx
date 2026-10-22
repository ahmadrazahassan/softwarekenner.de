"use client";

import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { cn } from "@/lib/utils/cn";

import { buttonClass, ButtonInner, type CommonButtonProps } from "./button-base";
import { Icon } from "./icon";

export type ButtonProps = CommonButtonProps & {
  loading?: boolean;
  disabled?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "disabled">;

/**
 * Button element. Disabled and loading use aria-disabled so the button stays focusable and
 * screen readers announce it; clicks are swallowed while inactive.
 */
export function Button({
  variant,
  size,
  block,
  icon = "arrow",
  loading,
  disabled,
  className,
  children,
  onClick,
  type = "button",
  ...props
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, block, icon, className })}
      aria-disabled={inactive || undefined}
      aria-busy={loading || undefined}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (inactive) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      <ButtonInner icon={icon} loading={loading}>
        {children}
      </ButtonInner>
    </button>
  );
}

/** Round icon button for carousel controls (Section 6.2 "icon-round"). Use from client components. */
export function IconButton({
  icon,
  label,
  className,
  disabled,
  onClick,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      className={cn("btn btn-icon-round", className)}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={(event) => (disabled ? event.preventDefault() : onClick?.(event))}
      {...props}
    >
      <Icon icon={icon} size={20} />
    </button>
  );
}
