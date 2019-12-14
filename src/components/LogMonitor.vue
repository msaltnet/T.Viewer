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
    </v-row>
  </v-container>
</template>

<script>
import LogListener from '../LogListener';
import { ipcRenderer } from 'electron';

export default {
  data: () => ({
      message: 'No Log',
      isListenerOn: true,
      logListener: new LogListener(ipcRenderer),
  }),
  computed: {
    btnText() {
      return this.isListenerOn ? 'On' : 'Off';
    }
  },
  methods: {
    onStartButton: function () {
      if (this.isListenerOn) {
        this.isListenerOn = false;
        this.logListener.registerListener((msg) => {
          this.message = msg;
        });
      } else {
        this.isListenerOn = true;
        this.logListener.unregisterListener();
      }
    }
  }
};
</script>
