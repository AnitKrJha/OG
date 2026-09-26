import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG route reads fonts and the portrait from disk at runtime.
  outputFileTracingIncludes: {
    "/og": ["./src/assets/**/*"],
  },
};

export default nextConfig;
