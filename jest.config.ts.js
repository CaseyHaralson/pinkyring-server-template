/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  //modulePathIgnorePatterns: ['/bin/'], // this was causing the tests to run before the ts rebuild finished, so need something better here
};
