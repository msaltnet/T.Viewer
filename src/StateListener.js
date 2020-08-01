import Listener from './Listener'

var instance;
const STATE_LISTEN_REQUEST_CHANNEL = "register-state-listener";
const LISTEN_STATE_CHANNEL = "state-listen";

export default class StateListener extends Listener{
    constructor (ipcRenderer) {
        if (instance) return instance;
        super(ipcRenderer, STATE_LISTEN_REQUEST_CHANNEL, LISTEN_STATE_CHANNEL);
        instance = this;
    }
}
