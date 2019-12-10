module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    electron: "<rootDir>/tests/mock/electron.js"
  },
  // setupFiles: ['./tests/setupEnv.js'],
}
