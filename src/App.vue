<template>
  <v-app>
    <v-app-bar app>

      <v-toolbar-title class="headline">
        <span class="font-weight-light">T.Viewer</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="mx-1">
        <v-icon>mdi-filter</v-icon>
      </v-btn>

      <v-btn icon class="mx-1">
        <v-icon>mdi-settings</v-icon>
      </v-btn>

      <v-switch
        dense
        hide-details
        v-model="switchListen"
        v-on:change="onSwitchChange"
        class="mx-1"
        :label="`Listen: ${switchListen?'On':'Off'}`"
      ></v-switch>

      <template v-slot:extension>
        <v-tabs
          align-with-title
          v-model="currentItem"
          background-color="transparent"
        >
          <v-tab
            :href="'#tab-main'"
          >main</v-tab>
          <v-tab
            :href="'#tab-1'"
          >ft.1</v-tab>
          <v-tab
            :href="'#tab-2'"
          >ft.2</v-tab>
          <v-tab
            :href="'#tab-3'"
          >ft.3</v-tab>
          <v-tab
            :href="'#tab-4'"
          >ft.4</v-tab>
          <v-tab
            :href="'#tab-5'"
          >ft.5</v-tab>
          <v-tab
            :href="'#tab-6'"
          >ft.6</v-tab>
          <v-tab
            :href="'#tab-7'"
          >ft.7</v-tab>
          <v-tab
            :href="'#tab-8'"
          >ft.8</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-content>

      <v-tabs-items v-model="currentItem">
        <v-tab-item
          :value="'tab-main'"
        >
          MAIN TAB
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listenerId="listener-0"
            filter=""
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-1'"
        >
          TAB-1 filter="W_HOME"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-1"
            filter="W_HOME"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-2'"
        >
          TAB-2 filter="CAPI"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-2"
            filter="CAPI"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-3'"
        >
          TAB-3 filter="watchface"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-3"
            filter="watchface"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-4'"
        >
          TAB-4 filter="watch_app_main"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-4"
            filter="watch_app_main"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-5'"
        >
          TAB-5 filter="MANAGER"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-5"
            filter="MANAGER"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-6'"
        >
          TAB-6 filter="CORE"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-6"
            filter="CORE"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-7'"
        >
          TAB-7 filter="SOUND"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-7"
            filter="SOUND"
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-8'"
        >
          TAB-8 filter="samsung"
          <LogMonitor
            v-bind:listenSwitch="switchListen"
            listener-id="listener-8"
            filter="samsung"
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
    currentItem: 'tab-main',
    switchListen: false
  }),
  methods: {
    onSwitchChange: function () {
      let command = '';
      if (this.switchListen)
        command = 'start';

      ipcRenderer.send(POWER_EVENT_CHANNEL, command);
    }
  }
};
</script>