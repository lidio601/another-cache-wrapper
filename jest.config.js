module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules',
    '.d.ts'
  ],
  collectCoverage: true,
  coverageReporters: ['lcov']
}
