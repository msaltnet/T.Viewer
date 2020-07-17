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
  it('should send ipc "start" message when switch state is changed to true', () => {
    const vm = shallowMount(App).vm;
    vm.switchListen = true;
    vm.onSwitchChange();
    expect(ipcRenderer.send).toBeCalledWith("change-power", "start");
  })

  it('should send ipc message without "start" when switch state is changed to false', () => {
    const vm = shallowMount(App).vm;
    vm.switchListen = false;
    vm.onSwitchChange();
    expect(ipcRenderer.send).toBeCalledWith("change-power", expect.not.stringMatching("start"));
  })

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
