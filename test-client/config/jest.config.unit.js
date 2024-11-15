const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'Client unit tests',
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.env.setup.ts'], // load .env.test, .env.test.local, db...
  testMatch: [
    '<rootDir>/test-client/**/*.test.ts', // whitelist only
  ],
};
