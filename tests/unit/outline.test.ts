import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { headingId, outlineOf, readingMinutes, textOf } from "@/lib/content/outline";

describe("outline helpers", () => {
  it("compute reading time at 200 words per minute, at least one minute", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes(Array(1000).fill("Wort").join(" "))).toBe(5);
  });

  it("list second level headings with transliterated ids and skip code fences", () => {
    const source = [
      "Einleitung",
      "## Was die GoBD sind",
      "### Unterpunkt",
      "```",
      "## kein Titel",
      "```",
      "## Fristen für **Belege** und [Bücher](/ratgeber/x)",
    ].join("\n");
    expect(outlineOf(source)).toEqual([
      { id: "was-die-gobd-sind", label: "Was die GoBD sind" },
      { id: "fristen-fuer-belege-und-buecher", label: "Fristen für Belege und Bücher" },
    ]);
  });

  it("derive the same id from rendered children as from the source", () => {
    const children = ["Fristen für ", createElement("strong", null, "Belege"), " und Bücher"];
    expect(headingId(textOf(children))).toBe(outlineOf("## Fristen für **Belege** und Bücher")[0]!.id);
  });
});
