const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sky-mavis/tanto-connect', '@sky-mavis/waypoint'],
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
  },
};
module.exports = nextConfig;
