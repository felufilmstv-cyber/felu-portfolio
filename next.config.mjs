/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: { optimizePackageImports: ['three', '@react-three/drei'] }
};
export default nextConfig;
