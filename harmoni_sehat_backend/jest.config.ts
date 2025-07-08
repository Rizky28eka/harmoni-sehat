/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/src/tests/**/*.test.ts',
        '<rootDir>/src/tests/**/*.spec.ts'
    ],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/node_modules/**',
        '!src/coverage/**',
        '!src/scripts/**',
        '!src/tests/**',
    ],
    coverageThreshold: {
        'global': {
            'branches': 80,
            'functions': 80,
            'lines': 80,
            'statements': 80
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
