<template>
  <div>
    <v-toolbar color="grey lighten-5 elevation-0" :height="toolbarHeight">
      <v-btn icon class="mx-1">
        <v-icon>mdi-filter</v-icon>
      </v-btn>

      <v-divider class="mx-3" inset vertical></v-divider>
      <v-flex xs4>
          <v-select dense v-model="logLevelsSelected" :items="logLevels"></v-select>
      </v-flex>
      <v-spacer></v-spacer>

      <v-divider class="mx-3" inset vertical></v-divider>

      <v-btn icon class="mx-1">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-switch
        dense
        hide-details
        v-model="isListenerOn"
        v-on:change="onSwitchChanged"
        class="mx-1"
        :label="'Listen'"
      ></v-switch>
    </v-toolbar>

    <div ref="viewer" :style="{'height': editorHeight + 'px'}"></div>
  </div>
</template>

<script>
import AceEditor from '../aceEditor';
import LogListener from '../LogListener';
import GlobalSettings from '../globalSettings';
import { ipcRenderer } from 'electron';
export default {
  props: ['listenSwitch', 'listenerId', 'filter'],
  data: function () {
    return {
      toolbarHeight: 40,
      isListenerOn: false,
      logLevels: ["Verbose", "Debug", "Info", "Warning", "Error", "Fatal"],
      logLevelChars: ["V", "D", "I", "W", "E", "F"],
      logLevelsSelected: "Verbose", //TO DO load from settings
      globalSettings: new GlobalSettings(),
      editorHeight: this.getEditorHeight(),
    }
  },
  computed: {
  },
  created: function() {
    this.logListener = new LogListener(ipcRenderer);
    AceEditor.init(this.globalSettings);
  },
  mounted: function() {
    this.viewer = AceEditor.createViewer(this.$refs.viewer, this.globalSettings);
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    onSwitchChanged: function () {
      if (this.isListenerOn) {
        this.listenerTag = this.logListener.registerListener(this.onMessageReceived);
        // console.log(this.listenerTag);
      } else {
        this.logListener.unregisterListener(this.listenerTag);
      }
    },
    onMessageReceived: function (msg) {
      try {
        let contents = msg.split('\r\n');

        contents.map(line => {
          return {
            show: this.filterLogLevel(line),
            line: line
          };
        })
        .filter(line => line.show)
        .map(line => {
          this.viewer.navigateLineEnd();
          this.viewer.insert(line.line);
          return line;
        });

        this.viewer.scrollToLine(this.viewer.session.getLength());
      } catch {
        console.log("Invaild log text is received!");
      }
    },
    handleResize() {
      this.editorHeight = this.getEditorHeight();
    },
    getEditorHeight: function () {
      // console.log(window.innerHeight - 56 - 88);
      return window.innerHeight - 56 - 88;
    },
    // 07-10 14:51:21.337+0900 I/RESOURCED( 2617): heart-battery.c:....
    filterLogLevel: function (line) {
      const LOG_LEVEL_CHAR_START_POSITION = 24;
      let logLevelIndex = this.logLevels.indexOf(this.logLevelsSelected);
      let logChar = line.substr(LOG_LEVEL_CHAR_START_POSITION,1);

      if (logLevelIndex == 0 || this.logLevelChars[5] == logChar)
        return true;

      if (this.logLevelChars[4] == logChar) {
        return logLevelIndex <= 4;
      } else if (this.logLevelChars[3] == logChar) {
        return logLevelIndex <= 3;
      } else if (this.logLevelChars[2] == logChar) {
        return logLevelIndex <= 2;
      } else if (this.logLevelChars[1] == logChar) {
        return logLevelIndex <= 1;
      } else {
        return logLevelIndex == 0;
      }
    }
  }
}
</script>
