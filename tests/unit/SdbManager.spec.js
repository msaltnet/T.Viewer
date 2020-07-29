import SdbManager from '@/SdbManager.js'

describe('SdbManager', () => {
    beforeEach(() => {
    })

    describe('startDlog', () => {
        it('should call spawn with correct argument when startDlog called and afterClear is true, timestamp is false', () => {
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: jest.fn()
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog(true, false);
            expect(sdbManager.isRunning).toBe(true);
            expect(mockSpawn).toBeCalledWith(sdbManager.const.MAIN_COMMAND,
                sdbManager.const.SDB_DLOG_CLEAR_START,
                sdbManager.spawnOption);
        })

        it('should call spawn with correct argument when startDlog called and afterClear is true, timestamp is true', () => {
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: jest.fn()
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog(true, true);
            expect(sdbManager.isRunning).toBe(true);
            expect(mockSpawn).toBeCalledWith(sdbManager.const.MAIN_COMMAND,
                sdbManager.const.SDB_DLOG_CLEAR_START_WITH_TIMESTAMP,
                sdbManager.spawnOption);
        })

        it('should call spawn with correct argument when startDlog called and afterClear is false, timestamp is false', () => {
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: jest.fn()
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog(false, false);
            expect(sdbManager.isRunning).toBe(true);
            expect(mockSpawn).toBeCalledWith(sdbManager.const.MAIN_COMMAND,
                sdbManager.const.SDB_DLOG_START,
                sdbManager.spawnOption);
        })

        it('should call spawn with correct argument when startDlog called and afterClear is false, timestamp is false', () => {
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: jest.fn()
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog(false, true);
            expect(sdbManager.isRunning).toBe(true);
            expect(mockSpawn).toBeCalledWith(sdbManager.const.MAIN_COMMAND,
                sdbManager.const.SDB_DLOG_START_WITH_TIMESTAMP,
                sdbManager.spawnOption);
        })

        it('should set listener to spawn stdout when startDlog called', () => {
            const mockOn = jest.fn();
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: mockOn
                },
                stderr: {
                    on: jest.fn()
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog();
            expect(mockOn).toBeCalledWith(sdbManager.const.LISTEN_EVENT, expect.any(Function));
        })

        it('should set error callback to spawn stderr when startDlog called', () => {
            const mockOn = jest.fn();
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: mockOn
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog();
            expect(mockOn).toBeCalledWith(sdbManager.const.LISTEN_EVENT, expect.any(Function));
        })

        it('should set close callback to spawn close event when startDlog called', () => {
            const mockOn = jest.fn();
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: jest.fn()
                },
                on: mockOn
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.startDlog();
            expect(mockOn).toBeCalledWith(sdbManager.const.CLOSE_EVENT, expect.any(Function));
        })

        it('should NOT call spawn when startDlog called but isRunning is true', () => {
            const mockSpawn = jest.fn().mockReturnValue({
                stdout: {
                    on: jest.fn()
                },
                stderr: {
                    on: jest.fn()
                },
                on: jest.fn()
            });

            const sdbManager = new SdbManager(mockSpawn);
            sdbManager.isRunning = true;
            sdbManager.startDlog();
            expect(mockSpawn).not.toBeCalledWith(sdbManager.const.MAIN_COMMAND,
                sdbManager.const.SDB_DLOG_COMMAND,
                sdbManager.spawnOption);
        })
    })

    describe('registerListener', () => {
        it('should call registered listener callback when onStdout called', () => {
            const mockListener = jest.fn();
            const sdbManager = new SdbManager();
            sdbManager.registerListener(mockListener);
            sdbManager.onStdout('banana');
            expect(mockListener).toBeCalledWith('banana');
        })

        it('should call registered errorCallback callback when onErrorEvent called', () => {
            const mockErrorCallback = jest.fn();
            const sdbManager = new SdbManager();
            sdbManager.registerListener(null, mockErrorCallback);
            sdbManager.onErrorEvent('apple');
            expect(mockErrorCallback).toBeCalledWith('apple');
        })

        it('should call registered terminatedCallback callback when onTerminatedEvent called', () => {
            const mockTerminatedCallback = jest.fn();
            const sdbManager = new SdbManager();
            sdbManager.registerListener(null, null, mockTerminatedCallback);
            sdbManager.onTerminatedEvent('lemon');
            expect(mockTerminatedCallback).toBeCalledWith('lemon');
        })
    })

    it('should call spawn kill when stopDlog called', () => {
        const mockKill = jest.fn();
        const mockSpawn = jest.fn().mockReturnValue({
            stdout: {
                on: jest.fn()
            },
            stderr: {
                on: jest.fn()
            },
            on: jest.fn(),
            kill: mockKill
        });

        const sdbManager = new SdbManager(mockSpawn);
        sdbManager.startDlog();
        expect(sdbManager.isRunning).toBe(true);

        sdbManager.stopDlog();
        expect(mockKill).toBeCalledTimes(1);
        expect(sdbManager.isRunning).toBe(false);
    })

})
