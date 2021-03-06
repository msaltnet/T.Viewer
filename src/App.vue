<template>
  <v-app>
    <v-app-bar app min-width=400>

      <v-toolbar-title class="headline">
        <span class="font-weight-light">T.Viewer</span>
      </v-toolbar-title>
      <v-chip
        class="ma-2 ml-10"
        dense
        :color="stateColor"
        :text-color="stateTextColor"
      >
        {{ stateText }}
      </v-chip>
      <v-spacer></v-spacer>

      <v-btn icon class="mx-1"
        @click="onFontDownButtonClick()">
        <v-icon>mdi-format-font-size-decrease</v-icon>
      </v-btn>

      <v-btn icon class="mx-1"
        @click="onFontUpButtonClick()">
        <v-icon>mdi-format-font-size-increase</v-icon>
      </v-btn>

      <v-btn icon class="mx-1"
        v-on:click="settingShow = true"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-switch
        dense
        hide-details
        color="red"
        v-model="switchListen"
        v-on:change="onSwitchChange"
        prepend-icon="mdi-connection"
        class="mx-1"
        :disabled="state!='connected'"
      ></v-switch>
    </v-app-bar>

    <v-content>
      <v-tabs
        align-with-title
        v-model="currentItem"
        background-color="transparent"
      >
        <v-tab
          :href="'#tab-main'"
        >MAIN</v-tab>

        <v-tab v-for="(tab, i) in tabs" :key="tab.id" :title="tab.name" :href="'#' + tab.id">
          {{ tab.name }}
          <v-btn icon class="align-self-center ml-1" @click.stop.prevent="closeTab(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-tab>

        <v-btn icon class="align-self-center" color="grey darken-1" @click="createNewTab()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>

      </v-tabs>

      <v-tabs-items v-model="currentItem">
        <v-tab-item
          :value="'tab-main'">
          <LogMonitor
            listenerId="listener-0"
            tabId="MAIN"
            tabName="MAIN"
            isMain="true"
            v-bind:fontSize="fontSize"
            v-bind:timestamp="sdbTimestamp"
            v-bind:keyEventQ="mainTabKeyEvent.q"
            v-bind:keyEventW="mainTabKeyEvent.w"
            v-bind:keyEventE="mainTabKeyEvent.e"
            v-bind:keyEventSpace="mainTabKeyEvent.space"
          />
        </v-tab-item>

        <v-tab-item v-for="tab in tabs" :key="tab.id" :value="tab.id" >
          <LogMonitor
            v-bind:listenerId="'listener-' + tab.id"
            v-bind:tabId="tab.id"
            v-bind:tabName.sync="tab.name"
            isMain="false"
            v-bind:fontSize="fontSize"
            v-bind:timestamp="sdbTimestamp"
            v-bind:keyEventQ="tab.keyEvent.q"
            v-bind:keyEventW="tab.keyEvent.w"
            v-bind:keyEventE="tab.keyEvent.e"
            v-bind:keyEventSpace="tab.keyEvent.space"
            @storeInfo="storeTabInfo"
          />
        </v-tab-item>
      </v-tabs-items>

      <Settings
        v-bind:settingShow.sync="settingShow"
        :sdbClearStart.sync="sdbClearStart"
        :sdbTimestamp.sync="sdbTimestamp"
        @restart="powerOff"
      />
    </v-content>
  </v-app>
</template>

<script>
import LogMonitor from './components/LogMonitor';
import Settings from './components/Settings';
import StateListener from './StateListener';
import { ipcRenderer } from 'electron';
import Store from './ElectronStoreWrapper';
import Mousetrap from "mousetrap";

