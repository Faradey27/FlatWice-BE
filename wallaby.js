module.exports = (wallaby) => ({
  files: [
    'src/**/*.json',
    'src/**/*.env',
    { pattern: '__test__/beforeTest.js', instrument: false },
    { pattern: 'src/**/*.spec.js', ignore: true },
    { pattern: '__test__/**/*.spec.js', ignore: true },
    'src/**/*.js*',
  ],

  filesWithNoCoverageCalculated: [],

  hints: {
    ignoreCoverage: /istanbul ignore next/,
  },

  tests: [
    { pattern: 'node_modules/*', ignore: true, instrument: false },
    'src/**/*.spec.js*',
    '__test__/**/*.spec.js*',
    'test/**/*.spec.js*',
  ],

  compilers: {
    '**/*.js': wallaby.compilers.babel(),
  },

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
