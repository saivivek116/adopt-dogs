import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['frontend-take-home.fetch.com'], // Add the allowed domain here
  },
};

export default nextConfig;
