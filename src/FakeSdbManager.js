export default class FakeSdbManager {
    constructor() {
        this.connectedMsg = "msalt-test-device";
        this.printTimer;
        this.encoder = new TextEncoder();
        this.withTimestamp = true;
        this.const = {
            STATE_CONNECTED: 'connected',
            LOG : [
                'V/MSALT_NET(P 2895, T11588): msaltnet.c: Verbose dlog this is dummy log for test!\n',
                'V/MSALT_NET(P 2895, T11588): msaltnet.c: Verbose dlog this is dummy log for test!\n',
                'V/MSALT_NET(P 2895, T11588): msaltnet.c: Verbose dlog this is dummy log for test!\n',
                'W/MSALT_NET(P 2895, T11588): msaltnet.c: Warning dlog this is dummy log for test!\n',
                'E/MSALT_NET(P 2895, T11588): msaltnet.c: Error dlog this is dummy log for test!\n',
                'V/MSALT_NET(P 2895, T11588): msaltnet.c: Verbose dlog this is dummy log for test!\n',
                'D/MSALT_NET(P 2895, T11588): msaltnet.c: Debug dlog this is dummy log for test!\n',
                'I/MSALT_NET(P 2895, T11588): msaltnet.c: Info dlog this is dummy log for test!\n',
                'D/MSALT_NET(P 2895, T11588): msaltnet.c: Debug dlog this is dummy log for test!\n',
                'W/MSALT_NET(P 2895, T11588): msaltnet.c: Warning dlog this is dummy log for test!\n',
                'D/MSALT_NET(P 2895, T11588): msaltnet.c: Debug dlog this is dummy log for test!\n',
                'D/MSALT_NET(P 2895, T11588): msaltnet.c: Debug dlog this is dummy log for test!\n',
                'I/MSALT_NET(P 2895, T11588): msaltnet.c: Info dlog this is dummy log for test!\n',
                'I/MSALT_NET(P 2895, T11588): msaltnet.c: Info dlog this is dummy log for test!\n',
                'E/MSALT_NET(P 2895, T11588): msaltnet.c: Error dlog this is dummy log for test!\n',
                'F/MSALT_NET(P 2895, T11588): msaltnet.c: Fatal dlog this is dummy log for test!\n',
            ]
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
    }

    startChecking() {
        setInterval(this.checkDevice.bind(this), 1500);
    }

    checkDevice() {
        if (this.connectedMsg) {
            this._stateListener([this.const.STATE_CONNECTED, '-', this.connectedMsg].join(''));
        } else {
            this._stateListener('Error');
        }
    }

    _printDummyMessage() {
        let strArray = [];
        let m = new Date();
        let dateString = [
            ('0' + (m.getUTCMonth()+1)).slice(-2),
            "-",
            ('0' + (m.getUTCDate()+1)).slice(-2),
            " ",
            ('0' + (m.getUTCHours()+1)).slice(-2),
            ":",
            ('0' + (m.getUTCMinutes()+1)).slice(-2),
            ":",
            ('0' + (m.getUTCSeconds()+1)).slice(-2),
            ".",
            m.getMilliseconds(),
            "+0900 "
        ].join('');

        for (let i = 0; i < 10; i++) {
            let random = Math.floor(Math.random() * 20);
            let index = random % this.const.LOG.length;
            if (this.withTimestamp)
                strArray.push(dateString);
            strArray.push(this.const.LOG[index]);
        }
        let str = strArray.join('');
        this._logListener(this.encoder.encode(str));
    }

    startDlog(afterClear, timestamp) {
        console.log("Strat dlog");
        this.withTimestamp = timestamp;
        this.printTimer = setInterval(this._printDummyMessage.bind(this), 1000);
    }

    registerStateListener(stateListener) {
        console.log(`registerStateListener ${stateListener}`);
        this.stateListener = stateListener;
    }

    registerListener(logListener, errorCallback, terminatedCallback) {
        console.log(`registerListener ${logListener}`);
        this.logListener = logListener;
        this.errorCallback = errorCallback;
        this.terminatedCallback = terminatedCallback;
    }

    stopDlog(){
        console.log("Stop dlog");
        clearInterval(this.printTimer);
        this.printTimer = 0;
    }

    unregisterListener() {
        this.logListener = null;
        this.errorCallback = null;
        this.terminatedCallback = null;
    }
}
