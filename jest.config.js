module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    electron: "<rootDir>/tests/mock/electron.js",
    "ace-builds": "<rootDir>/tests/mock/ace-builds.js",
    "ElectronStoreWrapper": "<rootDir>/tests/mock/ElectronStoreWrapper.js",
  },
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
}
