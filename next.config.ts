import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
};

export default nextConfig;
