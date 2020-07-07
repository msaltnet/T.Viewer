<template>
  <div>
    <v-toolbar color="grey lighten-5 elevation-0" :height="toolbarHeight">
      <v-btn icon class="mx-1">
        <v-icon>mdi-filter</v-icon>
      </v-btn>

      <v-divider class="mx-3" inset vertical></v-divider>

      <v-spacer></v-spacer>

      <v-divider class="mx-3" inset vertical></v-divider>

      <v-btn icon class="mx-1">
        <v-icon>mdi-settings</v-icon>
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
      globalSettings: new GlobalSettings(),
      editorHeight: this.getEditorHeight(),
    }
  },
  computed: {
    btnText() {
      return this.isListenerOn ? 'On' : 'Off';
    }
  },
  created: function() {
    this.logListener = new LogListener(ipcRenderer);
    AceEditor.init(this.globalSettings);
  },
  mounted: function() {
    this.viewer = AceEditor.createViewer(this.$refs.viewer, this.globalSettings);
  },
  methods: {
    onSwitchChanged: function () {
      if (this.isListenerOn) {
        this.listenerTag = this.logListener.registerListener(this.onMessageReceived);
        console.log(this.listenerTag);
      } else {
        this.logListener.unregisterListener(this.listenerTag);
      }
    },
    onMessageReceived: function (msg) {
      let contents = msg.split('\r\n');
      contents.map(line => {
        let show = false;

        if (line.indexOf(this.filter) != -1) {
          show = true;
        }

        return {
          show: show,
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
    },
    getEditorHeight() {
      console.log(window.innerHeight - 56 - 88);
      return window.innerHeight - 56 - 88;
    },
  }
}
</script>
