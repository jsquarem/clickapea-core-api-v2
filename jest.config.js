module.exports = {
    collectCoverageFrom: ['./**/*.js', '!**/node_modules/**' ],
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    reporters: ['default', 'jest-junit'],
    testMatch: ['**/*.test.js', '**/*.spec.js'],
    coveragePathIgnorePatterns: [
      'src/tests/*',
      'coverage/*',
      './.eslintrc.js',
      './jest.config.js',
      'node_modules/*'
    ],
    coverageThreshold: {
      global: {
        branches: 0,
        functions: 1,
        lines: 1,
        statements: 1,
      },
    },
  };
