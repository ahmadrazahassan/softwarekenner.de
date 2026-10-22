/**
 * Cookieless, EU hosted analytics (docs/BUILD_PROMPT.md Section 19): Plausible or self hosted Umami.
 * Off until `siteConfig.features.analytics` names a provider. No cookies, no personal data:
 * server events send neither the visitor's IP address nor the user agent.
 */
import { siteConfig } from "@/site.config";

export type AnalyticsConfig = {
  provider: "plausible" | "umami" | null;
  /** Base URL of the instance, e.g. "https://plausible.io" or the self hosted Umami origin. */
  endpoint: string | null;
  /** Plausible: the site domain. Umami: the website id. */
  siteId: string | null;
};

export const analyticsConfig = (): AnalyticsConfig => siteConfig.features.analytics;

export const analyticsEnabled = (config = analyticsConfig()) =>
  Boolean(config.provider && config.endpoint && config.siteId);

/** Script tag attributes for the page, or null while analytics is off. */
export function analyticsScript(config = analyticsConfig()) {
  if (!analyticsEnabled(config)) return null;
  const base = config.endpoint!.replace(/\/$/, "");
  return config.provider === "plausible"
    ? { src: `${base}/js/script.js`, "data-domain": config.siteId! }
    : { src: `${base}/script.js`, "data-website-id": config.siteId! };
}

/** Request for an anonymous server side event, or null while analytics is off. Pure for tests. */
export function serverEventRequest(
  name: string,
  pageUrl: string,
  props: Record<string, string | number>,
  config = analyticsConfig(),
): { url: string; init: RequestInit } | null {
  if (!analyticsEnabled(config)) return null;
  const base = config.endpoint!.replace(/\/$/, "");
  const body =
    config.provider === "plausible"
      ? { name, url: pageUrl, domain: config.siteId, props }
      : { type: "event", payload: { website: config.siteId, url: pageUrl, name, data: props } };
  return {
    url: config.provider === "plausible" ? `${base}/api/event` : `${base}/api/send`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": `${siteConfig.brand.name}-Server` },
      body: JSON.stringify(body),
    },
  };
}

/** Fire and forget. A failing analytics call never breaks the request that triggered it. */
export async function trackServerEvent(
  name: string,
  pageUrl: string,
  props: Record<string, string | number>,
) {
  const request = serverEventRequest(name, pageUrl, props);
  if (!request) return;
  try {
    await fetch(request.url, { ...request.init, signal: AbortSignal.timeout(1500) });
  } catch {
    // Analytics is optional; the redirect must not wait for or fail on it.
  }
}
