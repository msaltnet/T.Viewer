import { webContents } from 'electron';

export default class {
    constructor (ipcMain) {
        this.ipcMain = ipcMain;
        this.LISTEN_REQUEST_CHANNEL = "register-listener";
        this.listenerMap = new Map();
        this.testTimer = 0;
    }

    init() {
        this.ipcMain.on(this.LISTEN_REQUEST_CHANNEL, this.onListenRegister.bind(this));
    }

    startTestMessage() {
        setInterval(this.sendTestMessage.bind(this), 1000);
    }

    onListenRegister(event, arg) {
        if (!event || !event.sender || event.sender.id == undefined)
            return;

        if (arg) {
            let listenerInfo = {
                id: event.sender.id,
                channel: arg,
            };
            console.log('Set :' + event.sender.id);
            this.listenerMap.set(event.sender.id, listenerInfo);
        } else {
            console.log('Delete :' + event.sender.id);
            this.listenerMap.delete(event.sender.id);
        }
    }

    sendTestMessage() {
        for (var value of this.listenerMap.values()) {
            let response = Date() + ' : TEST Message' + this.listenerMap.size;
            let sender = webContents.fromId(value.id);
            if (!sender) {
                continue;
            }
            sender.send(value.channel, response);
        }
    }

    sendLogMessage(data) {
        for (var value of this.listenerMap.values()) {
            let sender = webContents.fromId(value.id);
            if (!sender) {
                continue;
            }
            sender.send(value.channel, data);
        }
    }
}