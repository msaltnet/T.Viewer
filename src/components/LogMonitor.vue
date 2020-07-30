<template>
  <div>
    <v-toolbar color="grey lighten-5 elevation-0" :height="toolbarHeight">
      <v-tooltip bottom v-if="isMain != 'true'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click.stop="dialog = true">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>
        <span>Tag: {{ getTagFilter }}</span><br>
        <span>Message: {{ getMessageFilter }}</span>
      </v-tooltip>

      <v-divider class="mx-3" inset vertical v-if="isMain != 'true'"></v-divider>
      <v-flex xs4>
        <v-menu
          :offset-y="true"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              x-small
              min-width="120"
              color="blue-grey lighten-3"
              v-bind="attrs"
              v-on="on"
            >
              {{ logLevelsSelected }}
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(item, index) in logLevels"
              :key="index"
              @click="onLevelClicked(item)"
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>

      <v-spacer></v-spacer>

      <v-divider class="mx-3" inset vertical></v-divider>

      <v-btn-toggle
        v-model="controlButtonStates"
        color="primary"
        dense
        group
        multiple
        v-on:change="onChangeControlButton()"
      >
        <v-btn :value="1" text>
          <v-icon>mdi-wrap</v-icon>
        </v-btn>

        <v-btn :value="2" text>
          <v-icon>mdi-format-align-bottom</v-icon>
        </v-btn>
      </v-btn-toggle>

      <v-divider class="mx-3" inset vertical></v-divider>

      <v-btn icon class="mx-1"
        @click="onClearClick()">
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn icon class="mx-1"
        @click="dialogForTag = !dialogForTag"
        v-if="isMain != 'true'"
      >
        <v-icon>mdi-tag</v-icon>
      </v-btn>

      <v-switch
        dense
        hide-details
        color="indigo"
        v-model="isListenerOn"
        prepend-icon="mdi-download"
        v-on:change="onSwitchChanged"
        class="mx-1"
      ></v-switch>

    </v-toolbar>

    <div ref="viewer" :style="{'height': editorHeight + 'px'}"></div>

    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">{{ tabName }} Filter Settings</v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="9">
                <v-text-field label="Tag" v-model="tagFilter"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="tagRegexSetting"
                  label="regex"
                  v-on:change="onChangeTagRegex()"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-text-field label="Message" v-model="messageFilter"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="messageRegexSetting"
                  label="regex"
                  v-on:change="onChangeMessageRegex()"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogForTag"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Tab Name
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newTabName"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="onNameCloseClick()"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="onNameSaveClick()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import AceEditor from '../AceEditor';
import LogListener from '../LogListener';
import GlobalSettings from '../globalSettings';
import { ipcRenderer } from 'electron';

