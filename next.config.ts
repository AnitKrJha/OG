import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG route reads its fonts from disk at runtime.
  outputFileTracingIncludes: {
    "/og": ["./src/assets/**/*"],
  },
};

export default nextConfig;
