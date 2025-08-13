import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      // Nextの /api/* → Spring Boot(8080) へ透過プロキシ
      { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' },
    ];
  },
};
