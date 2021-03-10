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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text
              v-bind="attrs"
              v-on="on">
              <v-icon>mdi-format-align-bottom</v-icon>
            </v-btn>
          </template>
          <span>Auto Scroll<br>ctrl + q</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text
              v-bind="attrs"
              v-on="on">
              <v-icon>mdi-wrap</v-icon>
            </v-btn>
          </template>
          <span>Soft Wrap<br>ctrl + w</span>
        </v-tooltip>

      </v-btn-toggle>

      <v-divider class="mx-3" inset vertical></v-divider>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="onClearClick()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Clear<br>ctrl + e</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="dialogForTag = !dialogForTag"
            v-if="isMain != 'true'">
            <v-icon>mdi-tag</v-icon>
          </v-btn>
        </template>
        <span>Tab Name</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="onLoadFromMainClick()"
            v-if="isMain != 'true'"
            :disabled="isListenerOn">
            <v-icon>mdi-import</v-icon>
          </v-btn>
        </template>
        <span>Load from MAIN</span>
      </v-tooltip>

      <v-switch
        dense
        hide-details
        color="indigo"
        v-model="isListenerOn"
        prepend-icon="mdi-download"
        v-on:change="onListenSwitchChanged"
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
                <v-text-field label="Tag" v-model="tagFilter"
                  v-on:change="storeSettings()"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="tagRegexSetting"
                  label="regex"
                  v-on:change="onChangeTagRegex()"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-text-field label="Message" v-model="messageFilter"
                  v-on:change="storeSettings()"
                ></v-text-field>
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
import { ipcRenderer } from 'electron';
import Store from '../ElectronStoreWrapper';

