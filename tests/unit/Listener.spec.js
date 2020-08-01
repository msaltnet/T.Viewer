import Listener from '@/Listener.js'

describe('Listener', () => {
    const mockIpcRenderer = {
        on: jest.fn(),
        send: jest.fn(),
        removeListener: jest.fn(),
    }
    beforeEach(() => {

    })

    describe('startListen', () => {
        it('should send requet and register listener when startListen is called', () => {
            mockIpcRenderer.on = jest.fn();
            mockIpcRenderer.send = jest.fn();
            const listener = new Listener(mockIpcRenderer, 'mango', 'apple');
            listener.isStarted = false;
            listener.startListen();

            expect(mockIpcRenderer.send).toBeCalledWith('mango', 'apple');
            expect(mockIpcRenderer.on).toBeCalledWith('apple', expect.any(Function));
        })

        it('should set isStarted true for listen when startListen is called', () => {
            mockIpcRenderer.on = jest.fn();
            mockIpcRenderer.send = jest.fn();
            const listener = new Listener(mockIpcRenderer, 'mango', 'apple');
            listener.isStarted = false;
            listener.startListen();

            expect(listener.isStarted).toEqual(true);
        })

        it('should do nothing when isStarted is true and startListen is called', () => {
            mockIpcRenderer.on = jest.fn();
            mockIpcRenderer.send = jest.fn();
            const listener = new Listener(mockIpcRenderer, 'mango', 'apple');
            listener.isStarted = true;
            listener.startListen();

            expect(mockIpcRenderer.send).not.toBeCalled();
            expect(mockIpcRenderer.on).not.toBeCalled();
        })
    })

    describe('startListen', () => {
        it('should send requet and register listener when stopListen is called', () => {
            mockIpcRenderer.removeListener = jest.fn();
            mockIpcRenderer.send = jest.fn();
            const listener = new Listener(mockIpcRenderer, 'mango', 'apple');
            listener.isStarted = true;
            listener.stopListen();

            expect(mockIpcRenderer.send).toBeCalledWith('mango', null);
            expect(mockIpcRenderer.removeListener).toBeCalledWith('apple', expect.any(Function));
        })

        it('should set isStarted false for listen when stopListen is called', () => {
            const listener = new Listener(mockIpcRenderer);
            listener.isStarted = true;
            listener.stopListen();

            expect(listener.isStarted).toEqual(false);
        })

        it('should do nothing when isStarted is false and stopListen is called', () => {
            mockIpcRenderer.removeListener = jest.fn();
            mockIpcRenderer.send = jest.fn();
            const listener = new Listener(mockIpcRenderer);
            listener.isStarted = false;
            listener.stopListen();

            expect(mockIpcRenderer.send).not.toBeCalled();
            expect(mockIpcRenderer.removeListener).not.toBeCalled();
        })
    })

    describe('registerListener', () => {
        it('should have a listener in listenerMap after registerListener', () => {
            const listener = new Listener(mockIpcRenderer);
            const mockLisnter = () => {};

            let tag = listener.registerListener(mockLisnter);
            expect(listener.listenerMap.has(tag)).toEqual(true);
        })

        it('should call startListen when registerListener is called', () => {
            const listener = new Listener(mockIpcRenderer);
            const mockLisnter = () => {};
            listener.startListen = jest.fn();

            listener.registerListener(mockLisnter)
            expect(listener.startListen).toBeCalled();
        })
    })

    describe('unregisterListener', () => {
        it('should NOT have a listener in listenerList after unregisterListener with tag', () => {
            const listener = new Listener(mockIpcRenderer);
            const mockLisnter = () => {};
            let tag = "banana";
            listener.listenerMap.set(tag, mockLisnter);
            expect(listener.listenerMap.has(tag)).toEqual(true);
            listener.unregisterListener(tag);
            expect(listener.listenerMap.has(tag)).toEqual(false);
        })

        it('should call stopListen when unregisterListener is called and listenerMap is empty', () => {
            const listener = new Listener(mockIpcRenderer);
            listener.stopListen = jest.fn();

            listener.listenerMap.clear();
            listener.unregisterListener()
            expect(listener.stopListen).toBeCalled();
        })
    })
})