const KeyEventList = ['q', 'w', 'e', 'space'];
const store = new Store();
const POWER_EVENT_CHANNEL = "change-power";
const STATE_CHIP_COLOR = {
  NONE: {
    color: 'gray',
    textColor: 'blue-grey darken-3',
    text: 'Not Connected'
  },
  ERROR: {
    color: 'red',
    textColor: 'white',
    text: 'Error - Check SDB Connection'
  },
  MULTI: {
    color: 'orange',
    textColor: 'white',
    text: 'Too Many Devices'
  },
  CONNECTED: {
    color: 'green',
    textColor: 'white',
    text: 'Connected'
  }
}
export default {
  name: 'App',
  components: {
    LogMonitor,
    Settings
  },
  data: () => ({
    state: 'none',
    stateColor: STATE_CHIP_COLOR.NONE.color,
    stateTextColor: STATE_CHIP_COLOR.NONE.textColor,
    stateText: STATE_CHIP_COLOR.NONE.text,
    settingShow: false,
    sdbClearStart: true,
    sdbTimestamp: true,
    fontSize: 15,
    fontSizeList: [9, 11, 13, 15, 17, 19, 21, 23, 25, 27],
    tabs: [],
    mainTabKeyEvent: {q: false, w: false, e: false, space: false},
    currentItem: 'tab-main',
    switchListen: false
  }),
  created: function() {
    var self = this;
    this.stateListener = new StateListener(ipcRenderer);
    this.stateListener.registerListener(this.onStateReceived);
    this.restoreSettings();
    this.restoreTabInfo();

    Mousetrap.bind('ctrl+q', function() {
        self.onKeyEvent('q');
        return false;
    });
    Mousetrap.bind('ctrl+w', function() {
        self.onKeyEvent('w');
        return false;
    });
    Mousetrap.bind('ctrl+e', function() {
        self.onKeyEvent('e');
        return false;
    });
    Mousetrap.bind('ctrl+space', function() {
        self.onKeyEvent('space');
        return false;
    });
    Mousetrap.bind('ctrl+=', function() {
        self.onFontUpButtonClick();
        return false;
    });
    Mousetrap.bind('ctrl+-', function() {
        self.onFontDownButtonClick();
        return false;
    });
  },
  watch: {
    sdbClearStart: function () {
      this.storeSettings();
    },
    sdbTimestamp: function () {
      this.storeSettings();
    }
  },
  methods: {
    storeTabInfo: function () {
      store.set('tabInfo', this.tabs);
    },
    restoreTabInfo: function () {
      let tabInfo = store.get('tabInfo');

      if (tabInfo) {
        this.tabs = tabInfo;
        this.tabs.forEach(tab => {
          if (!tab.keyEvent) {
            let keyEvent = {};
            KeyEventList.forEach(element => keyEvent[element] = false);
            tab.keyEvent = keyEvent;
          }
        });
      }
    },
    storeSettings: function () {
      let settings = {
        fontSize: this.fontSize,
        sdbClearStart: this.sdbClearStart,
        sdbTimestamp: this.sdbTimestamp
      };
      store.set('settings', settings);
    },
    restoreSettings: function () {
      let settings = store.get('settings');
      if (!settings)
        return;

      if (typeof settings.fontSize != 'undefined')
        this.fontSize = settings.fontSize;

      if (typeof settings.sdbClearStart != 'undefined')
        this.sdbClearStart = settings.sdbClearStart;

      if (typeof settings.sdbTimestamp != 'undefined')
        this.sdbTimestamp = settings.sdbTimestamp;
    },
    onStateReceived: function (state) {
      if (state == 'error') {
        this.switchListen = false;
        this.stateColor = STATE_CHIP_COLOR.ERROR.color;
        this.stateTextColor = STATE_CHIP_COLOR.ERROR.textColor;
        this.stateText = STATE_CHIP_COLOR.ERROR.text;
        this.state = state;
      } else if (state == 'multi-connected') {
        this.switchListen = false;
        this.stateColor = STATE_CHIP_COLOR.MULTI.color;
        this.stateTextColor = STATE_CHIP_COLOR.MULTI.textColor;
        this.stateText = STATE_CHIP_COLOR.MULTI.text;
        this.state = state;
      } else if (state.indexOf('connected') == 0) {
        let id = state.slice(10);
        this.stateColor = STATE_CHIP_COLOR.CONNECTED.color;
        this.stateTextColor = STATE_CHIP_COLOR.CONNECTED.textColor;
        this.stateText = id;
        this.state = 'connected';
      } else {
        this.switchListen = false;
        this.stateColor = STATE_CHIP_COLOR.NONE.color;
        this.stateTextColor = STATE_CHIP_COLOR.NONE.textColor;
        this.stateText = STATE_CHIP_COLOR.NONE.text;
        this.state = 'none';
      }
    },
    getNewTabId: function () {
      return Date.now().toString();
    },
    onFontUpButtonClick: function () {
      for (let i = 0; i < this.fontSizeList.length; i++) {
        if (this.fontSize < this.fontSizeList[i]) {
          this.fontSize = this.fontSizeList[i];
          this.storeSettings();
          return;
        }
      }
    },
    onFontDownButtonClick: function () {
      for (let i = this.fontSizeList.length - 1; i >= 0; i--) {
        if (this.fontSize > this.fontSizeList[i]) {
          this.fontSize = this.fontSizeList[i];
          this.storeSettings();
          return;
        }
      }
    },
    onSwitchChange: function () {
      let command = '';
      if (this.switchListen) {
        command = this.sdbClearStart ? 'clear' : 'start';
        if (this.sdbTimestamp)
          command += '-time';
      }
      ipcRenderer.send(POWER_EVENT_CHANNEL, command);
    },
    onKeyEvent: function(event) {
      if (!KeyEventList.includes(event))
        return;

      if (this.currentItem == 'tab-main') {
        this.mainTabKeyEvent[event] = !this.mainTabKeyEvent[event];
        return;
      }

      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].id == this.currentItem) {
          this.tabs[i].keyEvent[event] = !this.tabs[i].keyEvent[event];
          return;
        }
      }
    },
    createNewTab: function () {
      let id = "tab" + this.getNewTabId();
      let name = "tab-" + id.slice(id.length-4);
      let keyEvent = {};
      KeyEventList.forEach(element => keyEvent[element] = false);
      this.tabs.push({id: id, name: name, keyEvent: keyEvent});
      this.storeTabInfo();
    },
    closeTab: function (index) {
      this.tabs.splice(index, 1);
      this.storeTabInfo();
    },
    powerOff: function () {
      this.switchListen = false;
      ipcRenderer.send(POWER_EVENT_CHANNEL, '');
    }
  }
};
</script>
