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

  it('should call viewer.scrollToLine with session length when onMessageReceived is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      insert: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.onMessageReceived("mango");
    expect(viewerMock.scrollToLine).toBeCalledWith(500);
  })

  it('should NOT call viewer.scrollToLine with session length when onMessageReceived is called with null', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      insert: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.onMessageReceived();
    expect(viewerMock.scrollToLine).not.toBeCalled();
  })

  it('should call viewer.navigateLineEnd when onMessageReceived is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      insert: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.onMessageReceived("mango");
    expect(viewerMock.navigateLineEnd).toBeCalled();
  })

  it('should call viewer.insert when onMessageReceived is called, filterLogLevel return true', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      insert: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.filterLogLevel = jest.fn().mockReturnValue(true);
    vm.onMessageReceived("mango");
    expect(viewerMock.insert).toBeCalledWith("mango");
  })

  it('should call viewer.insert when onMessageReceived is called with multi-line, filterLogLevel return true', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      insert: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.filterLogLevel = jest.fn().mockReturnValue(true);
    vm.onMessageReceived("mango\r\norange");
    expect(viewerMock.insert).toHaveBeenCalledTimes(2);
  })

  it('should NOT call viewer.insert when onMessageReceived is called, filterLogLevel return false', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      insert: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.filterLogLevel = jest.fn().mockReturnValue(false);
    vm.onMessageReceived("mango");
    expect(viewerMock.insert).not.toBeCalled();
  })

  it('should filterLogLevel return true when selected log level index is 0', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgLevel0 = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c";
    const msgLevel1 = "07-10 14:51:21.337+0900 D/RESOURCED( 2617): heart-battery.c";
    const msgLevel5 = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c";
    const vm = wrapper.vm;
    vm.logLevelsSelected = vm.logLevels[0];
    expect(vm.filterLogLevel(msgLevel0)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel1)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel5)).toEqual(true);
  })

  it('should filterLogLevel return true when msg log level is 5', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgLevel5 = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c";
    const vm = wrapper.vm;
    vm.logLevelsSelected = vm.logLevels[3];
    expect(vm.filterLogLevel(msgLevel5)).toEqual(true);

    vm.logLevelsSelected = vm.logLevels[4];
    expect(vm.filterLogLevel(msgLevel5)).toEqual(true);

    vm.logLevelsSelected = vm.logLevels[5];
    expect(vm.filterLogLevel(msgLevel5)).toEqual(true);
  })

  it('should filterLogLevel return true when msg log level and selected level are matched', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgLevel0 = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c";
    const msgLevel1 = "07-10 14:51:21.337+0900 D/RESOURCED( 2617): heart-battery.c";
    const msgLevel2 = "07-10 14:51:21.337+0900 I/RESOURCED( 2617): heart-battery.c";
    const msgLevel3 = "07-10 14:51:21.337+0900 W/RESOURCED( 2617): heart-battery.c";
    const msgLevel4 = "07-10 14:51:21.337+0900 E/RESOURCED( 2617): heart-battery.c";
    const vm = wrapper.vm;
    vm.logLevelsSelected = vm.logLevels[1];
    expect(vm.filterLogLevel(msgLevel0)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel1)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel2)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel3)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel4)).toEqual(true);

    vm.logLevelsSelected = vm.logLevels[2];
    expect(vm.filterLogLevel(msgLevel0)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel1)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel2)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel3)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel4)).toEqual(true);

    vm.logLevelsSelected = vm.logLevels[3];
    expect(vm.filterLogLevel(msgLevel0)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel1)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel2)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel3)).toEqual(true);
    expect(vm.filterLogLevel(msgLevel4)).toEqual(true);

    vm.logLevelsSelected = vm.logLevels[4];
    expect(vm.filterLogLevel(msgLevel0)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel1)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel2)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel3)).toEqual(false);
    expect(vm.filterLogLevel(msgLevel4)).toEqual(true);
  })

  it('should filterTag return true when messageFilter is empty string', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgTagBanana = "07-10 14:51:21.337+0900 V/Banana( 2617): heart-battery.c banana";
    const msgTagOrange = "07-10 14:51:21.337+0900 F/Orange( 2617): heart-battery.c orange";
    const vm = wrapper.vm;
    vm.tagFilter = '';
    expect(vm.filterTag(msgTagBanana)).toEqual(true);
    expect(vm.filterTag(msgTagOrange)).toEqual(true);
  })

  it('should filterTag return correct value', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgTagBanana = "07-10 14:51:21.337+0900 V/Banana( 2617): heart-battery.c banana";
    const msgTagOrange = "07-10 14:51:21.337+0900 F/Orange( 2617): heart-battery.c orange";
    const msgTagMangoSpace = "07-10 14:51:21.337+0900 F/Mango   ( 2617): heart-battery.c orange";
    const vm = wrapper.vm;
    vm.tagFilter = 'Banana';
    expect(vm.filterTag(msgTagBanana)).toEqual(true);
    expect(vm.filterTag(msgTagOrange)).toEqual(false);

    vm.tagFilter = 'Mango';
    expect(vm.filterTag(msgTagMangoSpace)).toEqual(true);
  })

  it('should filterMessage return true when messageFilter is empty string', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c banana";
    const msgOrange = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c orange";
    const vm = wrapper.vm;
    vm.messageFilter = '';
    expect(vm.filterMessage(msgBanana)).toEqual(true);
    expect(vm.filterMessage(msgOrange)).toEqual(true);
  })

  it('should filterMessage return correct value', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const msgBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c banana";
    const msgOrange = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c orange";
    const vm = wrapper.vm;
    vm.messageFilter = 'banana';
    expect(vm.filterMessage(msgBanana)).toEqual(true);
    expect(vm.filterMessage(msgOrange)).toEqual(false);
  })

  it('should return correct height when getEditorHeight is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    window.innerHeight = 500;
    // "- 88 - 64" is temporary value
    expect(vm.getEditorHeight()).toEqual(500 - 88 - 64);
  })

  it('should call addEventListener with handleResize when mounted is called', () => {
    window.addEventListener = jest.fn();
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    expect(window.addEventListener).toBeCalledWith('resize', vm.handleResize);
  })

})
