import App from '@/App.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';
import { ipcRenderer } from 'electron';

// Utilities
import {
  mount,
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

})
