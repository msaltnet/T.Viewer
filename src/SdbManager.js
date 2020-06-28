export default class {
    constructor(spawn) {
        this.isRunning = false;
        this.const = {
            MAIN_COMMAND : 'sdb',
            SDB_DLOG_COMMAND: ['dlog', '-v', 'time'],
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

    startDlog(){
        if (this.isRunning)
            return;
        console.log('Dlog Start!');
        this.sdb = this.spawn(this.const.MAIN_COMMAND, this.const.SDB_DLOG_COMMAND, this.spawnOption);
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
        console.log(`stdout: ${data}`);
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
