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

  it('should create tagRegex instance when onChangeTagRegex is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.tagFilter = 'Bana';
    vm.tagRegex = null;
    vm.tagRegexSetting = true;
    vm.onChangeTagRegex();
    expect(vm.tagRegex).not.toEqual(null);
  })

  it('should create messageRegex instance when onChangeMessageRegex is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.messageFilter = 'Bana';
    vm.messageRegex = null;
    vm.messageRegexSetting = true;
    vm.onChangeMessageRegex();
    expect(vm.messageRegex).not.toEqual(null);
  })

  it('should call viewer.setValue with "" when onClearClicked is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      setValue: jest.fn()
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.onClearClicked();
    expect(viewerMock.setValue).toBeCalledWith("");
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
        getLength: jest.fn().mockReturnValue(500),
        insert: jest.fn()
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
        getLength: jest.fn().mockReturnValue(500),
        insert: jest.fn()
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.onMessageReceived();
    expect(viewerMock.scrollToLine).not.toBeCalled();
  })

  it('should call viewer.session.insert when onMessageReceived is called, filterLogLevel return true', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      session: {
        getLength: jest.fn().mockReturnValue(500),
        insert: jest.fn()
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.filterLogLevel = jest.fn().mockReturnValue(true);
    vm.onMessageReceived("mango");
    let calledOption = viewerMock.session.insert.mock.calls[0][0];
    expect(viewerMock.session.insert).toBeCalledWith(expect.any(Object), "mango");
    expect(calledOption.row).toEqual(500);
    expect(calledOption.column).toEqual(0);
  })

  it('should call viewer.insert when onMessageReceived is called with multi-line, filterLogLevel return true', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      scrollToLine: jest.fn(),
      navigateLineEnd: jest.fn(),
      session: {
        insert: jest.fn(),
        getLength: jest.fn().mockReturnValue(500)
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.filterLogLevel = jest.fn().mockReturnValue(true);
    vm.onMessageReceived("mango\r\norange");
    let calledOption = viewerMock.session.insert.mock.calls[0][0];
    expect(viewerMock.session.insert).toHaveBeenCalledTimes(2);
    expect(calledOption.row).toEqual(500);
    expect(calledOption.column).toEqual(0);
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

  it('should set dialogForTag false when onNameCloseClicked is called', () => {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);

    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.dialogForTag = true;

    vm.onNameCloseClicked();
    expect(vm.dialogForTag).toEqual(false);
  })

  it('should set newTabName with tabName when onNameCloseClicked is called', () => {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);

    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
      propsData: {
        tabName: 'banana',
      },
    })
    const vm = wrapper.vm;
    vm.newTabName = 'mango';

    vm.onNameCloseClicked();
    expect(vm.newTabName).toEqual("banana");
  })

  it('should set dialogForTag false when onNameSaveClicked is called', () => {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);

    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.dialogForTag = true;

    vm.onNameSaveClicked();
    expect(vm.dialogForTag).toEqual(false);
  })

  it('should call $emit with "update:tabName" and newTabName when onNameSaveClicked is called', () => {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);

    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.newTabName = "mango";
    vm.$emit = jest.fn();

    vm.onNameSaveClicked();
    expect(vm.$emit).toHaveBeenCalledWith('update:tabName', 'mango');
  })

  describe('Filter', () => {
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

    it('should filterTag return true when tagFilter is empty string', () => {
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

    it('should filterTag return correct value when tagRegexSetting is false', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const msgTagBanana = "07-10 14:51:21.337+0900 V/Banana( 2617): heart-battery.c banana";
      const msgTagOrange = "07-10 14:51:21.337+0900 F/Orange( 2617): heart-battery.c orange";
      const msgTagMangoSpace = "07-10 14:51:21.337+0900 F/Mango   ( 2617): heart-battery.c orange";
      const vm = wrapper.vm;
      vm.tagFilter = 'Banana';
      vm.tagRegexSetting = false;
      expect(vm.filterTag(msgTagBanana)).toEqual(true);
      expect(vm.filterTag(msgTagOrange)).toEqual(false);

      vm.tagFilter = 'Mango';
      expect(vm.filterTag(msgTagMangoSpace)).toEqual(true);
    })

    it('should filterTag return correct value when tagRegexSetting is true', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const msgTagBanana = "07-10 14:51:21.337+0900 V/Banana( 2617): heart-battery.c banana";
      const msgTagBar = "07-10 14:51:21.337+0900 F/Bar( 2617): heart-battery.c orange";
      const msgTagMangoBarSpace = "07-10 14:51:21.337+0900 F/MangoBar   ( 2617): heart-battery.c orange";
      const vm = wrapper.vm;
      vm.tagFilter = '^Ba';
      vm.tagRegexSetting = true;
      vm.onChangeTagRegex();
      expect(vm.filterTag(msgTagBanana)).toEqual(true);
      expect(vm.filterTag(msgTagBar)).toEqual(true);
      expect(vm.filterTag(msgTagMangoBarSpace)).toEqual(false);

      vm.tagFilter = '.*Bar';
      vm.tagRegexSetting = true;
      vm.onChangeTagRegex();
      expect(vm.filterTag(msgTagBanana)).toEqual(false);
      expect(vm.filterTag(msgTagBar)).toEqual(true);
      expect(vm.filterTag(msgTagMangoBarSpace)).toEqual(true);

      vm.tagFilter = 'Bar$';
      vm.tagRegexSetting = true;
      vm.onChangeTagRegex();
      expect(vm.filterTag(msgTagBanana)).toEqual(false);
      expect(vm.filterTag(msgTagBar)).toEqual(true);
      expect(vm.filterTag(msgTagMangoBarSpace)).toEqual(true);
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

    it('should filterMessage return correct value when messageRegexSetting is false', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const msgBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c banana";
      const msgOrange = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c orange";
      const vm = wrapper.vm;
      vm.messageFilter = 'banana';
      vm.messageRegexSetting = false;
      expect(vm.filterMessage(msgBanana)).toEqual(true);
      expect(vm.filterMessage(msgOrange)).toEqual(false);
    })

    it('should filterMessage return correct value when messageRegexSetting is true', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const msgBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c banana is yellow";
      const msgOrange = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c orange";
      const msgMonkeyBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c monkey 9banana";
      const vm = wrapper.vm;
      vm.messageFilter = 'an';
      vm.messageRegexSetting = true;
      vm.onChangeMessageRegex();
      expect(vm.filterMessage(msgBanana)).toEqual(true);
      expect(vm.filterMessage(msgOrange)).toEqual(true);
      expect(vm.filterMessage(msgMonkeyBanana)).toEqual(true);

      vm.messageFilter = 'na$';
      vm.onChangeMessageRegex();
      expect(vm.filterMessage(msgBanana)).toEqual(false);
      expect(vm.filterMessage(msgOrange)).toEqual(false);
      expect(vm.filterMessage(msgMonkeyBanana)).toEqual(true);

      vm.messageFilter = '[0-9]banana';
      vm.onChangeMessageRegex();
      expect(vm.filterMessage(msgBanana)).toEqual(false);
      expect(vm.filterMessage(msgOrange)).toEqual(false);
      expect(vm.filterMessage(msgMonkeyBanana)).toEqual(true);
    })

  })
})
