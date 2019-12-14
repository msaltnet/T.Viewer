import LogMonitor from '@/components/LogMonitor.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
Vue.use(Vuetify);

const localVue = createLocalVue()
describe('LogMonitor.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should have a default content and match snapshot', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })

    // With jest we can create snapshot files of the HTML output
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should call registerListener', () => {
    const vm = new Vue(LogMonitor).$mount();
    vm.isListenerOn = true;
    vm.logListener.registerListener = jest.fn();

    vm.onStartButton();
    expect(vm.logListener.registerListener).toBeCalledTimes(1);
  })

  it('should call unregisterListener', () => {
    const vm = new Vue(LogMonitor).$mount();
    vm.isListenerOn = false;
    vm.logListener.unregisterListener = jest.fn();

    vm.onStartButton();
    expect(vm.logListener.unregisterListener).toBeCalledTimes(1);
  })
})
