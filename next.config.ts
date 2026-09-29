import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5005/api/:path*",
      },
      {
        source: "/backend/:path*",
        destination: "https://helpmate-api.kvtmedia.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;