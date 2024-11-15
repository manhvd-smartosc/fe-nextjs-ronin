const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@sky-mavis/tanto-connect',
    '@sky-mavis/waypoint',
    '@sky-mavis/tanto-wagmi',
  ],
  reactStrictMode: false,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    config.plugins = config.plugins || [];

    config.optimization.providedExports = true;

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
    PINATA_JWT: process.env.PINATA_JWT,
    PINATA_API_URL: process.env.PINATA_API_URL,
    PINATA_GATEWAY_URL: process.env.PINATA_GATEWAY_URL,

    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_BUCKET_URL: process.env.AWS_BUCKET_URL,
    AWS_SQS_QUEUE_URL: process.env.AWS_SQS_QUEUE_URL,
  },
};
module.exports = nextConfig;
