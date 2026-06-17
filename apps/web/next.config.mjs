/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
};

export default nextConfig;
