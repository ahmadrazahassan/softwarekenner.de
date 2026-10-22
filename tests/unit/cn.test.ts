import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("keeps a custom font size and a text color side by side", () => {
    expect(cn("text-small text-ink")).toBe("text-small text-ink");
  });

  it("lets later classes win within the same group", () => {
    expect(cn("text-ink", "text-brand-ink")).toBe("text-brand-ink");
    expect(cn("text-small", "text-lead")).toBe("text-lead");
    expect(cn("type-h1", "type-h2")).toBe("type-h2");
    expect(cn("shadow-sm", "shadow-md")).toBe("shadow-md");
    expect(cn("rounded-lg", "rounded-logo")).toBe("rounded-logo");
  });
});
