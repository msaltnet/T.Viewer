import Settings from '@/components/Settings.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
Vue.use(Vuetify);
const localVue = createLocalVue();

describe('Settings.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should call closeAll when onOkClick is called', () => {
    const wrapper = mount(Settings, {
      localVue,
      vuetify,
    })

    let vm = wrapper.vm;
    vm.closeAll = jest.fn();
    vm.onOkClick();
    expect(vm.closeAll).toBeCalledTimes(1);
  })

  it('should call $emit with restart, true when onOkClick is called', () => {
    const wrapper = mount(Settings, {
      localVue,
      vuetify,
    })

    let vm = wrapper.vm;
    vm.$emit = jest.fn();
    vm.closeAll = jest.fn();
    vm.onOkClick();
    expect(vm.$emit).toBeCalledWith('restart', true);
  })

  it('should call $emit with update:settingShow, false when closeAll is called', () => {
    const wrapper = mount(Settings, {
      localVue,
      vuetify,
    })

    let vm = wrapper.vm;
    vm.$emit = jest.fn();
    vm.closeAll();
    expect(vm.$emit).toBeCalledWith('update:settingShow', false);
  })

})
