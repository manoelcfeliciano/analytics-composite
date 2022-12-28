/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./jest.config.js');
config.testMatch = ['**/*.spec.ts'];

module.exports = config;
