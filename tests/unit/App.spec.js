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
            let currentId = vm.increamentalId;
            vm.createNewTab();
            expect(vm.tabs.length).toEqual(before+1);
            expect(vm.tabs[before].id).toEqual(currentId);
            expect(vm.tabs[before].name).toEqual("tab-" + currentId);
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
            vm.fontSizeIndex = 1;
            vm.fontSize = vm.fontSizeList[vm.fontSizeIndex];
            vm.onFontUpButtonClick();

            expect(vm.fontSizeIndex).toEqual(2);
            expect(vm.fontSize).toEqual(vm.fontSizeList[2]);

            vm.fontSizeIndex = vm.fontSizeList.length - 1;
            vm.fontSize = vm.fontSizeList[vm.fontSizeIndex];
            vm.onFontUpButtonClick();

            expect(vm.fontSizeIndex).toEqual(vm.fontSizeList.length - 1);
            expect(vm.fontSize).toEqual(vm.fontSizeList[vm.fontSizeList.length - 1]);
        })

        it('should set correct fontSize when onFontDownButtonClick is called', () => {
            const vm = shallowMount(App).vm;
            vm.fontSizeIndex = 1;
            vm.fontSize = vm.fontSizeList[vm.fontSizeIndex];
            vm.onFontDownButtonClick();

            expect(vm.fontSizeIndex).toEqual(0);
            expect(vm.fontSize).toEqual(vm.fontSizeList[0]);

            vm.fontSizeIndex = 0;
            vm.fontSize = vm.fontSizeList[vm.fontSizeIndex];
            vm.onFontDownButtonClick();

            expect(vm.fontSizeIndex).toEqual(0);
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
})
