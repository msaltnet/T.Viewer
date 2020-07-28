<template>
  <v-app>
    <v-app-bar app min-width=400>

      <v-toolbar-title class="headline">
        <span class="font-weight-light">T.Viewer</span>
      </v-toolbar-title>

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
        prepend-icon="mdi-power"
        class="mx-1"
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

        <v-tab v-for="(tab, i) in tabs" :key="tab.id" :title="tab.name" :href="'#tab' + tab.id">
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
            tabName="MAIN"
            isMain="true"
            v-bind:fontSize="fontSize"
          />
        </v-tab-item>

        <v-tab-item v-for="tab in tabs" :key="tab.id" :value="'tab' + tab.id" >
          <LogMonitor
            v-bind:listenerId="'listener-' + tab.id"
            v-bind:tabName.sync="tab.name"
            isMain="false"
            v-bind:fontSize="fontSize"
          />
        </v-tab-item>
      </v-tabs-items>

      <Settings
        v-bind:settingShow.sync="settingShow"
        :sdbClearStart.sync="sdbClearStart"
        :sdbTimestamp.sync="sdbTimestamp"
        @restart="restartForSetting"
      />
    </v-content>
  </v-app>
</template>

<script>
import LogMonitor from './components/LogMonitor';
import Settings from './components/Settings';
import { ipcRenderer } from 'electron';
const POWER_EVENT_CHANNEL = "change-power";

export default {
  name: 'App',
  components: {
    LogMonitor,
    Settings
  },
  data: () => ({
    settingShow: false,
    sdbClearStart: false,
    sdbTimestamp: false,
    fontSize: 15,
    fontSizeList: [13, 15, 17, 19, 21, 23],
    fontSizeIndex: 1,
    increamentalId: 0,
    tabs: [],
    currentItem: 'tab-main',
    switchListen: false
  }),
  methods: {
    getNewTabId: function () {
      return this.increamentalId++;
    },
    onFontUpButtonClick: function () {
      if (this.fontSizeIndex + 1 < this.fontSizeList.length) {
        this.fontSizeIndex++;
        this.fontSize = this.fontSizeList[this.fontSizeIndex];
      }
    },
    onFontDownButtonClick: function () {
      if (this.fontSizeIndex - 1 >= 0) {
        this.fontSizeIndex--;
        this.fontSize = this.fontSizeList[this.fontSizeIndex];
      }
    },
    onSwitchChange: function () {
      let command = '';
      if (this.switchListen)
        command = 'start';

      ipcRenderer.send(POWER_EVENT_CHANNEL, command);
    },
    createNewTab: function () {
      let id = this.getNewTabId();
      this.tabs.push({id: id, name: "tab-" + id});
    },
    closeTab: function (index) {
      this.tabs.splice(index, 1);
    },
    restartForSetting: function (restart) {
      console.log('restart: ' + restart);
    }
  }
};
</script>
