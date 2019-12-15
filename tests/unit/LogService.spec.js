import LogService from '@/LogService.js'

describe('LogService', () => {
    beforeEach(() => {
    })

    it('should register onListenRegister callback to ipcMain', () => {
        const mockIpcMain = {
            on: jest.fn(),
        }
        const logService = new LogService(mockIpcMain);

        logService.init();
        expect(mockIpcMain.on).toBeCalledWith(logService.LISTEN_REQUEST_CHANNEL, expect.anything());
    })

    it('should have a listener after onListenRegister with channel info', () => {
        const mockIpcMain = {
            on: jest.fn(),
        }
        const logService = new LogService(mockIpcMain);
        const mockListener = {
            sender: {
                id: "monkey"
            }
        };
        const mockChannel = "banana-channel";

        expect(logService.listenerMap.size).toEqual(0);

        logService.onListenRegister(mockListener, mockChannel);
        expect(logService.listenerMap.size).toEqual(1);
        expect(logService.listenerMap.get(mockListener.sender.id).id).toEqual(mockListener.sender.id);
        expect(logService.listenerMap.get(mockListener.sender.id).channel).toEqual(mockChannel);
    })

    it('should delete listener after onListenRegister with null channel info', () => {
        const mockIpcMain = {
            on: jest.fn(),
        }
        const logService = new LogService(mockIpcMain);
        const mockListener = {
            sender: {
                id: "monkey"
            }
        };

        logService.listenerMap.set(mockListener.sender.id, mockListener.sender);
        expect(logService.listenerMap.size).toEqual(1);

        logService.onListenRegister(mockListener, null);
        expect(logService.listenerMap.size).toEqual(0);
    })
})
