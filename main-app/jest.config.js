module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  
  // Add these lines for coverage
  collectCoverage: true, // Enable code coverage collection
  coverageDirectory: './coverage', // Directory to output coverage reports
  coverageReporters: ['lcov', 'json', 'text'], // Formats SonarCloud can read
};