const LOG_LEVEL_POSITION = 0;
const LOG_LEVEL_POSITION_WITH_TIMESTAMP = 24;
const TAG_POSITION = 2;
const TAG_POSITION_WITH_TIMESTAMP = 26;
const APPBAR_TOOLBAR_HEIGHT = 64 + 88;
export default {
  props: ['listenerId', 'tabName', 'isMain', 'fontSize', 'timestamp'],
  data: function () {
    return {
      controlButtonStates: [2],
      autoScroll: true,
      dialog: false,
      dialogForTag: false,
      newTabName: '',
      toolbarHeight: 40,
      isListenerOn: false,
      tagFilter: '',
      messageFilter: '',
      tagRegexSetting: false,
      tagRegex: null,
      messageRegexSetting: false,
      messageRegex: null,
      newLineChar: '\n',
      logLevelPosition: LOG_LEVEL_POSITION_WITH_TIMESTAMP,
      tagPosition: TAG_POSITION_WITH_TIMESTAMP,
      logLevels: ["Verbose", "Debug", "Info", "Warning", "Error", "Fatal"],
      logLevelChars: ["V", "D", "I", "W", "E", "F"],
      logLevelsSelected: "Verbose", //TO DO load from settings
      globalSettings: new GlobalSettings(),
      editorHeight: this.getEditorHeight(),
    }
  },
  computed: {
    getTagFilter: function() {
      return this.tagFilter == '' ? '-' : this.tagFilter;
    },
    getMessageFilter: function() {
      return this.messageFilter == '' ? '-' : this.messageFilter;
    }
  },
  watch: {
    fontSize: function (fontSize) {
      this.viewer.setFontSize(fontSize + "px");
    },
    timestamp: function (timestamp) {
      this.updateTimestamp(timestamp);
    }
  },
  created: function() {
    this.logListener = new LogListener(ipcRenderer);
    AceEditor.init();
    this.newTabName = this.tabName;
    this.updateTimestamp(this.timestamp);
    if (process.platform === 'win32') {
      this.newLineChar = '\r\n';
    }
  },
  mounted: function() {
    this.viewer = AceEditor.createViewer(this.$refs.viewer, this.globalSettings);
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    updateTimestamp: function (timestamp) {
      this.logLevelPosition = timestamp ? LOG_LEVEL_POSITION_WITH_TIMESTAMP : LOG_LEVEL_POSITION;
      this.tagPosition = timestamp ? TAG_POSITION_WITH_TIMESTAMP : TAG_POSITION;
    },
    onChangeControlButton: function () {
      if (this.controlButtonStates.indexOf(1) != -1)
        this.setWrap(true);
      else
        this.setWrap(false);

      if (this.controlButtonStates.indexOf(2) != -1)
        this.autoScroll = true;
      else
        this.autoScroll = false;
    },
    onChangeTagRegex: function () {
      if (this.tagRegexSetting)
        this.tagRegex = new RegExp(this.tagFilter, 'u');
    },
    onChangeMessageRegex: function () {
      if (this.messageRegexSetting)
        this.messageRegex = new RegExp(this.messageFilter, 'u');
    },
    onNameCloseClick: function () {
      this.newTabName = this.tabName;
      this.dialogForTag = false;
    },
    onNameSaveClick: function () {
      let str = this.newTabName;
      this.$emit('update:tabName', str);
      this.dialogForTag = false;
    },
    onClearClick: function () {
      this.viewer.setValue('');
    },
    onLevelClicked: function (selectedLevel) {
      this.logLevelsSelected = selectedLevel;
    },
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
        let contents = msg.split(this.newLineChar);

        contents.map(line => {
          return {
            show: this.filterLogLevel(line) && this.filterTag(line) && this.filterMessage(line),
            line: line
          };
        })
        .filter(line => line.show)
        .map(line => {
          let session = this.viewer.session;
          session.insert({
            row: session.getLength(),
            column: 0
          }, line.line);
          return line;
        });

        if (this.autoScroll)
          this.viewer.scrollToLine(this.viewer.session.getLength());
      } catch {
        console.log("Invaild log text is received!");
      }
    },
    setWrap: function (on) {
      this.viewer.session.setUseWrapMode(on);
    },
    handleResize() {
      this.editorHeight = this.getEditorHeight();
    },
    getEditorHeight: function () {
      // console.log(window.innerHeight - 64 - 88);
      return window.innerHeight - APPBAR_TOOLBAR_HEIGHT;
    },
    // 07-10 14:51:21.337+0900 I/RESOURCED( 2617): heart-battery.c:....
    filterLogLevel: function (line) {
      let logLevelIndex = this.logLevels.indexOf(this.logLevelsSelected);
      let logChar = line.substr(this.logLevelPosition, 1);

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
    },
    // 07-10 14:51:21.337+0900 I/RESOURCED( 2617): heart-battery.c:....
    filterTag: function (line) {
      if (this.tagFilter == '')
        return true;

      let tagEndIndex = line.indexOf('(');
      let tag = line.substring(this.tagPosition, tagEndIndex);
      tag = tag.replace(/\s/g, '');
      if (!this.tagRegexSetting)
        return tag === this.tagFilter;

      return this.tagRegex.test(tag);
    },
    // 07-10 14:51:21.337+0900 I/RESOURCED( 2617): heart-battery.c:....
    filterMessage: function (line) {
      if (this.messageFilter == '')
        return true;

      if (!this.messageRegexSetting)
        return -1 != line.indexOf(this.messageFilter);

      return this.messageRegex.test(line);
    },
  }
}
</script>
