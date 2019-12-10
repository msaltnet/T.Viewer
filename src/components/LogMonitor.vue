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
// import LogListener from './LogListener';

export default {
  data: () => ({
      message: 'No Log',
      isListenerOn: true,
  }),
  computed: {
    btnText() {
      return this.isListenerOn ? 'On' : 'Off';
    }
  },
  methods: {
    onStartButton: function () {
      this.isListenerOn = this.isListenerOn ? false: true;
    }
  }
};
</script>
