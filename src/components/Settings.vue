<template>
  <div>

    <v-dialog
      v-model="settingShow"
      persistent
      min-width="500"
      max-width="700"
    >
      <v-card>
        <v-card-title class="headline">Settings</v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-checkbox
                v-model="timestamp"
                label="dlog timestamp option"
                v-on:change="onChangeTimestampOption()"
              ></v-checkbox>
            </v-row>
            <v-row>
              <v-text-field
                readonly
                label="Example"
                :value="sampleLogMessage"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="sdbClear"
                label="SDB clear first"
                v-on:change="onChangeSdbClearOption()"
              ></v-checkbox>
            </v-row>
            <v-row>
              <v-text-field
                readonly
                label="Command"
                :value="sampleSdbCommand"
              ></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeAll()"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="confirmDialog = true"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="title yellow lighten-2" primary-title>
          ⚠️ Warning
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
            It is necessary to restart the application to apply changes
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeAll()">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="onOkClick()">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const SAMPLE_LOG_WITH_TIMESTAMP = '07-10 14:51:21.337+0900 D/RESOURCED( 2617): heart-battery.c';
const SAMPLE_LOG = 'D/RESOURCED( 2617): heart-battery.c';
const SAMPLE_SDB_CMD_WITH_CLEAR = '$sdb dlog -c && sdb dlog';
const SAMPLE_SDB_CMD = '$sdb dlog';
export default {
  props: ['settingShow', 'sdbClearStart', 'sdbTimestamp'],
  data: function () {
    return {
      confirmDialog: false,
      timestamp: true,
      sdbClear: true,
      sampleLogMessage: SAMPLE_LOG_WITH_TIMESTAMP,
      sampleSdbCommand: SAMPLE_SDB_CMD_WITH_CLEAR
    }
  },
  computed: {
  },
  watch: {
    sdbTimestamp: function (newValue) {
      this.timestamp = newValue;
    },
    sdbClearStart: function (newValue) {
      this.sdbClear = newValue;
    }
  },
  created: function () {
    this.syncInitValue();
  },
  mounted: function () {
  },
  methods: {
    syncInitValue: function () {
      this.timestamp = this.sdbTimestamp;
      this.sdbClear = this.sdbClearStart;
    },
    onChangeTimestampOption: function () {
      this.sampleLogMessage = this.timestamp ? SAMPLE_LOG_WITH_TIMESTAMP : SAMPLE_LOG;
    },
    onChangeSdbClearOption: function () {
      this.sampleSdbCommand = this.sdbClear ? SAMPLE_SDB_CMD_WITH_CLEAR : SAMPLE_SDB_CMD;
    },
    onOkClick: function () {
      this.$emit('update:sdbTimestamp', this.timestamp);
      this.$emit('update:sdbClearStart', this.sdbClear);
      this.closeAll();
      this.$emit('restart', true);
    },
    closeAll: function () {
      this.confirmDialog = false
      this.syncInitValue();
      this.$emit('update:settingShow', false);
    }
  }
}
</script>
