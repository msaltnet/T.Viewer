import { webContents } from 'electron';

export default class LogService {
    constructor (ipcMain, sdbManager) {
        this.ipcMain = ipcMain;
        this.LISTEN_REQUEST_CHANNEL = "register-listener";
        this.STATE_LISTEN_REQUEST_CHANNEL = "register-state-listener";
        this.POWER_EVENT_CHANNEL = "change-power";
        this.listenerMap = new Map();
        this.stateListenerMap = new Map();
        this.sdbManager = sdbManager;
    }

    init() {
        this.ipcMain.on(this.LISTEN_REQUEST_CHANNEL, this.onListenRegister.bind(this));
        this.ipcMain.on(this.STATE_LISTEN_REQUEST_CHANNEL, this.onStateListenRegister.bind(this));
        this.ipcMain.on(this.POWER_EVENT_CHANNEL, this.onPowerEvent.bind(this));
        this.sdbManager.registerListener(this.sendLogMessage.bind(this), this.onError.bind(this));
        this.sdbManager.registerStateListener(this.sendStateMessage.bind(this));
        this.sdbManager.startChecking();
    }

    onListenRegister(event, arg) {
        this.setListenerMap(event, arg, this.listenerMap);
    }

    onStateListenRegister(event, arg) {
        this.setListenerMap(event, arg, this.stateListenerMap);
    }

    setListenerMap(event, arg, map) {
        if (!event || !event.sender || event.sender.id == undefined)
            return;

        if (arg) {
            let listenerInfo = {
                id: event.sender.id,
                channel: arg,
            };
            map.set(event.sender.id, listenerInfo);
        } else {
            map.delete(event.sender.id);
        }
    }

    onError() {
        this.sendStateMessage('Error');
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

    sendMessage(data, map) {
        for (var value of map.values()) {
            let sender = webContents.fromId(value.id);
            if (!sender) {
                continue;
            }
            sender.send(value.channel, data);
        }
    }

    sendLogMessage(data) {
        this.sendMessage(data, this.listenerMap);
    }

    sendStateMessage(data) {
        console.log(data);
        this.sendMessage(data, this.stateListenerMap);
    }
}