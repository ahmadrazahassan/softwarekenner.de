"use server";

import { randomUUID } from "node:crypto";

import { CONSENT_VERSION, type ConsentDecision } from "@/lib/consent";

/**
 * Consent log (Section 19): a random id, the version, the choices and the time. No IP address,
 * no user agent, nothing that identifies a person. Written to the server log, which the hosting
 * provider keeps for the period named in the privacy policy.
 */
export async function logConsent(decision: ConsentDecision): Promise<void> {
  if (decision?.version !== CONSENT_VERSION || typeof decision.granted !== "object") return;
  const granted = Object.fromEntries(
    Object.entries(decision.granted).map(([k, v]) => [String(k).slice(0, 40), v === true]),
  );
  console.info(
    JSON.stringify({
      event: "einwilligung",
      vorgang: randomUUID(),
      version: decision.version,
      granted,
      zeit: new Date().toISOString(),
    }),
  );
}
