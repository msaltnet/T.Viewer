module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'tviewer',
        asar: true,
        productName: 'T.Viewer',
        win: {
          target: [
            {
              target: 'nsis',
              arch: [
                'x64',
              ],
            },
          ],
          artifactName: 'tviewer-setup-${version}.${ext}',
          icon: 'assets/icons/icon.ico'
        },
        linux: {
          target: [
            {
              target: 'AppImage',
              arch: [
                'x64',
              ],
            },
          ],
          artifactName: 'tviewer-${version}.${ext}',
          icon: 'assets/icons/icon.png'
        },
      },
    },
  },
}
