import type { LucideIcon, LucideProps } from "lucide-react";

export type IconSize = 14 | 16 | 20 | 24 | 28;

type IconProps = Omit<LucideProps, "ref" | "size"> & {
  icon: LucideIcon;
  size?: IconSize;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
};

/**
 * Lucide icon with the house defaults (Section 5.7): stroke 1.75, currentColor, 20 px.
 * Icons never sit on a background shape; place them directly next to text.
 */
export function Icon({ icon: Glyph, size = 20, label, ...props }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.75}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      {...props}
    />
  );
}
