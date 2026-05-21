const PAID_ROUTE_PATTERN = /^\/(?:[a-z]{2}\/)?(?:(?:pricing|premium|refund-policy|billing|subscription-success|subscription-canceled)(?:\/|\.html)?|checkout(?:\/.*)?)$/i;

export const config = {
  matcher: [
    "/pricing",
    "/pricing.html",
    "/premium",
    "/premium.html",
    "/refund-policy",
    "/refund-policy.html",
    "/checkout/:path*",
    "/billing",
    "/subscription-success",
    "/subscription-canceled",
    "/:locale/pricing",
    "/:locale/pricing.html",
    "/:locale/premium",
    "/:locale/premium.html",
    "/:locale/refund-policy",
    "/:locale/refund-policy.html",
    "/:locale/checkout/:path*",
    "/:locale/billing",
    "/:locale/subscription-success",
    "/:locale/subscription-canceled"
  ]
};

export default function middleware(request) {
  if (process.env.NEXT_PUBLIC_ALL_FEATURES_FREE !== "true") {
    return;
  }

  const url = new URL(request.url);
  if (!PAID_ROUTE_PATTERN.test(url.pathname)) {
    return;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const first = segments[0] || "";
  const destinationPath = /^[a-z]{2}$/i.test(first) ? `/${first}/` : "/";
  return Response.redirect(new URL(destinationPath, request.url), 301);
}
