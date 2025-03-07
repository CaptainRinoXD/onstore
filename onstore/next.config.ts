import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "global.bonanzasatrangi.com",
      },
      {
        hostname: "bonanzasatrangi.com",
      },
      {
        hostname: "assets.adidas.com",
      },
    ],
  },
};

export default nextConfig;