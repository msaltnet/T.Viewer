export default class Listener {
    constructor (ipcRenderer, sendChannel, receiveChannel) {
        this.count = 0;
        this.isStarted = false;
        this.ipcRenderer = ipcRenderer;
        this.sendChannel = sendChannel;
        this.receiveChannel = receiveChannel;
        this.LISTEN_TAG_PREFIX = "Listener-";
        this.listenerMap = new Map();
    }

    onReceive(event, arg) {
        this.listenerMap.forEach((listener) => {
            listener(arg);
        });
    }

    startListen() {
        if (this.isStarted)
            return;

        console.log(`[Listener] Start! ${this.sendChannel}, ${this.receiveChannel}`);
        this.ipcRenderer.send(this.sendChannel, this.receiveChannel)
        this.ipcRenderer.on(this.receiveChannel, this.onReceive.bind(this));
        this.isStarted = true;
    }

    stopListen() {
        if (!this.isStarted)
            return;

        console.log('[Listener] Stop!');
        this.ipcRenderer.send(this.sendChannel, null)
        this.ipcRenderer.removeListener(this.receiveChannel, this.onReceive.bind(this))
        this.isStarted = false;
    }

    registerListener(listener) {
        let listenerTag = this.LISTEN_TAG_PREFIX + this.count;
        this.count++;
        this.listenerMap.set(listenerTag, listener);
        this.startListen();
        console.log('[Listener] register: ' + listenerTag);
        return listenerTag;
    }

    unregisterListener(listenerTag) {
        console.log('[Listener] unregister: ' + listenerTag);
        this.listenerMap.delete(listenerTag);
        if (this.listenerMap.size <= 0)
            this.stopListen();
    }
}
