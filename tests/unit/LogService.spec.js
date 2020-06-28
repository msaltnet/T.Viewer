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
        expect(mockIpcMain.on).toBeCalledWith(logService.LISTEN_REQUEST_CHANNEL, expect.any(Function));
    })

    it('should have a listener after onListenRegister called with channel info', () => {
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

    it('should delete listener after onListenRegister called with null channel info', () => {
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

    it('should register onPowerEvent callback to ipcMain', () => {
        const mockIpcMain = {
            on: jest.fn(),
        }
        const logService = new LogService(mockIpcMain);

        logService.init();
        expect(mockIpcMain.on).toBeCalledWith(logService.POWER_EVENT_CHANNEL, expect.any(Function));
    })

    it('should call setPower with true when onPowerEvent called with "start" argument', () => {
        const mockIpcMain = {
            on: jest.fn(),
        }
        const mockSdbManager = {
            startDlog: jest.fn(),
            stopDlog: jest.fn()
        }
        const logService = new LogService(mockIpcMain, mockSdbManager);
        const mockListener = {
            sender: {
                id: "monkey"
            }
        };

        const mockSetPower = jest.fn();
        logService.setPower = mockSetPower;
        logService.onPowerEvent(mockListener, "start");
        expect(mockSetPower).toBeCalledWith(true);
    })

    it('should call setPower with false when onPowerEvent called without "start" argument', () => {
        const mockIpcMain = {
            on: jest.fn(),
        }
        const mockSdbManager = {
            startDlog: jest.fn(),
            stopDlog: jest.fn()
        }
        const logService = new LogService(mockIpcMain, mockSdbManager);
        const mockListener = {
            sender: {
                id: "monkey"
            }
        };

        let mockSetPower = jest.fn();
        logService.setPower = mockSetPower;
        logService.onPowerEvent(mockListener, "star");
        expect(mockSetPower).toBeCalledWith(false);

        let mockSetPower2 = jest.fn();
        logService.setPower = mockSetPower2;
        logService.onPowerEvent(mockListener, "");
        expect(mockSetPower2).toBeCalledWith(false);

        let mockSetPower3 = jest.fn();
        logService.setPower = mockSetPower3;
        logService.onPowerEvent(mockListener);
        expect(mockSetPower3).toBeCalledWith(false);
    })

})
