import App from '@/App.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';
import { ipcRenderer } from 'electron';

// Utilities
import {
    shallowMount
} from '@vue/test-utils'
Vue.use(Vuetify);

describe('App.vue', () => {
    describe('onStateReceived', () => {
        it('should set correct value when state is "error"', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.stateColor = 'banana';
            vm.stateTextColor = 'apple';
            vm.stateText = 'mango';
            vm.state = 'orange';

            vm.onStateReceived('error');
            expect(vm.switchListen).toEqual(false);
            expect(vm.stateColor).toEqual('red');
            expect(vm.stateTextColor).toEqual('white');
            expect(vm.stateText).toEqual('Error - Check SDB Connection');
            expect(vm.state).toEqual('error');
        })

        it('should set correct value when state is "none"', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.stateColor = 'banana';
            vm.stateTextColor = 'apple';
            vm.stateText = 'mango';
            vm.state = 'orange';

            vm.onStateReceived('none');
            expect(vm.switchListen).toEqual(false);
            expect(vm.stateColor).toEqual('gray');
            expect(vm.stateTextColor).toEqual('blue-grey darken-3');
            expect(vm.stateText).toEqual('Not Connected');
            expect(vm.state).toEqual('none');
        })

        it('should set correct value when state is "multi-connected"', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.stateColor = 'banana';
            vm.stateTextColor = 'apple';
            vm.stateText = 'mango';
            vm.state = 'orange';

            vm.onStateReceived('multi-connected');
            expect(vm.switchListen).toEqual(false);
            expect(vm.stateColor).toEqual('orange');
            expect(vm.stateTextColor).toEqual('white');
            expect(vm.stateText).toEqual('Too Many Devices');
            expect(vm.state).toEqual('multi-connected');
        })

        it('should set correct value when state is "connected"', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.stateColor = 'banana';
            vm.stateTextColor = 'apple';
            vm.stateText = 'mango';
            vm.state = 'orange';

            vm.onStateReceived('connected-lemon');
            expect(vm.switchListen).toEqual(true);
            expect(vm.stateColor).toEqual('green');
            expect(vm.stateTextColor).toEqual('white');
            expect(vm.stateText).toEqual('lemon');
            expect(vm.state).toEqual('connected');
        })
    })

    describe('onSwitchChange', () => {
        it('should send ipc "start" message when switchListen is true, sdbClearStart and sdbTimestamp are false', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.sdbClearStart = false;
            vm.sdbTimestamp = false;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "start");
        })

        it('should send ipc "clear" message when switchListen and sdbClearStart are true, sdbTimestamp is false', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.sdbClearStart = true;
            vm.sdbTimestamp = false;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "clear");
        })

        it('should send ipc "start-time" message when switchListen and sdbTimestamp true, sdbClearStart is false', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.sdbClearStart = false;
            vm.sdbTimestamp = true;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "start-time");
        })

        it('should send ipc "clear-time" message when switchListen and sdbClearStart, sdbTimestamp are true', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.sdbClearStart = true;
            vm.sdbTimestamp = true;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "clear-time");
        })

        it('should send ipc message with empty string when switch state is changed to false', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = false;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "");
        })
    })

    describe('Tab', () => {
        it('should insert new tab item correctly when createNewTab is called', () => {
            const vm = shallowMount(App).vm;
            let before = vm.tabs.length;
            vm.createNewTab();
            expect(vm.tabs.length).toEqual(before+1);
            let last = vm.tabs.pop();
            expect(last.id).not.toEqual(null);
            expect(last.name).not.toEqual(null);
            expect(last.keyEvent).not.toEqual(null);
            expect(last.keyEvent.q).not.toEqual(null);
            expect(last.keyEvent.w).not.toEqual(null);
            expect(last.keyEvent.e).not.toEqual(null);
            expect(last.keyEvent.space).not.toEqual(null);
        })

        it('should remove a tab correctly when createNewTab is called', () => {
            const vm = shallowMount(App).vm;
            vm.tabs = ["mango", "banana"];
            vm.closeTab(0);
            expect(vm.tabs.length).toEqual(1);
            expect(vm.tabs[0]).toEqual("banana");
        })
    })

    describe('Font', () => {
        it('should set correct fontSize when onFontUpButtonClick is called', () => {
            const vm = shallowMount(App).vm;
            let fontSizeIndex = 1;
            vm.fontSize = vm.fontSizeList[fontSizeIndex];
            vm.onFontUpButtonClick();

            expect(vm.fontSize).toEqual(vm.fontSizeList[2]);

            fontSizeIndex = vm.fontSizeList.length - 1;
            vm.fontSize = vm.fontSizeList[fontSizeIndex];
            vm.onFontUpButtonClick();

            expect(vm.fontSize).toEqual(vm.fontSizeList[fontSizeIndex]);
        })

        it('should set correct fontSize when onFontDownButtonClick is called', () => {
            const vm = shallowMount(App).vm;
            let fontSizeIndex = 1;
            vm.fontSize = vm.fontSizeList[fontSizeIndex];
            vm.onFontDownButtonClick();

            expect(vm.fontSize).toEqual(vm.fontSizeList[0]);

            fontSizeIndex = 0;
            vm.fontSize = vm.fontSizeList[fontSizeIndex];
            vm.onFontDownButtonClick();

            expect(vm.fontSize).toEqual(vm.fontSizeList[0]);
        })
    })

    describe('powerOff', () => {
        it('should send ipc "" message when powerOff is called', () => {
            const vm = shallowMount(App).vm;
            vm.powerOff();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "");
        })

        it('should set switchListen false when powerOff is called', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.powerOff();
            expect(vm.switchListen).toEqual(false);
        })
    })

    describe('onKeyEvent', () => {
        it('should change correct keyEvent props when called', () => {
            const vm = shallowMount(App).vm;
            vm.tabs = [
                { id: 'mango', keyEvent: { q: false, w: false, e: false, space: true } },
                { id: 'banana', keyEvent: { q: true, w: true, e: true, space: false } }
            ];
            vm.currentItem = 'mango';
            vm.onKeyEvent('w');
            expect(vm.tabs[0].keyEvent.w).toEqual(true);
            vm.onKeyEvent('space');
            expect(vm.tabs[0].keyEvent.space).toEqual(false);

            vm.currentItem = 'banana';
            vm.onKeyEvent('space');
            expect(vm.tabs[1].keyEvent.space).toEqual(true);
            vm.onKeyEvent('q');
            expect(vm.tabs[1].keyEvent.q).toEqual(false);
        })

        it('should not change keyEvent props when called with invaild event', () => {
            const vm = shallowMount(App).vm;
            vm.tabs = [
                { id: 'mango', keyEvent: { q: false, w: false, e: false, space: true, plus: true, minus: true } },
                { id: 'banana', keyEvent: { q: true, w: true, e: true, space: false, plus: false, minus: false } }
            ];
            vm.currentItem = 'mango';
            vm.onKeyEvent('wq');
            expect(vm.tabs[0].keyEvent.w).toEqual(false);
            vm.onKeyEvent('plusa');
            expect(vm.tabs[0].keyEvent.plus).toEqual(true);
        })
    })

})
