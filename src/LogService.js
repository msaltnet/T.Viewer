import { webContents } from 'electron';

export default class LogService {
    constructor (ipcMain, sdbManager) {
        this.ipcMain = ipcMain;
        this.LISTEN_REQUEST_CHANNEL = "register-listener";
        this.POWER_EVENT_CHANNEL = "change-power";
        this.listenerMap = new Map();
        this.testTimer = 0;
        this.sdbManager = sdbManager;
    }

    init() {
        this.ipcMain.on(this.LISTEN_REQUEST_CHANNEL, this.onListenRegister.bind(this));
        this.ipcMain.on(this.POWER_EVENT_CHANNEL, this.onPowerEvent.bind(this));
    }

    onListenRegister(event, arg) {
        if (!event || !event.sender || event.sender.id == undefined)
            return;

        if (arg) {
            let listenerInfo = {
                id: event.sender.id,
                channel: arg,
            };
            this.listenerMap.set(event.sender.id, listenerInfo);
        } else {
            this.listenerMap.delete(event.sender.id);
        }
    }

    onPowerEvent(event, arg) {
        if (!arg) {
            this.setPower(false);
            return;
        }

        if (arg == 'clear')
            this.setPower(true, true, false);
        else if (arg == 'clear-time')
            this.setPower(true, true, true);
        else if (arg == 'start')
            this.setPower(true, false, false);
        else if (arg == 'start-time')
            this.setPower(true, false, true);
        else
            this.setPower(false);
    }

    setPower(on, afterClear, timestamp) {
        if (!this.sdbManager) {
            console.error('Invaild sdbManager');
            return;
        }

        // console.log('setPower :' + on);
        if (on)
            this.sdbManager.startDlog(afterClear, timestamp);
        else
            this.sdbManager.stopDlog();
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