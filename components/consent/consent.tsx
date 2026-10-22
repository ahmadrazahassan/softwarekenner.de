"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

import { logConsent } from "@/app/actions/consent";
import { AppLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/form";
import { DialogContent } from "@/components/ui/overlay";
import {
  CONSENT_STORAGE_KEY,
  decide,
  isGranted,
  parseDecision,
  type ConsentDecision,
  type ConsentService,
} from "@/lib/consent";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

/* ---------- Store: localStorage, first party, only the decision itself ---------- */

const listeners = new Set<() => void>();
let cache: { raw: string | null; value: ConsentDecision | null } | null = null;

function readDecision(): ConsentDecision | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (!cache || cache.raw !== raw) cache = { raw, value: parseDecision(raw) };
  return cache.value;
}

function writeDecision(decision: ConsentDecision) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(decision));
  } catch {
    // Storage blocked: the decision holds for this page view.
    cache = { raw: JSON.stringify(decision), value: decision };
  }
  listeners.forEach((l) => l());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/* ---------- Context ---------- */

type ConsentState = {
  services: ConsentService[];
  decision: ConsentDecision | null;
  save: (choice: "alle" | "notwendige" | Record<string, boolean>) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
};

const ConsentContext = createContext<ConsentState | null>(null);

function useConsentState() {
  const state = useContext(ConsentContext);
  if (!state) throw new Error("ConsentProvider fehlt.");
  return state;
}

/** True once the visitor allowed this service. Embeds use it to stay off until then. */
export function useConsent(serviceId: string) {
  return isGranted(useConsentState().decision, serviceId);
}

/**
 * Consent layer (Section 19). Without services that need consent it renders only its children:
 * no banner, no storage access. `demo` keeps the decision in memory (styleguide).
 */
export function ConsentProvider({
  services,
  demo,
  children,
}: {
  services: ConsentService[];
  demo?: boolean;
  children: ReactNode;
}) {
  const stored = useSyncExternalStore(subscribe, readDecision, () => null);
  const [local, setLocal] = useState<ConsentDecision | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const decision = demo ? local : stored;

  const save = (choice: "alle" | "notwendige" | Record<string, boolean>) => {
    const next = decide(services, choice);
    setSettingsOpen(false);
    if (demo) {
      setLocal(next);
      return;
    }
    writeDecision(next);
    // Proof of consent without personal data (Art. 7 Abs. 1 DSGVO).
    void logConsent(next);
  };

  if (services.length === 0) return <>{children}</>;
  return (
    <ConsentContext value={{ services, decision, save, settingsOpen, setSettingsOpen }}>
      {children}
      <ConsentBanner inline={demo} />
      <DialogPrimitive.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent
          title="Einstellungen zur Einwilligung"
          description="Wählen Sie, welche Dienste wir laden dürfen. Nichts ist vorausgewählt."
        >
          <ConsentChoices />
        </DialogContent>
      </DialogPrimitive.Root>
    </ConsentContext>
  );
}

/** First layer: "Alle akzeptieren" and "Nur notwendige" equally prominent, plus "Einstellungen". */
function ConsentBanner({ inline }: { inline?: boolean }) {
  const { decision, save, setSettingsOpen, services } = useConsentState();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!hydrated || decision) return null;
  return (
    <section
      aria-labelledby="einwilligung-titel"
      className={cn(
        "z-50 border border-line bg-white p-5 shadow-lg sm:p-6",
        inline
          ? "relative rounded-xl"
          : "fixed inset-x-3 bottom-3 rounded-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md",
      )}
    >
      <h2 id="einwilligung-titel" className="type-h4 text-ink">
        Ihre Einwilligung
      </h2>
      <p className="mt-2 type-small text-text-muted">
        Wir möchten {services.map((s) => s.name).join(", ")} einsetzen. Diese Dienste laden wir nur mit Ihrer
        Einwilligung. Sie können sie jederzeit in den{" "}
        <AppLink href={routes.legal.cookies()} className="link-inline">
          Cookie-Einstellungen
        </AppLink>{" "}
        widerrufen.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button variant="ink" icon="none" size="sm" onClick={() => save("alle")}>
          Alle akzeptieren
        </Button>
        <Button variant="ink" icon="none" size="sm" onClick={() => save("notwendige")}>
          Nur notwendige
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="link-cta mt-3 min-h-11 text-small"
      >
        Einstellungen
      </button>
    </section>
  );
}

/** Per service switches. Used in the dialog and on /cookie-einstellungen. */
export function ConsentChoices() {
  const { services, decision, save } = useConsentState();
  const [choice, setChoice] = useState<Record<string, boolean>>(() => ({ ...(decision?.granted ?? {}) }));
  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col divide-y divide-line">
        {services.map((s) => (
          <li key={s.id} className="flex flex-col gap-1 py-3 first:pt-0">
            <Switch
              label={s.name}
              checked={choice[s.id] === true}
              onCheckedChange={(on) => setChoice((c) => ({ ...c, [s.id]: on }))}
            />
            <p className="type-small text-text-muted">
              {s.purpose} Anbieter: {s.provider}. Datenverarbeitung: {s.location}.
            </p>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button variant="ink" icon="none" size="sm" onClick={() => save(choice)}>
          Auswahl speichern
        </Button>
        <Button variant="outline" icon="none" size="sm" onClick={() => save("alle")}>
          Alle akzeptieren
        </Button>
        <Button variant="outline" icon="none" size="sm" onClick={() => save("notwendige")}>
          Nur notwendige
        </Button>
      </div>
      {decision && (
        <p className="type-small text-text-muted" aria-live="polite">
          Zuletzt gespeichert am {new Date(decision.decidedAt).toLocaleString("de-DE")}.
        </p>
      )}
    </div>
  );
}
