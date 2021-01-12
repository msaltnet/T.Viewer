module.exports = {
  collectCoverage: true,
  coverageDirectory: "./coverage/",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    "electron": "<rootDir>/tests/mock/electron.js",
    "ace-builds": "<rootDir>/tests/mock/ace-builds.js",
    "ElectronStoreWrapper": "<rootDir>/tests/mock/ElectronStoreWrapper.js",
    "mousetrap": "<rootDir>/tests/mock/mousetrap.js",
  },
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
}
