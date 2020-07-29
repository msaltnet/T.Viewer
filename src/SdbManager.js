export default class SdbManager {
    constructor(spawn) {
        this.isRunning = false;
        this.const = {
            MAIN_COMMAND : 'sdb',
            SDB_DLOG_START: ['shell', 'dlogutil'],
            SDB_DLOG_START_WITH_TIMESTAMP: ['shell', 'dlogutil -v time'],
            SDB_DLOG_CLEAR_START: ['shell', 'dlogutil -c && dlogutil'],
            SDB_DLOG_CLEAR_START_WITH_TIMESTAMP: ['shell', 'dlogutil -c && dlogutil -v time'],
            LISTEN_EVENT: 'data',
            CLOSE_EVENT: 'close',
        };
        this.spawnOption = {
            env: process.env
        };
        this.listener;
        this._listener = (data) => {
            // console.log(data);
            if (this.listener)
                this.listener(data);
        };
        this.errorCallback;
        this._errorCallback = (data) => {
            // console.log(data);
            if (this.errorCallback)
                this.errorCallback(data);
        };
        this.terminatedCallback;
        this._terminatedCallback = (code) => {
            // console.log(code);
            if (this.terminatedCallback)
                this.terminatedCallback(code);
        };
        this.sdb;
        this.spawn = spawn;
    }

    startDlog(afterClear, timestamp){
        if (this.isRunning)
            return;
        console.log('Dlog Start!');
        let command = '';
        if (afterClear) {
            command = timestamp ? this.const.SDB_DLOG_CLEAR_START_WITH_TIMESTAMP : this.const.SDB_DLOG_CLEAR_START;
        } else {
            command = timestamp ? this.const.SDB_DLOG_START_WITH_TIMESTAMP : this.const.SDB_DLOG_START;
        }

        this.sdb = this.spawn(this.const.MAIN_COMMAND, command, this.spawnOption);
        this.isRunning = true;

        this.sdb.stdout.on(this.const.LISTEN_EVENT, this.onStdout.bind(this));
        this.sdb.stderr.on(this.const.LISTEN_EVENT, this.onErrorEvent.bind(this));
        this.sdb.on(this.const.CLOSE_EVENT, this.onTerminatedEvent.bind(this));
    }

    registerListener(listener, errorCallback, terminatedCallback) {
        this.listener = listener;
        this.errorCallback = errorCallback;
        this.terminatedCallback = terminatedCallback;
    }

    stopDlog(){
        if (!this.isRunning || !this.sdb)
            return;
        console.log('Dlog Stop!');
        this.sdb.kill();
        this.isRunning = false;
        this.sdb = null;
    }

    unregisterListener() {
        this.listener = null;
        this.errorCallback = null;
        this.terminatedCallback = null;
    }

    onStdout(data) {
        this._listener(data);
        // console.log(`stdout: ${data}`);
    }

    onTerminatedEvent(code) {
        this._terminatedCallback(code);
        console.log(`child process exited with code ${code}`);
    }

    onErrorEvent(data) {
        this._errorCallback(data);
        console.error(`stderr: ${data}`);
    }
}
