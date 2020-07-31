import LogService from '@/LogService.js'

describe('LogService', () => {
    beforeEach(() => {
    })

    describe('init', () => {
        it('should register onListenRegister callback to ipcMain', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                registerListener: jest.fn(),
                registerStateListener: jest.fn(),
                startChecking: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.init();
            expect(mockIpcMain.on).toBeCalledWith(logService.LISTEN_REQUEST_CHANNEL, expect.any(Function));
        })

        it('should register onStateListenRegister callback to ipcMain', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                registerListener: jest.fn(),
                registerStateListener: jest.fn(),
                startChecking: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.init();
            expect(mockIpcMain.on).toBeCalledWith(logService.STATE_LISTEN_REQUEST_CHANNEL, expect.any(Function));
        })

        it('should register onPowerEvent callback to ipcMain', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                registerListener: jest.fn(),
                registerStateListener: jest.fn(),
                startChecking: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.init();
            expect(mockIpcMain.on).toBeCalledWith(logService.POWER_EVENT_CHANNEL, expect.any(Function));
        })

        it('should call sdbManager.registerListener', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                registerListener: jest.fn(),
                registerStateListener: jest.fn(),
                startChecking: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.init();
            expect(mockSdbManager.registerListener).toBeCalledWith(expect.any(Function), expect.any(Function));
        })

        it('should call sdbManager.registerStateListener', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                registerListener: jest.fn(),
                registerStateListener: jest.fn(),
                startChecking: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.init();
            expect(mockSdbManager.registerStateListener).toBeCalledWith(expect.any(Function));
        })

        it('should call sdbManager.startChecking', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                registerListener: jest.fn(),
                registerStateListener: jest.fn(),
                startChecking: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.init();
            expect(mockSdbManager.startChecking).toBeCalledTimes(1);
        })

    })

    describe('setListenerMap', () => {
        it('should have a listener after setListenerMap called with channel info', () => {
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

            logService.setListenerMap(mockListener, mockChannel, logService.listenerMap);
            expect(logService.listenerMap.size).toEqual(1);
            expect(logService.listenerMap.get(mockListener.sender.id).id).toEqual(mockListener.sender.id);
            expect(logService.listenerMap.get(mockListener.sender.id).channel).toEqual(mockChannel);

            expect(logService.stateListenerMap.size).toEqual(0);

            logService.setListenerMap(mockListener, mockChannel, logService.stateListenerMap);
            expect(logService.stateListenerMap.size).toEqual(1);
            expect(logService.stateListenerMap.get(mockListener.sender.id).id).toEqual(mockListener.sender.id);
            expect(logService.stateListenerMap.get(mockListener.sender.id).channel).toEqual(mockChannel);
        })

        it('should delete listener after setListenerMap called with null channel info', () => {
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

            logService.setListenerMap(mockListener, null, logService.listenerMap);
            expect(logService.listenerMap.size).toEqual(0);
        })
    })

    describe('setPower', () => {
        it('should call sdbManager.startDlog with afterClear, timestamp when setPower called with true', () => {
            const mockIpcMain = {
                on: jest.fn(),
            }
            const mockSdbManager = {
                startDlog: jest.fn(),
                stopDlog: jest.fn()
            }
            const logService = new LogService(mockIpcMain, mockSdbManager);

            logService.setPower(true, 'banana', 'orange');
            expect(mockSdbManager.startDlog).toBeCalledWith('banana', 'orange');
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
        it('should call setPower with true, true, false when onPowerEvent called with "clear" argument', () => {
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
            logService.onPowerEvent(true, "clear");
            expect(mockSetPower).toBeCalledWith(true, true, false);
        })

        it('should call setPower with true, true, true when onPowerEvent called with "clear-time" argument', () => {
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
            logService.onPowerEvent(true, "clear-time");
            expect(mockSetPower).toBeCalledWith(true, true, true);
        })

        it('should call setPower with true, false, false when onPowerEvent called with other "start" argument', () => {
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
            expect(mockSetPower).toBeCalledWith(true, false, false);
        })

        it('should call setPower with true, false, true when onPowerEvent called with other "start-time" argument', () => {
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
            logService.onPowerEvent(true, "start-time");
            expect(mockSetPower).toBeCalledWith(true, false, true);
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
