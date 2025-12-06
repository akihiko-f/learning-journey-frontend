import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client'],
  turbopack: {},
};

export default nextConfig;
