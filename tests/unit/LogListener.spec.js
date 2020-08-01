import LogListener from '@/LogListener.js'

describe('LogListener', () => {
    const mockIpcRenderer = {
        on: jest.fn(),
        send: jest.fn(),
        removeListener: jest.fn(),
    }
    beforeEach(() => {
    })

    it('should called listener when onReceive is called with textDecoder.decode text', () => {
        mockIpcRenderer.on = jest.fn();
        mockIpcRenderer.send = jest.fn();
        const logListener = new LogListener(mockIpcRenderer);
        let listener1 = jest.fn();
        let listener2 = jest.fn();
        logListener.textDecoder = {
            decode: jest.fn().mockReturnValue('apple')
        }
        logListener.listenerMap.set('banana', listener1);
        logListener.listenerMap.set('mango', listener2);
        logListener.onReceive(null, 'orange');

        expect(listener1).toBeCalledWith('apple');
        expect(listener2).toBeCalledWith('apple');
        expect(logListener.textDecoder.decode).toBeCalledWith('orange');
    })

})