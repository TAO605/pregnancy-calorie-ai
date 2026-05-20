import type { NextConfig } from "next";

const enableHsts = process.env.ENABLE_HSTS === "true";
const allFeaturesFree = process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  ...(enableHsts
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async redirects() {
    if (!allFeaturesFree) return [];

    return [
      {
        source: "/pricing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/premium",
        destination: "/",
        permanent: true,
      },
      {
        source: "/refund-policy",
        destination: "/",
        permanent: true,
      },
      {
        source: "/checkout/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/billing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/subscription-success",
        destination: "/",
        permanent: true,
      },
      {
        source: "/subscription-canceled",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:locale/pricing",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/premium",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/refund-policy",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/checkout/:path*",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/billing",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/subscription-success",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/subscription-canceled",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
