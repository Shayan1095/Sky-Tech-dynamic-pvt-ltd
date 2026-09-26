import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/* Content Security Policy without nonces, so every page stays statically
   generated (fast, cacheable). Everything — scripts, fonts, images — is served
   from this site; nothing loads from third parties. When the contact backend
   adds Cloudflare Turnstile, allow challenges.cloudflare.com in script-src
   and frame-src. Development needs 'unsafe-eval' and a websocket for reloads. */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // HTTPS only for two years. Add "includeSubDomains; preload" once every
  // subdomain of the confirmed domain is known to serve HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* Two ways this gets deployed, and only one of them wants "standalone".

     Where the host builds the project itself — Hostinger's Node.js Web App
     flow, or Vercel — the ordinary build is what runs, started with
     `next start`. Emitting a standalone bundle there would copy node_modules
     a second time for nothing, on machines where build time and disk are the
     scarce things.

     Where the build happens here and only the result is uploaded, standalone
     is the point: it produces .next/standalone/server.js carrying just the
     modules the server needs, so nothing has to be installed on the host.
     That build is asked for explicitly:

         BUILD_STANDALONE=1 npm run build
  */
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  poweredByHeader: false,
  // Serve AVIF where the browser supports it (noticeably smaller than WebP
  // for the service and About artwork), WebP otherwise.
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // The Services content links the video service as /services/video-editing,
  // but its own page (and content file) is /services/video-production.
  async redirects() {
    return [
      { source: "/services/video-editing", destination: "/services/video-production", permanent: true },
    ];
  },
};

export default nextConfig;
