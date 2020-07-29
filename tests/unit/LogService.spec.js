import LogService from '@/LogService.js'

describe('LogService', () => {
    beforeEach(() => {
    })

    describe('init', () => {
        it('should register onListenRegister callback to ipcMain', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const logService = new LogService(mockIpcMain);

            logService.init();
            expect(mockIpcMain.on).toBeCalledWith(logService.LISTEN_REQUEST_CHANNEL, expect.any(Function));
        })

        it('should register onPowerEvent callback to ipcMain', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const logService = new LogService(mockIpcMain);

            logService.init();
            expect(mockIpcMain.on).toBeCalledWith(logService.POWER_EVENT_CHANNEL, expect.any(Function));
        })
    })

    describe('onListenRegister', () => {
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
    })

    describe('setPower', () => {
        it('should call sdbManager.startDlog with afterClear when setPower called with true', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                startDlog: jest.fn(),
                stopDlog: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.setPower(true, 'banana');
            expect(mockSdbManager.startDlog).toBeCalledWith('banana');
        })

        it('should call sdbManager.stopDlog with afterClear when setPower called with false', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                startDlog: jest.fn(),
                stopDlog: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.setPower(false, 'banana');
            expect(mockSdbManager.stopDlog).toBeCalled();
        })
    })

    describe('onPowerEvent', () => {
        it('should call setPower with true, true when onPowerEvent called with "clearStart" argument', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                startDlog: jest.fn(),
                stopDlog: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);
            const mockSetPower = jest.fn();
            logService.setPower = mockSetPower;
            logService.onPowerEvent(true, "clearStart");
            expect(mockSetPower).toBeCalledWith(true, true);
        })

        it('should call setPower with true, false when onPowerEvent called with other "start" argument', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                startDlog: jest.fn(),
                stopDlog: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);
            const mockSetPower = jest.fn();
            logService.setPower = mockSetPower;
            logService.onPowerEvent(true, "start");
            expect(mockSetPower).toBeCalledWith(true, false);
        })

        it('should call setPower with false when onPowerEvent called without argument', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                startDlog: jest.fn(),
                stopDlog: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);
            let mockSetPower = jest.fn();
            logService.setPower = mockSetPower;
            logService.onPowerEvent(true, 'mango');
            expect(mockSetPower).toBeCalledWith(false);

            let mockSetPower2 = jest.fn();
            logService.setPower = mockSetPower2;
            logService.onPowerEvent(true, false);
            expect(mockSetPower2).toBeCalledWith(false);

            let mockSetPower3 = jest.fn();
            logService.setPower = mockSetPower3;
            logService.onPowerEvent(true);
            expect(mockSetPower3).toBeCalledWith(false);
        })
    })

})
