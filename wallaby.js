module.exports = (wallaby) => ({
  files: [
    'src/**/*.json',
    'src/**/*.env',
    './.env.example',
    { pattern: 'tsconfig.json', instrument: false },
    { pattern: '__test__/beforeTest.ts', instrument: false },
    { pattern: 'src/**/*.spec.ts', ignore: true },
    { pattern: '__test__/**/*.spec.ts', ignore: true },
    'src/**/*.ts',
    '__test__/**/*.ts',
  ],

  filesWithNoCoverageCalculated: [],

  hints: {
    ignoreCoverage: /istanbul ignore next/,
  },

  tests: [
    { pattern: 'node_modules/*', ignore: true, instrument: false },
    'src/**/*.spec.ts',
    '__test__/**/*.spec.ts',
  ],

  setup: (target) => {
    const jestConfig = require('./package.json').jest;

    target.testFramework.configure(Object.assign({}, jestConfig));
  },

  env: {
    type: 'node',
  },

  workers: {
    initial: 1,
    regular: 1,
    recycle: true,
  },

  testFramework: 'jest',
});
