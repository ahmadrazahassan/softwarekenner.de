import { ChevronRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

import { AppLink } from "./app-link";
import { buttonClass, ButtonInner, type CommonButtonProps } from "./button-base";
import { Icon } from "./icon";

// Interactive buttons live in a client module; links stay server rendered.
export { Button, IconButton, type ButtonProps } from "./button-client";
export { buttonVariants, type ButtonIcon } from "./button-base";

export type ButtonLinkProps = CommonButtonProps &
  Omit<ComponentPropsWithoutRef<typeof AppLink>, "children"> & { href: string };

/** A link that looks like a button (navigation, not an action). */
export function ButtonLink({
  variant,
  size,
  block,
  icon = "arrow",
  className,
  children,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <AppLink href={href} className={buttonClass({ variant, size, block, icon, className })} {...props}>
      <ButtonInner icon={icon}>{children}</ButtonInner>
    </AppLink>
  );
}

/** Text link CTA with growing underline and chevron (Section 6.2 "link"). */
export function TextLink({ href, children, className, ...props }: ComponentPropsWithoutRef<typeof AppLink>) {
  return (
    <AppLink href={href} className={cn("link-cta", className)} {...props}>
      <span>{children}</span>
      <Icon icon={ChevronRight} size={16} />
    </AppLink>
  );
}
