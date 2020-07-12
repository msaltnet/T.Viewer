import LogMonitor from '@/components/LogMonitor.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
Vue.use(Vuetify);
const localVue = createLocalVue();

describe('LogMonitor.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should call registerListener when listen switch is changed to true', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })

    wrapper.vm.isListenerOn = true;
    wrapper.vm.logListener.registerListener = jest.fn();

    wrapper.vm.onSwitchChanged();
    expect(wrapper.vm.logListener.registerListener).toBeCalledTimes(1);
  })

  it('should call unregisterListener when listen switch is changed to false', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.isListenerOn = false;
    vm.logListener.unregisterListener = jest.fn();

    vm.onSwitchChanged();
    expect(vm.logListener.unregisterListener).toBeCalledTimes(1);
  })

  it('should return correct height when getEditorHeight is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    window.innerHeight = 500;
    // "- 88 - 56" is temporary value
    expect(vm.getEditorHeight()).toEqual(500 - 88 - 56);
  })

})
