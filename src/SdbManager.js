export default class SdbManager {
    constructor(spawn) {
        this.isRunning = false;
        this.const = {
            MAIN_COMMAND : 'sdb',
            SDB_DEVICES: ['devices'],
            SDB_DLOG_START: ['shell', 'dlogutil'],
            SDB_DLOG_START_WITH_TIMESTAMP: ['shell', 'dlogutil -v time'],
            SDB_DLOG_CLEAR_START: ['shell', 'dlogutil -c && dlogutil'],
            SDB_DLOG_CLEAR_START_WITH_TIMESTAMP: ['shell', 'dlogutil -c && dlogutil -v time'],
            DATA_EVENT: 'data',
            CLOSE_EVENT: 'close',
            ERROR_EVENT: 'error',
            STATE_NONE: 'none',
            STATE_MULTI_CONNECTED: 'multi-connected',
            STATE_CONNECTED: 'connected',
            STATE_ERROR: 'error',
        };
        this.state = this.const.STATE_NONE;
        this.spawnOption = {
            env: process.env
        };
        this.stateListener;
        this._stateListener = (data) => {
            if (this.stateListener)
                this.stateListener(data);
        };
        this.logListener;
        this._logListener = (data) => {
            if (this.logListener)
                this.logListener(data);
        };
        this.errorCallback;
        this._errorCallback = (data) => {
            if (this.errorCallback)
                this.errorCallback(data);
        };
        this.terminatedCallback;
        this._terminatedCallback = (code) => {
            if (this.terminatedCallback)
                this.terminatedCallback(code);
        };
        this.sdb;
        this.checkingProcess;
        this.spawn = spawn;
        this.isCheckingDevice = false;
    }

    startChecking() {
        setInterval(this.checkDevice.bind(this), 1500);
    }

    checkDevice() {
        if (this.isCheckingDevice || this.isRunning)
            return;

        this.isCheckingDevice = true;
        this.checkingProcess = this.spawn(this.const.MAIN_COMMAND, this.const.SDB_DEVICES, this.spawnOption);

        this.checkingProcess.stdout.on(this.const.DATA_EVENT, this.onCheckingResponse.bind(this));
        this.checkingProcess.on(this.const.ERROR_EVENT, this.onCheckingError.bind(this));
        this.checkingProcess.on(this.const.CLOSE_EVENT, this.onCheckingTerminated.bind(this));
    }

    onCheckingResponse(data) {
        let response = data.toString().split('\n');
        let message;
        if (response.length <= 2) {
            message = this.state = this.const.STATE_NONE;
        } else if (response.length > 3) {
            message = this.state = this.const.STATE_MULTI_CONNECTED;
        } else {
            this.state = this.const.STATE_CONNECTED;
            let device = response[1].replace(/\r/g, '');
            message = [this.const.STATE_CONNECTED, '-', device].join('');
        }
        this._stateListener(message);
    }

    onCheckingError(data) {
        this.state = this.const.STATE_ERROR;
        this._stateListener('Error');
    }

    onCheckingTerminated() {
        this.isCheckingDevice = false;
    }

    startDlog(afterClear, timestamp) {
        if (this.isRunning)
            return;

        let command = '';
        if (afterClear) {
            command = timestamp ? this.const.SDB_DLOG_CLEAR_START_WITH_TIMESTAMP : this.const.SDB_DLOG_CLEAR_START;
        } else {
            command = timestamp ? this.const.SDB_DLOG_START_WITH_TIMESTAMP : this.const.SDB_DLOG_START;
        }

        this.sdb = this.spawn(this.const.MAIN_COMMAND, command, this.spawnOption);
        this.isRunning = true;

        this.sdb.stdout.on(this.const.DATA_EVENT, this.onStdout.bind(this));
        this.sdb.stderr.on(this.const.DATA_EVENT, this.onErrorEvent.bind(this));
        this.sdb.on(this.const.ERROR_EVENT, this.onErrorEvent.bind(this));
        this.sdb.on(this.const.CLOSE_EVENT, this.onTerminatedEvent.bind(this));
    }

    registerStateListener(stateListener) {
        this.stateListener = stateListener;
    }

    registerListener(logListener, errorCallback, terminatedCallback) {
        this.logListener = logListener;
        this.errorCallback = errorCallback;
        this.terminatedCallback = terminatedCallback;
    }

    stopDlog(){
        if (!this.isRunning || !this.sdb)
            return;

        this.sdb.kill();
        this.isRunning = false;
        this.sdb = null;
    }

    unregisterListener() {
        this.logListener = null;
        this.errorCallback = null;
        this.terminatedCallback = null;
    }

    onStdout(data) {
        this._logListener(data);
    }

    onTerminatedEvent(code) {
        // console.log(`onTerminate ${code}`);
        this.sdb = null;
        this.isRunning = false;
        this._terminatedCallback(code);
    }

    onErrorEvent(data) {
        // console.log(`onError ${data}`);
        this.isRunning = false;
        this._errorCallback(data);
    }
}
