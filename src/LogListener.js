var instance;
export default class {
    constructor (ipcRenderer) {
        if (instance) return instance;

        this.count = 0;
        this.isStarted = false;
        this.ipcRenderer = ipcRenderer;
        this.LISTEN_REQUEST_CHANNEL = "register-listener";
        this.LISTEN_LOG_CHANNEL = "log-listen";
        this.LISTEN_TAG_PREFIX = "Listener-";
        this.textDecoder = new TextDecoder("utf-8");
        this.listenerMap = new Map();
        this._listener = (event, arg) => {
            let msg = this.textDecoder.decode(arg);
            this.listenerMap.forEach((listener) => {
                listener(msg);
            });
        };
        instance = this;
    }

    startListen() {
        if (this.isStarted)
            return;

        console.log('[LogListener] Start!');
        this.ipcRenderer.send(this.LISTEN_REQUEST_CHANNEL, this.LISTEN_LOG_CHANNEL)
        this.ipcRenderer.on(this.LISTEN_LOG_CHANNEL, this._listener);
        this.isStarted = true;
    }

    stopListen() {
        if (!this.isStarted)
            return;

        console.log('[LogListener] Stop!');
        this.ipcRenderer.send(this.LISTEN_REQUEST_CHANNEL, null)
        this.ipcRenderer.removeListener(this.LISTEN_LOG_CHANNEL, this._listener)
        this.isStarted = false;
    }

    registerListener(listener) {
        let listenerTag = this.LISTEN_TAG_PREFIX + this.count;
        this.count++;
        this.listenerMap.set(listenerTag, listener);
        this.startListen();
        console.log('[LogListener] register: ' + listenerTag);
        return listenerTag;
    }

    unregisterListener(listenerTag) {
        console.log('[LogListener] unregister: ' + listenerTag);
        this.listenerMap.delete(listenerTag);
        if (this.listenerMap.size <= 0)
            this.stopListen();
    }
}
