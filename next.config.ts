import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/screens",
        destination: "/design-system/screens",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
