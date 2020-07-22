<template>
  <v-app>
    <v-app-bar app>

      <v-toolbar-title class="headline">
        <span class="font-weight-light">T.Viewer</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="mx-1">
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
        >Main</v-tab>

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
            v-bind:listenSwitch="switchListen"
            listenerId="listener-0"
            filter=''
          />
        </v-tab-item>

        <v-tab-item v-for="tab in tabs" :key="tab.id" :value="'tab' + tab.id" >
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            v-bind:listenerId="'listener-' + tab.id"
            filter=""
          />
        </v-tab-item>
      </v-tabs-items>

    </v-content>
  </v-app>
</template>

<script>
import LogMonitor from './components/LogMonitor';
import { ipcRenderer } from 'electron';
const POWER_EVENT_CHANNEL = "change-power";

export default {
  name: 'App',
  components: {
    LogMonitor,
  },
  data: () => ({
    increamentalId: 0,
    tabs: [],
    currentItem: 'tab-main',
    switchListen: false
  }),
  methods: {
    getNewTabId: function () {
      return this.increamentalId++;
    },
    onSwitchChange: function () {
      let command = '';
      if (this.switchListen)
        command = 'start';

      ipcRenderer.send(POWER_EVENT_CHANNEL, command);
    },
    createNewTab() {
      let id = this.getNewTabId();
      this.tabs.push({id: id, name: "tab-" + id});
    },
    closeTab(index) {
      this.tabs.splice(index, 1);
    },
  }
};
</script>
