import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://effigy.im/a/**.png'),
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
