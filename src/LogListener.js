export default class {
    constructor (ipcRenderer) {
        this.ipcRenderer = ipcRenderer;
        this.LISTEN_REQUEST_CHANNEL = "register-listener";
        this.LISTEN_LOG_CHANNEL = "log-listen";
        // this.textDecoder = new TextDecoder("utf-8");
        this.listener;
        this._listener = (event, arg) => {
            console.log(arg[0]);
            // if (this.listener)
                // this.listener(this.textDecoder.decode(arg[0]));
        };
    }

    registerListener(listener) {
        this.listener = listener;
        this.ipcRenderer.send(this.LISTEN_REQUEST_CHANNEL, this.LISTEN_LOG_CHANNEL)
        this.ipcRenderer.on(this.LISTEN_LOG_CHANNEL, this._listener);
    }

    unregisterListener() {
        this.listener = undefined;
        this.ipcRenderer.send(this.LISTEN_REQUEST_CHANNEL, null)
        this.ipcRenderer.removeListener(this.LISTEN_REQUEST_CHANNEL, this._listener)
    }
}
