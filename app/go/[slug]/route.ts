import { after, type NextRequest } from "next/server";

import { GO_HEADERS, resolveGoTarget } from "@/lib/affiliate";
import { trackServerEvent } from "@/lib/analytics";
import { getSoftware } from "@/lib/content";

/**
 * Affiliate redirect (docs/BUILD_PROMPT.md Section 18): `/go/[slug]?from=…&pos=…`.
 * 307 to the affiliate URL with a sub id. Without an active deal the visitor lands on the profile,
 * unknown slugs on the A to Z list. The click is counted anonymously after the response is sent.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[slug]">) {
  const { slug } = await ctx.params;
  const target = resolveGoTarget(getSoftware(slug), {
    from: request.nextUrl.searchParams.get("from"),
    pos: request.nextUrl.searchParams.get("pos"),
  });

  if (target.kind !== "affiliate") {
    return new Response(null, {
      status: 307,
      headers: { ...GO_HEADERS, Location: new URL(target.path, request.nextUrl.origin).toString() },
    });
  }

  after(() =>
    trackServerEvent("Affiliate-Klick", `${request.nextUrl.origin}/go/${slug}`, {
      produkt: slug,
      quelle: target.from ?? "direkt",
      ...(target.position ? { position: target.position } : {}),
    }),
  );
  return new Response(null, { status: 307, headers: { ...GO_HEADERS, Location: target.url } });
}
