import Listener from './Listener'

var instance;
const LISTEN_REQUEST_CHANNEL = "register-listener";
const LISTEN_LOG_CHANNEL = "log-listen";

export default class LogListener extends Listener{
    constructor (ipcRenderer) {
        if (instance) return instance;
        super(ipcRenderer, LISTEN_REQUEST_CHANNEL, LISTEN_LOG_CHANNEL);
        this.textDecoder = new TextDecoder("utf-8");
        instance = this;
    }

    onReceive(event, arg) {
        let msg = this.textDecoder.decode(arg);
        this.listenerMap.forEach((listener) => {
            listener(msg);
        });
    }
}
