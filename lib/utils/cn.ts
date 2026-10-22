import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom scales so `text-small` (size) and `text-ink` (color) do not
// cancel each other out, and the composite type-* utilities replace each other.
const twMerge = extendTailwindMerge<"type-style">({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["micro", "caption", "eyebrow", "small", "label", "body", "body-lg", "lead", "h3"] },
      ],
      shadow: [{ shadow: ["xs", "sm", "md", "lg"] }],
      rounded: [{ rounded: ["xs", "sm", "md", "lg", "xl", "logo", "full"] }],
      "type-style": [
        {
          type: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "score",
            "stat",
            "lead",
            "body-lg",
            "body",
            "small",
            "label",
            "button",
            "eyebrow",
            "micro",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
