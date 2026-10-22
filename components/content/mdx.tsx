import { MDXContent } from "@content-collections/mdx/react";
import { Info, ListChecks } from "lucide-react";
import type { ReactNode } from "react";

import { Notice } from "@/components/ui/feedback";

import { Kennzahl, Kennzahlen, Kostenvergleich, Preisvergleich, Tabelle } from "./mdx-data";
import { cn } from "@/lib/utils/cn";

/**
 * MDX components for editors (Section 10): notes, Kurzfazit, Praxisnotiz, sourced key figures and
 * charts built from our own profile data (Preisvergleich, Kostenvergleich).
 */
const components = {
  Kennzahlen,
  Kennzahl,
  Preisvergleich,
  Kostenvergleich,
  Tabelle,
  Hinweis: ({ children, titel }: { children: ReactNode; titel?: string }) => (
    <Notice tone="info" icon={Info} title={titel} className="not-prose my-6">
      {children}
    </Notice>
  ),
  Kurzfazit: ({ children }: { children: ReactNode }) => (
    <aside className="not-prose my-8 rounded-lg bg-brand-50 p-6">
      <p className="type-eyebrow text-brand-ink">Kurzfazit</p>
      <div className="mt-2 type-body-lg text-ink">{children}</div>
    </aside>
  ),
  /** Hands on observation. status="ausstehend" renders nothing in production (Section 10). */
  Praxisnotiz: ({ children, status }: { children: ReactNode; status?: "ausstehend" | "erledigt" }) =>
    status === "ausstehend" && process.env.CONTENT_PREVIEW !== "1" ? null : (
      <Notice
        tone={status === "ausstehend" ? "negative" : "positive"}
        icon={ListChecks}
        title={status === "ausstehend" ? "Praxisnotiz ausstehend" : "Aus der Praxis"}
        className="not-prose my-6"
      >
        {children}
      </Notice>
    ),
};

/** Long form body with the brand prose styles (Section 9). */
export function Mdx({ code, className }: { code: string; className?: string }) {
  return (
    <div className={cn("prose-brand", className)}>
      <MDXContent code={code} components={components} />
    </div>
  );
}
