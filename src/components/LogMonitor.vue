<template>
  <v-container>
    <v-row
      text-center
      wrap
    >
      <v-btn
        v-bind:outlined="!isListenerOn"
        block
        color="primary"
        v-on:click="onStartButton"
        >
        {{ btnText }}
      </v-btn>
      {{ message }}
      <div ref="viewer" :style="{'height': '500px', 'width': '100%'}"></div>
    </v-row>
  </v-container>
</template>

<script>
import AceEditor from '../aceEditor';
import LogListener from '../LogListener';
import GlobalSettings from '../globalSettings';
import { ipcRenderer } from 'electron';
export default {
  props: ['listenSwitch', 'listenerId', 'filter'],
  data: () => ({
      message: 'No Log Bom',
      isListenerOn: true,
      globalSettings: new GlobalSettings()
  }),
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
    onStartButton: function () {
      console.log(this.listenerId);
      if (this.isListenerOn) {
        this.isListenerOn = false;
        this.listenerTag = this.logListener.registerListener(this.onMessageReceived);
        console.log(this.listenerTag);
      } else {
        this.isListenerOn = true;
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
    }
  }
}
</script>
