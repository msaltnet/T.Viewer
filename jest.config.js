module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    electron: "<rootDir>/tests/mock/electron.js"
  },
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
}
