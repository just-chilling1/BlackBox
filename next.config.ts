import type { NextConfig } from "next";
import path from "path";
import { execFileSync } from "child_process";

try {
  execFileSync(process.execPath, [path.join(__dirname, "scripts", "copy-logos-now.mjs")], {
    stdio: "ignore",
  });
} catch {
  // Logo install is best-effort; SVG fallbacks are committed in public/.
}

const nextConfig: NextConfig = {
  serverExternalPackages: ["geoip-country"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "image.pollinations.ai" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