const BTN_INDEX_AUTO_SCROLL = 0;
const BTN_INDEX_WRAP = 1;
const store = new Store();
const LOG_LEVEL_POSITION = 0;
const LOG_LEVEL_POSITION_WITH_TIMESTAMP = 24;
const TAG_POSITION = 2;
const TAG_POSITION_WITH_TIMESTAMP = 26;
const APPBAR_TOOLBAR_HEIGHT = 64 + 88;
export default {
  props: ['tabId', 'tabName', 'isMain', 'fontSize', 'timestamp', 'keyEventQ', 'keyEventW', 'keyEventE', 'keyEventSpace'],
  data: function () {
    return {
      autoScroll: true,
      softWrap: false,
      controlButtonStates: [BTN_INDEX_AUTO_SCROLL],
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
      logLevelsSelected: "Verbose",
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
    },
    keyEventQ: function () {
      this.toggleControlButtonAndState(BTN_INDEX_AUTO_SCROLL);
    },
    keyEventW: function () {
      this.toggleControlButtonAndState(BTN_INDEX_WRAP);
    },
    keyEventE: function () {
      this.onClearClick();
    },
    keyEventSpace: function () {
      this.toggleListenSwitch();
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
    this.viewer = AceEditor.createViewer(this.$refs.viewer, this.fontSize);
    if (this.isMain === "true") {
      this.$root.mainEditor = this.viewer;
    }
    window.addEventListener('resize', this.handleResize);
    this.restoreSettings();
  },
  destroyed: function() {
    store.delete(this.tabId);
  },
  methods: {
    storeSettings: function () {
      let key = this.tabId;
      let settings = {
        autoScroll: this.autoScroll,
        softWrap: this.softWrap,
        logLevelsSelected: this.logLevelsSelected,
        tagRegexSetting: this.tagRegexSetting,
        tagFilter: this.tagFilter,
        messageRegexSetting: this.messageRegexSetting,
        messageFilter: this.messageFilter
      };
      store.set(key, settings);
    },
    restoreSettings: function () {
      let key = this.tabId;
      let settings = store.get(key);

      if (!settings)
        return;

      this.autoScroll = settings.autoScroll;
      this.setToggleButton(BTN_INDEX_WRAP, this.autoScroll);
      this.setWrap(settings.softWrap);
      this.setToggleButton(BTN_INDEX_AUTO_SCROLL, settings.softWrap);
      this.logLevelsSelected = settings.logLevelsSelected;
      this.tagRegexSetting = settings.tagRegexSetting;
      this.tagFilter = settings.tagFilter;
      if (this.tagRegexSetting)
        this.tagRegex = new RegExp(this.tagFilter, 'u');

      this.messageRegexSetting = settings.messageRegexSetting;
      this.messageFilter = settings.messageFilter;
      if (this.messageRegexSetting)
        this.messageRegex = new RegExp(this.messageFilter, 'u');
    },
    toggleControlButtonAndState: function (type) {
      let index = this.controlButtonStates.indexOf(type);
      let setState = true;
      if (index == -1) {
        this.controlButtonStates.push(type);
        setState = true;
      } else {
        this.controlButtonStates.splice(index, 1);
        setState = false;
      }

      if (type == BTN_INDEX_WRAP)
        this.setWrap(setState);
      else if (type == BTN_INDEX_AUTO_SCROLL)
        this.autoScroll = setState;

      this.storeSettings();
    },
    setToggleButton: function (type, on) {
      let index = this.controlButtonStates.indexOf(type);

      if (on) {
        if (index == -1)
          this.controlButtonStates.push(type);
      } else {
        if (index != -1)
          this.controlButtonStates.splice(index, 1);
      }
      this.storeSettings();
    },
    updateTimestamp: function (timestamp) {
      this.logLevelPosition = timestamp ? LOG_LEVEL_POSITION_WITH_TIMESTAMP : LOG_LEVEL_POSITION;
      this.tagPosition = timestamp ? TAG_POSITION_WITH_TIMESTAMP : TAG_POSITION;
    },
    onChangeControlButton: function () {
      if (this.controlButtonStates.indexOf(0) != -1)
        this.setWrap(true);
      else
        this.setWrap(false);

      if (this.controlButtonStates.indexOf(1) != -1)
        this.autoScroll = true;
      else
        this.autoScroll = false;

      this.storeSettings();
    },
    onChangeTagRegex: function () {
      if (this.tagRegexSetting)
        this.tagRegex = new RegExp(this.tagFilter, 'u');
      this.storeSettings();
    },
    onChangeMessageRegex: function () {
      if (this.messageRegexSetting)
        this.messageRegex = new RegExp(this.messageFilter, 'u');
      this.storeSettings();
    },
    onNameCloseClick: function () {
      this.newTabName = this.tabName;
      this.dialogForTag = false;
    },
    onNameSaveClick: function () {
      let str = this.newTabName;
      this.$emit('update:tabName', str);
      this.$emit('storeInfo', true);
      this.dialogForTag = false;
    },
    onClearClick: function () {
      this.viewer.setValue('');
    },
    onLoadFromMainClick: function () {
      this.viewer.setValue('');
      let mainContents = this.$root.mainEditor.session.getDocument().$lines;
      for (let line of mainContents) {
        this.onMessageReceived(line + "\n");
      }
    },
    onLevelClicked: function (selectedLevel) {
      this.logLevelsSelected = selectedLevel;
      this.storeSettings();
    },
    toggleListenSwitch: function () {
      if (!this.isListenerOn) {
        this.isListenerOn = true;
        this.listenerTag = this.logListener.registerListener(this.onMessageReceived);
      } else {
        this.isListenerOn = false;
        this.logListener.unregisterListener(this.listenerTag);
      }
    },
    onListenSwitchChanged: function () {
      if (this.isListenerOn) {
        this.listenerTag = this.logListener.registerListener(this.onMessageReceived);
      } else {
        this.logListener.unregisterListener(this.listenerTag);
      }
    },
    onMessageReceived: function (msg) {
      try {
        let contents = msg.split(this.newLineChar);
        contents.map(line => {
          line = line.replace("\u001B[31;1m", "");
          line = line.replace("\u001B[33;1m", "");
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
      this.softWrap = on;
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
