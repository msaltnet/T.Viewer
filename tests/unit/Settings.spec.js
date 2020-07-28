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

  it('should set timestamp and sdbClear when syncInitValue is called', () => {
    const wrapper = mount(Settings, {
      localVue,
      vuetify,
      propsData: {
        sdbTimestamp: 'banana',
        sdbClearStart: 'mango'
      },
    })

    let vm = wrapper.vm;
    vm.syncInitValue();
    expect(vm.timestamp).toEqual('banana');
    expect(vm.sdbClear).toEqual('mango');
  })

  describe('closeAll', () => {
    it('should call syncInitValue when closeAll is called', () => {
      const wrapper = mount(Settings, {
        localVue,
        vuetify,
      })

      let vm = wrapper.vm;
      vm.syncInitValue = jest.fn();
      vm.closeAll();
      expect(vm.syncInitValue).toBeCalledTimes(1);
    })

    it('should set confirmDialog false when closeAll is called', () => {
      const app = document.createElement('div');
      app.setAttribute('data-app', true);
      document.body.append(app);

      const wrapper = mount(Settings, {
        localVue,
        vuetify,
      })

      let vm = wrapper.vm;
      vm.confirmDialog = true;
      vm.closeAll();
      expect(vm.confirmDialog).toEqual(false);
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

  describe('onOkClick', () => {

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

    it('should call $emit with update:sdbTimestamp, this.timestamp when onOkClick is called', () => {
      const wrapper = mount(Settings, {
        localVue,
        vuetify,
      })

      let vm = wrapper.vm;
      vm.$emit = jest.fn();
      vm.timestamp = 'apple';
      vm.onOkClick();
      expect(vm.$emit).toBeCalledWith('update:sdbTimestamp', 'apple');
    })

    it('should call $emit with update:sdbClearStart, this.sdbClear when onOkClick is called', () => {
      const wrapper = mount(Settings, {
        localVue,
        vuetify,
      })

      let vm = wrapper.vm;
      vm.$emit = jest.fn();
      vm.sdbClear = 'orange';
      vm.onOkClick();
      expect(vm.$emit).toBeCalledWith('update:sdbClearStart', 'orange');
    })
  })
})
