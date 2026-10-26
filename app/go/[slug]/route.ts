import { after, type NextRequest } from "next/server";

import { GO_HEADERS, isCountableClick, resolveGoTarget } from "@/lib/affiliate";
import { trackServerEvent, trackVercelEvent } from "@/lib/analytics";
import { getPartnerVendor, getSoftware } from "@/lib/content";

/**
 * Affiliate redirect (docs/BUILD_PROMPT.md Section 18): `/go/[slug]?from=…&pos=…`.
 * 307 to the affiliate URL with a sub id. Without an active deal the visitor lands on the profile,
 * unknown slugs on the A to Z list. A person's click (no bot, probe or prefetch) is counted
 * anonymously after the response is sent.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[slug]">) {
  const { slug } = await ctx.params;
  const target = resolveGoTarget(getSoftware(slug) ?? getPartnerVendor(slug), {
    from: request.nextUrl.searchParams.get("from"),
    pos: request.nextUrl.searchParams.get("pos"),
  });

  if (target.kind !== "affiliate") {
    return new Response(null, {
      status: 307,
      headers: { ...GO_HEADERS, Location: new URL(target.path, request.nextUrl.origin).toString() },
    });
  }

  if (isCountableClick(request.method, request.headers)) {
    const props = {
      produkt: slug,
      quelle: target.from ?? "direkt",
      ...(target.position ? { position: target.position } : {}),
    };
    after(() =>
      Promise.all([
        trackServerEvent("Affiliate-Klick", `${request.nextUrl.origin}/go/${slug}`, props),
        trackVercelEvent("Affiliate-Klick", props, request.headers),
      ]),
    );
  }
  return new Response(null, { status: 307, headers: { ...GO_HEADERS, Location: target.url } });
}
