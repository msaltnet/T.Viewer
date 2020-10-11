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
  describe('LogMonitor.vue', () => {
    it('should call registerListener when listen switch is changed to true', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })

      wrapper.vm.isListenerOn = true;
      wrapper.vm.logListener.registerListener = jest.fn();

      wrapper.vm.onListenSwitchChanged();
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

      vm.onListenSwitchChanged();
      expect(vm.logListener.unregisterListener).toBeCalledTimes(1);
    })

    it('should call registerListener when toggleListenSwitch is called and isListenerOn is false', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })

      wrapper.vm.isListenerOn = false;
      wrapper.vm.logListener.registerListener = jest.fn();

      wrapper.vm.toggleListenSwitch();
      expect(wrapper.vm.logListener.registerListener).toBeCalledTimes(1);
    })

    it('should call unregisterListener when toggleListenSwitch is called and isListenerOn is true', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const vm = wrapper.vm;
      vm.isListenerOn = true;
      vm.logListener.unregisterListener = jest.fn();

      vm.toggleListenSwitch();
      expect(vm.logListener.unregisterListener).toBeCalledTimes(1);
    })
  });

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

  it('should viewer.setFontSize with new fontSize when fontSize is changed', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      setFontSize: jest.fn()
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.$options.watch.fontSize.call(vm, 100)
    expect(vm.viewer.setFontSize).toBeCalledWith('100px');
  })

  it('should call viewer.setValue with "" when onClearClick is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      setValue: jest.fn()
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.onClearClick();
    expect(viewerMock.setValue).toBeCalledWith("");
  })

  it('should call viewer.scrollToLine with session length when autoScroll is true', () => {
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
    vm.autoScroll = true;
    vm.onMessageReceived("mango");
    expect(viewerMock.scrollToLine).toBeCalledWith(500);
  })

  it('should NOT call viewer.scrollToLine with session length when autoScroll is false', () => {
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
    vm.autoScroll = false;
    vm.onMessageReceived("mango");
    expect(viewerMock.scrollToLine).not.toBeCalledWith(500);
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

  it('should call viewer.session.setUseWrapMode correctly when setWrap is called', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const viewerMock = {
      session: {
        setUseWrapMode: jest.fn()
      }
    }
    const vm = wrapper.vm;
    vm.viewer = viewerMock;
    vm.setWrap(true);
    expect(viewerMock.session.setUseWrapMode).toBeCalledWith(true);

    viewerMock.session.setUseWrapMode = jest.fn();
    vm.setWrap(false);
    expect(viewerMock.session.setUseWrapMode).toBeCalledWith(false);
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

  it('should set dialogForTag false when onNameCloseClick is called', () => {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);

    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.dialogForTag = true;

    vm.onNameCloseClick();
    expect(vm.dialogForTag).toEqual(false);
  })

  it('should set newTabName with tabName when onNameCloseClick is called', () => {
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

    vm.onNameCloseClick();
    expect(vm.newTabName).toEqual("banana");
  })

  it('should set dialogForTag false when onNameSaveClick is called', () => {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);

    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })
    const vm = wrapper.vm;
    vm.dialogForTag = true;

    vm.onNameSaveClick();
    expect(vm.dialogForTag).toEqual(false);
  })

  it('should call $emit with "update:tabName" and newTabName when onNameSaveClick is called', () => {
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

    vm.onNameSaveClick();
    expect(vm.$emit).toHaveBeenCalledWith('update:tabName', 'mango');
  })

  describe('Filter', () => {
    describe('Timestamp ON', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = mount(LogMonitor, {
          localVue,
          vuetify,
          propsData: {
            timestamp: true,
          },
        })
      })
      it('should filterLogLevel return true when selected log level index is 0', () => {
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
        const msgTagBanana = "07-10 14:51:21.337+0900 V/Banana( 2617): heart-battery.c banana";
        const msgTagOrange = "07-10 14:51:21.337+0900 F/Orange( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.tagFilter = '';
        expect(vm.filterTag(msgTagBanana)).toEqual(true);
        expect(vm.filterTag(msgTagOrange)).toEqual(true);
      })

      it('should filterTag return correct value when tagRegexSetting is false', () => {
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
        const msgBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c banana";
        const msgOrange = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.messageFilter = '';
        expect(vm.filterMessage(msgBanana)).toEqual(true);
        expect(vm.filterMessage(msgOrange)).toEqual(true);
      })

      it('should filterMessage return correct value when messageRegexSetting is false', () => {
        const msgBanana = "07-10 14:51:21.337+0900 V/RESOURCED( 2617): heart-battery.c banana";
        const msgOrange = "07-10 14:51:21.337+0900 F/RESOURCED( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.messageFilter = 'banana';
        vm.messageRegexSetting = false;
        expect(vm.filterMessage(msgBanana)).toEqual(true);
        expect(vm.filterMessage(msgOrange)).toEqual(false);
      })

      it('should filterMessage return correct value when messageRegexSetting is true', () => {
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

    describe('Timestamp OFF', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = mount(LogMonitor, {
          localVue,
          vuetify,
          propsData: {
            timestamp: false,
          },
        })
      })
      it('should filterLogLevel return true when selected log level index is 0', () => {
        const msgLevel0 = "V/RESOURCED( 2617): heart-battery.c";
        const msgLevel1 = "D/RESOURCED( 2617): heart-battery.c";
        const msgLevel5 = "F/RESOURCED( 2617): heart-battery.c";
        const vm = wrapper.vm;
        vm.logLevelsSelected = vm.logLevels[0];
        expect(vm.filterLogLevel(msgLevel0)).toEqual(true);
        expect(vm.filterLogLevel(msgLevel1)).toEqual(true);
        expect(vm.filterLogLevel(msgLevel5)).toEqual(true);
      })

      it('should filterLogLevel return true when msg log level is 5', () => {
        const msgLevel5 = "F/RESOURCED( 2617): heart-battery.c";
        const vm = wrapper.vm;
        vm.logLevelsSelected = vm.logLevels[3];
        expect(vm.filterLogLevel(msgLevel5)).toEqual(true);

        vm.logLevelsSelected = vm.logLevels[4];
        expect(vm.filterLogLevel(msgLevel5)).toEqual(true);

        vm.logLevelsSelected = vm.logLevels[5];
        expect(vm.filterLogLevel(msgLevel5)).toEqual(true);
      })

      it('should filterLogLevel return true when msg log level and selected level are matched', () => {
        const msgLevel0 = "V/RESOURCED( 2617): heart-battery.c";
        const msgLevel1 = "D/RESOURCED( 2617): heart-battery.c";
        const msgLevel2 = "I/RESOURCED( 2617): heart-battery.c";
        const msgLevel3 = "W/RESOURCED( 2617): heart-battery.c";
        const msgLevel4 = "E/RESOURCED( 2617): heart-battery.c";
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
        const msgTagBanana = "V/Banana( 2617): heart-battery.c banana";
        const msgTagOrange = "F/Orange( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.tagFilter = '';
        expect(vm.filterTag(msgTagBanana)).toEqual(true);
        expect(vm.filterTag(msgTagOrange)).toEqual(true);
      })

      it('should filterTag return correct value when tagRegexSetting is false', () => {
        const msgTagBanana = "V/Banana( 2617): heart-battery.c banana";
        const msgTagOrange = "F/Orange( 2617): heart-battery.c orange";
        const msgTagMangoSpace = "F/Mango   ( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.tagFilter = 'Banana';
        vm.tagRegexSetting = false;
        expect(vm.filterTag(msgTagBanana)).toEqual(true);
        expect(vm.filterTag(msgTagOrange)).toEqual(false);

        vm.tagFilter = 'Mango';
        expect(vm.filterTag(msgTagMangoSpace)).toEqual(true);
      })

      it('should filterTag return correct value when tagRegexSetting is true', () => {
        const msgTagBanana = "V/Banana( 2617): heart-battery.c banana";
        const msgTagBar = "F/Bar( 2617): heart-battery.c orange";
        const msgTagMangoBarSpace = "F/MangoBar   ( 2617): heart-battery.c orange";
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
        const msgBanana = "V/RESOURCED( 2617): heart-battery.c banana";
        const msgOrange = "F/RESOURCED( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.messageFilter = '';
        expect(vm.filterMessage(msgBanana)).toEqual(true);
        expect(vm.filterMessage(msgOrange)).toEqual(true);
      })

      it('should filterMessage return correct value when messageRegexSetting is false', () => {
        const msgBanana = "V/RESOURCED( 2617): heart-battery.c banana";
        const msgOrange = "F/RESOURCED( 2617): heart-battery.c orange";
        const vm = wrapper.vm;
        vm.messageFilter = 'banana';
        vm.messageRegexSetting = false;
        expect(vm.filterMessage(msgBanana)).toEqual(true);
        expect(vm.filterMessage(msgOrange)).toEqual(false);
      })

      it('should filterMessage return correct value when messageRegexSetting is true', () => {
        const msgBanana = "V/RESOURCED( 2617): heart-battery.c banana is yellow";
        const msgOrange = "F/RESOURCED( 2617): heart-battery.c orange";
        const msgMonkeyBanana = "V/RESOURCED( 2617): heart-battery.c monkey 9banana";
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

  describe('Control Button', () => {
    const BTN_INDEX_AUTO_SCROLL = 0;
    const BTN_INDEX_WRAP = 1;

    it('should call setWrap correctly when onChangeControlButton is called', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const vm = wrapper.vm;
      vm.setWrap = jest.fn();
      vm.controlButtonStates = [0];
      vm.onChangeControlButton();
      expect(vm.setWrap).toBeCalledWith(true);

      vm.setWrap = jest.fn();
      vm.controlButtonStates = [1];
      vm.onChangeControlButton();
      expect(vm.setWrap).toBeCalledWith(false);
    })

    it('should set autoScroll correctly when onChangeControlButton is called', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const vm = wrapper.vm;
      vm.setWrap = jest.fn();
      vm.autoScroll = true;
      vm.controlButtonStates = [0];
      vm.onChangeControlButton();
      expect(vm.autoScroll).toEqual(false);

      vm.autoScroll = false;
      vm.controlButtonStates = [1];
      vm.onChangeControlButton();
      expect(vm.autoScroll).toEqual(true);
    })

    it('should set button state when setToggleButton is called', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const vm = wrapper.vm;
      vm.controlButtonStates = [BTN_INDEX_AUTO_SCROLL];
      vm.setToggleButton(BTN_INDEX_AUTO_SCROLL, false);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_AUTO_SCROLL)).toEqual(-1);

      vm.setToggleButton(BTN_INDEX_AUTO_SCROLL, true);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_AUTO_SCROLL)).not.toEqual(-1);

      vm.controlButtonStates = [BTN_INDEX_WRAP];
      vm.setToggleButton(BTN_INDEX_WRAP, false);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_WRAP)).toEqual(-1);

      vm.controlButtonStates = [BTN_INDEX_WRAP];
      vm.setToggleButton(BTN_INDEX_WRAP, true);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_WRAP)).not.toEqual(-1);
    })

    it('should set button when toggleControlButtonAndState is called', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const viewerMock = {
        session: {
          setUseWrapMode: jest.fn()
        }
      }
      const vm = wrapper.vm;
      vm.viewer = viewerMock;
      vm.controlButtonStates = [BTN_INDEX_AUTO_SCROLL, BTN_INDEX_WRAP];
      vm.toggleControlButtonAndState(BTN_INDEX_AUTO_SCROLL);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_AUTO_SCROLL)).toEqual(-1);

      vm.toggleControlButtonAndState(BTN_INDEX_WRAP);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_WRAP)).toEqual(-1);

      vm.toggleControlButtonAndState(BTN_INDEX_AUTO_SCROLL);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_AUTO_SCROLL)).not.toEqual(-1);

      vm.toggleControlButtonAndState(BTN_INDEX_WRAP);
      expect(vm.controlButtonStates.indexOf(BTN_INDEX_WRAP)).not.toEqual(-1);
    })

    it('should set control state when toggleControlButtonAndState is called', () => {
      const wrapper = mount(LogMonitor, {
        localVue,
        vuetify,
      })
      const viewerMock = {
        session: {
          setUseWrapMode: jest.fn()
        }
      }
      const vm = wrapper.vm;
      vm.viewer = viewerMock;
      vm.autoScroll = true;
      vm.softWrap = true;
      vm.controlButtonStates = [BTN_INDEX_AUTO_SCROLL, BTN_INDEX_WRAP];
      vm.toggleControlButtonAndState(BTN_INDEX_AUTO_SCROLL);
      expect(vm.autoScroll).toEqual(false);

      vm.toggleControlButtonAndState(BTN_INDEX_AUTO_SCROLL);
      expect(vm.autoScroll).toEqual(true);

      vm.toggleControlButtonAndState(BTN_INDEX_WRAP);
      expect(vm.softWrap).toEqual(false);

      vm.toggleControlButtonAndState(BTN_INDEX_WRAP);
      expect(vm.softWrap).toEqual(true);
    })

  })
})
