import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "helpmate-api.kvtmedia.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://helpmate-api.kvtmedia.com/api/:path*",
      },
      {
        source: "/backend/:path*",
        destination: "https://helpmate-api.kvtmedia.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;