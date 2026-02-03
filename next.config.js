/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve app at /grant-opportunities path
  basePath: '/grant-opportunities',
  experimental: {
    serverComponentsExternalPackages: ['js-yaml', 'gray-matter', 'papaparse'],
  },
  // Allow reading files from parent directory
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
