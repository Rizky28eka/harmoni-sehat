module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/env.ts'],
  testTimeout: 60000,
  maxWorkers: 1,
};
