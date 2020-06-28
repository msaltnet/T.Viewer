import LogMonitor from '@/components/LogMonitor.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import {
  mount
} from '@vue/test-utils'
Vue.use(Vuetify);

describe('LogMonitor.vue', () => {
  it('should call registerListener', () => {
    const vm = mount(LogMonitor).vm;
    vm.isListenerOn = true;
    vm.logListener.registerListener = jest.fn();

    vm.onStartButton();
    expect(vm.logListener.registerListener).toBeCalledTimes(1);
  })

  it('should call unregisterListener', () => {
    const vm = mount(LogMonitor).vm;
    vm.isListenerOn = false;
    vm.logListener.unregisterListener = jest.fn();

    vm.onStartButton();
    expect(vm.logListener.unregisterListener).toBeCalledTimes(1);
  })
})
