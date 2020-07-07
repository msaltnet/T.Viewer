import LogMonitor from '@/components/LogMonitor.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import {
  mount
} from '@vue/test-utils'
Vue.use(Vuetify);

describe('LogMonitor.vue', () => {
  it('should call registerListener when listen switch is changed to true', () => {
    const vm = mount(LogMonitor).vm;
    vm.isListenerOn = true;
    vm.logListener.registerListener = jest.fn();

    vm.onSwitchChanged();
    expect(vm.logListener.registerListener).toBeCalledTimes(1);
  })

  it('should call unregisterListener when listen switch is changed to false', () => {
    const vm = mount(LogMonitor).vm;
    vm.isListenerOn = false;
    vm.logListener.unregisterListener = jest.fn();

    vm.onSwitchChanged();
    expect(vm.logListener.unregisterListener).toBeCalledTimes(1);
  })

  it('should return correct height when getEditorHeight is called', () => {
    const vm = mount(LogMonitor).vm;
    window.innerHeight = 500;
    // "- 88 - 56" is temporary value
    expect(vm.getEditorHeight()).toEqual(500 - 88 - 56);
  })

})
