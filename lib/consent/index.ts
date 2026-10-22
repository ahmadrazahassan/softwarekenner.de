/**
 * Consent (docs/BUILD_PROMPT.md Section 19, § 25 TDDDG and DSGVO). Pure and client safe.
 *
 * Today no service needs consent: fonts are self hosted, analytics is cookieless, forms send nothing to
 * third parties before submit. So `CONSENT_SERVICES` is empty and no banner appears. A service that
 * needs consent (video, maps, marketing pixels) is added here first; the banner then shows by itself.
 */

export type ConsentService = {
  id: string;
  name: string;
  /** What it is used for, one sentence in German. */
  purpose: string;
  provider: string;
  /** Where its data goes, e.g. "USA (Datenschutzrahmen EU-USA)". */
  location: string;
};

export const CONSENT_SERVICES: ConsentService[] = [];

/** Raise when the list of services or their purposes change; old decisions are asked again. */
export const CONSENT_VERSION = 1;

export type ConsentDecision = {
  version: number;
  /** Service id to granted. Missing means not granted. */
  granted: Record<string, boolean>;
  decidedAt: string;
};

export const consentRequired = (services: ConsentService[] = CONSENT_SERVICES) => services.length > 0;

export function decide(
  services: ConsentService[],
  choice: "alle" | "notwendige" | Record<string, boolean>,
  now = new Date(),
): ConsentDecision {
  const granted = Object.fromEntries(
    services.map((s) => [
      s.id,
      choice === "alle" ? true : choice === "notwendige" ? false : choice[s.id] === true,
    ]),
  );
  return { version: CONSENT_VERSION, granted, decidedAt: now.toISOString() };
}

/** A stored decision counts only if it is valid and of the current version. */
export function parseDecision(raw: string | null): ConsentDecision | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as ConsentDecision;
    if (value?.version !== CONSENT_VERSION || typeof value.granted !== "object" || !value.granted)
      return null;
    if (typeof value.decidedAt !== "string") return null;
    return value;
  } catch {
    return null;
  }
}

export const isGranted = (decision: ConsentDecision | null, serviceId: string) =>
  decision?.granted[serviceId] === true;

export const CONSENT_STORAGE_KEY = "einwilligungen";
