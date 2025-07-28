import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  rootDir: '.',
  modulePathIgnorePatterns: ['<rootDir>/.aws-sam'],
  coveragePathIgnorePatterns: ['/repositories/', '/functions/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testRegex: './test/.*\\.test\\.ts$',
  setupFiles: ['./test/common/expose-env.ts'],
  coverageReporters: [
    'clover',
    'json',
    'lcov',
    [
      'text',
      {
        skipFull: true,
      },
    ],
    [
      'cobertura',
      {
        outputDirectory: 'coverage',
        outputName: 'cobertura-coverage.xml',
      },
    ],
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
