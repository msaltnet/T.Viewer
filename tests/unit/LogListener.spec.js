import LogListener from '@/LogListener.js'

describe('LogListener', () => {
    beforeEach(() => {
    })

    it('should have a listener after registerListener', () => {
        const mockIpcRenderer = {
            on: jest.fn(),
            send: jest.fn(),
            removeListener: jest.fn(),
        }
        const logListener = new LogListener(mockIpcRenderer);
        const mockLisnter = () => {};

        expect(logListener.listener).toEqual(undefined)

        logListener.registerListener(mockLisnter)

        expect(mockIpcRenderer.send).toBeCalledWith(logListener.LISTEN_REQUEST_CHANNEL, logListener.LISTEN_LOG_CHANNEL)
        expect(logListener.listener).toEqual(mockLisnter)
    })

    it('should NOT have listener after unregisterListener', () => {
        const mockIpcRenderer = {
            on: jest.fn(),
            send: jest.fn(),
            removeListener: jest.fn(),
        }
        const logListener = new LogListener(mockIpcRenderer);
        const mockLisnter = () => {};
        logListener.listener = mockLisnter;

        logListener.unregisterListener()

        expect(mockIpcRenderer.send).toBeCalledWith(logListener.LISTEN_REQUEST_CHANNEL, null)
        expect(logListener.listener).toEqual(undefined)
    })
})
