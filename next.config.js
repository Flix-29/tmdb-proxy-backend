/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['pino', 'pino-pretty'],
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;