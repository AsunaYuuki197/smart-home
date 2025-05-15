import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
};
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}
export default nextConfig;
