import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Icon } from "./icon";
import { Spinner } from "./spinner";

/** Button variants (Section 6). One primary CTA per viewport section. */
export const buttonVariants = cva("btn", {
  variants: {
    variant: {
      primary: "btn-primary",
      ink: "btn-ink",
      outline: "btn-outline",
      ghost: "btn-ghost",
      onDark: "btn-on-dark",
    },
    size: { sm: "btn-sm", md: "", lg: "btn-lg" },
    block: { true: "btn-block", false: "" },
  },
  defaultVariants: { variant: "primary", size: "md", block: false },
});

/** Trailing icon. "arrow" and "external" slide through on hover. Strings keep props serializable. */
export type ButtonIcon = "arrow" | "external" | "download" | "none";

export type CommonButtonProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  icon?: ButtonIcon;
  className?: string;
};

export function buttonClass({
  variant,
  size,
  block,
  icon,
  className,
}: Pick<CommonButtonProps, "variant" | "size" | "block" | "icon" | "className">) {
  return cn(buttonVariants({ variant, size, block }), icon === "none" && "btn-no-icon", className);
}

export function ButtonInner({
  children,
  icon = "arrow",
  loading,
}: {
  children: ReactNode;
  icon?: ButtonIcon;
  loading?: boolean;
}) {
  let trailing: ReactNode = null;
  if (loading) {
    trailing = <Spinner size={16} />;
  } else if (icon === "arrow" || icon === "external") {
    const Glyph = icon === "arrow" ? ArrowRight : ArrowUpRight;
    trailing = (
      <span className={cn("btn-arrow", icon === "external" && "btn-arrow-diagonal")} aria-hidden="true">
        <Glyph size={18} strokeWidth={1.75} />
        <Glyph size={18} strokeWidth={1.75} />
      </span>
    );
  } else if (icon === "download") {
    trailing = <Icon icon={Download} size={20} />;
  }
  return (
    <>
      <span>{children}</span>
      {trailing}
    </>
  );
}
