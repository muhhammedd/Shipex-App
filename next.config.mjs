/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow all hosts for Replit proxy
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure we can handle the Replit proxy headers
  experimental: {
    // next 14.2 might need specific tweaks if any, but usually it works.
    // However, some versions of Next.js need explicit trust for certain headers.
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
