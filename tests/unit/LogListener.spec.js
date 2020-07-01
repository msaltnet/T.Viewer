import LogListener from '@/LogListener.js'

describe('LogListener', () => {
    const mockIpcRenderer = {
        on: jest.fn(),
        send: jest.fn(),
        removeListener: jest.fn(),
    }
    beforeEach(() => {

    })

    it('should send requet and register listener when startListen is called', () => {
        mockIpcRenderer.on = jest.fn();
        mockIpcRenderer.send = jest.fn();
        const logListener = new LogListener(mockIpcRenderer);
        logListener.isStarted = false;
        logListener.startListen();

        expect(mockIpcRenderer.send).toBeCalledWith(logListener.LISTEN_REQUEST_CHANNEL, logListener.LISTEN_LOG_CHANNEL);
        expect(mockIpcRenderer.on).toBeCalledWith(logListener.LISTEN_LOG_CHANNEL, logListener._listener);
    })

    it('should set isStarted true for listen when startListen is called', () => {
        mockIpcRenderer.on = jest.fn();
        mockIpcRenderer.send = jest.fn();
        const logListener = new LogListener(mockIpcRenderer);
        logListener.isStarted = false;
        logListener.startListen();

        expect(logListener.isStarted).toEqual(true);
    })

    it('should do nothing when isStarted is true and startListen is called', () => {
        mockIpcRenderer.on = jest.fn();
        mockIpcRenderer.send = jest.fn();
        const logListener = new LogListener(mockIpcRenderer);
        logListener.isStarted = true;
        logListener.startListen();

        expect(mockIpcRenderer.send).not.toBeCalledWith(logListener.LISTEN_REQUEST_CHANNEL, logListener.LISTEN_LOG_CHANNEL);
        expect(mockIpcRenderer.on).not.toBeCalledWith(logListener.LISTEN_LOG_CHANNEL, logListener._listener);
    })

    it('should send requet and register listener when stopListen is called', () => {
        mockIpcRenderer.removeListener = jest.fn();
        mockIpcRenderer.send = jest.fn();
        const logListener = new LogListener(mockIpcRenderer);
        logListener.isStarted = true;
        logListener.stopListen();

        expect(mockIpcRenderer.send).toBeCalledWith(logListener.LISTEN_REQUEST_CHANNEL, null);
        expect(mockIpcRenderer.removeListener).toBeCalledWith(logListener.LISTEN_LOG_CHANNEL, logListener._listener);
    })

    it('should set isStarted false for listen when stopListen is called', () => {
        const logListener = new LogListener(mockIpcRenderer);
        logListener.isStarted = true;
        logListener.stopListen();

        expect(logListener.isStarted).toEqual(false);
    })

    it('should do nothing when isStarted is false and stopListen is called', () => {
        mockIpcRenderer.removeListener = jest.fn();
        mockIpcRenderer.send = jest.fn();
        const logListener = new LogListener(mockIpcRenderer);
        logListener.isStarted = false;
        logListener.stopListen();

        expect(mockIpcRenderer.send).not.toBeCalledWith(logListener.LISTEN_REQUEST_CHANNEL, null);
        expect(mockIpcRenderer.removeListener).not.toBeCalledWith(logListener.LISTEN_LOG_CHANNEL, logListener._listener);
    })

    it('should have a listener in listenerMap after registerListener', () => {
        const logListener = new LogListener(mockIpcRenderer);
        const mockLisnter = () => {};

        let tag = logListener.registerListener(mockLisnter);
        expect(logListener.listenerMap.has(tag)).toEqual(true);
    })

    it('should call startListen when registerListener is called', () => {
        const logListener = new LogListener(mockIpcRenderer);
        const mockLisnter = () => {};
        logListener.startListen = jest.fn();

        logListener.registerListener(mockLisnter)
        expect(logListener.startListen).toBeCalled();
    })

    it('should NOT have a listener in listenerList after unregisterListener with tag', () => {
        const logListener = new LogListener(mockIpcRenderer);
        const mockLisnter = () => {};
        let tag = "banana";
        logListener.listenerMap.set(tag, mockLisnter);
        expect(logListener.listenerMap.has(tag)).toEqual(true);
        logListener.unregisterListener(tag);
        expect(logListener.listenerMap.has(tag)).toEqual(false);
    })

    it('should call stopListen when unregisterListener is called and listenerMap is empty', () => {
        const logListener = new LogListener(mockIpcRenderer);
        logListener.stopListen = jest.fn();

        logListener.listenerMap.clear();
        logListener.unregisterListener()
        expect(logListener.stopListen).toBeCalled();
    })

})