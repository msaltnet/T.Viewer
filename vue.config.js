module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 't.viewer',
        asar: false,
        productName: 'T.Veiwer',
        win: {
          target: [
            {
              target: 'portable',
              arch: [
                'x64',
              ],
            },
          ],
        },
      },
    },
  },
}
