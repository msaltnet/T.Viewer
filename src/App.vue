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
          />
        </v-tab-item>
        <v-tab-item
          :value="'tab-1'"
        >
          TAB-1
          </v-tab-item>
        <v-tab-item
          :value="'tab-2'"
        >
          TAB-2
        </v-tab-item>
      </v-tabs-items>

    </v-content>
  </v-app>
</template>

<script>
import LogMonitor from './components/LogMonitor';

export default {
  name: 'App',
  components: {
    LogMonitor,
  },
  data: () => ({
    currentItem: 'tab-main',
    switchListen: false
  }),
};
</script>
