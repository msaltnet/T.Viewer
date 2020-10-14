import { dialog } from 'electron'
import electron from 'electron'

const template = [
    {
        label: 'File',
        submenu: [
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'User Guide',
                click () { 
                    electron.shell.openExternal('https://github.com/msaltnet/T.Viewer/wiki/%EC%A3%BC%EC%9A%94-%EA%B8%B0%EB%8A%A5-%EB%B0%8F-%EC%82%AC%EC%9A%A9%EB%B2%95');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Source Code',
                click () { 
                    electron.shell.openExternal('https://github.com/msaltnet/T.Viewer');
                }
            },
            {
                label: 'OSS Notice',
                click () { 
                    dialog.showMessageBox({
                        type: "info",
                        title: "OSS Notice",
                        message: "Open Source Sorftware Notice",
                        detail: "\nOSS Notice | T.Viewer\nCopyright (c) 2019, msalt.net Jeong Seongmoon\n\nThis application use Open Source Software (OSS). You can find the source code of these open source project, along with applicable license information, below. We are deeply grateful to these developers for their work and contributions.\n\nAce Editor\n  - https://github.com/ajaxorg/ace\n  - Copyright (c) 2010, Ajax.org B.V.\n  - BSD License\n\nVue\n  - https://github.com/vuejs/vue\n  - Copyright (c) 2013-present, Yuxi (Evan) You\n  - MIT License\n\nVuetify\n  - https://github.com/vuetifyjs/vuetify\n  - Copyright (c) 2016-2020 John Jeremy Leider\n  - MIT License\n\ncore-js\n  - https://github.com/zloirock/core-js\n  - Copyright (c) 2014-2020 Denis Pushkarev\n  - MIT License\n\nelectron-store\n  - https://github.com/sindresorhus/electron-store\n  - Copyright (c) Sindre Sorhus\n  - MIT License\n\nelectron-window-state\n  - https://github.com/mawie81/electron-window-state\n  - Copyright (c) 2015 Jakub Szwacz, Marcel Wiehle\n  - MIT License"
                    });
                }
            },
            {
                label: 'About',
                click () { 
                    dialog.showMessageBox({
                        type: "info",
                        title: "T.Viewer",
                        message: "T.Viewer",
                        detail: "Version: 1.1.0\nDate: 2020. 10. 14"
                    });
                }
            }
        ]
    }
];

export default template;
