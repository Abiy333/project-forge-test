import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // Elevate the threshold limit to allow up to 4MB payloads via form data
      bodySizeLimit: "4mb", 
    },
  },
};

export default nextConfig;
