module.exports = {
    root: true,
    env: {
        node: true,
        jest: true
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'off', // Disable base rule, use @typescript-eslint/no-unused-vars instead
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-undef': 'off', // Handled by TypeScript
        '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Allow unused vars starting with _
        '@typescript-eslint/no-explicit-any': 'off', // Allow any for now, can be tightened later
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow implicit return types for now
        '@typescript-eslint/no-empty-interface': 'off', // Allow empty interfaces
        '@typescript-eslint/no-empty-object-type': 'off', // Allow empty object types
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                project: ['./tsconfig.eslint.json'],
            },
            rules: {
                // Specific rules for TypeScript files
                '@typescript-eslint/no-floating-promises': 'error',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
            },
        },
        {
            files: ['.eslintrc.js'], // Apply this override to these files
            parserOptions: {
                project: undefined, // Disable project for these files
            },
        },
    ],
    ignorePatterns: [
        'package.json',
        'package-lock.json',
        'coverage/**',
        'dist/**', // Ignore compiled output
        'src/public/**', // Ignore public assets
        'src/tests/**', // Ignore test files for linting, handled by Jest
        'jest.config.ts' // Re-add to ignore patterns
    ]
};
