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
    describe('onSwitchChange', () => {
        it('should send ipc "start" message when switch state is changed to true and sdbClearStart is false', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.sdbClearStart = false;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "start");
        })

        it('should send ipc "clearStart" message when switch state is changed to true and sdbClearStart is true', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = true;
            vm.sdbClearStart = true;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", "clearStart");
        })

        it('should send ipc message with start and clearStart when switch state is changed to false', () => {
            const vm = shallowMount(App).vm;
            vm.switchListen = false;
            vm.onSwitchChange();
            expect(ipcRenderer.send).toBeCalledWith("change-power", expect.not.stringMatching("start"));
            expect(ipcRenderer.send).toBeCalledWith("change-power", expect.not.stringMatching("clearStart"));
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
})
