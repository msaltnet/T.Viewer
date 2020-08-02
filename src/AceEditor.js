import ace from "ace-builds"
import 'ace-builds/webpack-resolver';

export default class AceEditor {
    static init() {
        ace.define('ace/mode/log', (require, exports) => {
            const oop = require("ace/lib/oop");
            const TextMode = require("ace/mode/text").Mode;
            const LogHighlightRules = require("ace/mode/log_highlight_rules").LogHighlightRules;

            const Mode = function() {
                this.HighlightRules = LogHighlightRules;
            };
            oop.inherits(Mode, TextMode);

            exports.Mode = Mode;
        });

        ace.define('ace/mode/log_highlight_rules', (require, exports) => {
            const oop = require("ace/lib/oop");
            const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

            const LogHighlightRules = function() {
                this.$rules = {
                    start: AceEditor.createRule()
                };
            }

            oop.inherits(LogHighlightRules, TextHighlightRules);
            exports.LogHighlightRules = LogHighlightRules;
        });
    }

    static createRule() {
        //07-10 14:51:21.337+0900 D/RESOURCED( 2617): heart-battery.c:....
        //D/RESOURCED( 2617): heart-battery.c:....

        const verboseRule = {
            token: "verbose",
            regex: "^V.*|^[0-9].{23}V.*"
        };

        const debugRule = {
            token: "debug",
            regex: "^D.*|^[0-9].{23}D.*"
        };

        const infoRule = {
            token: "info",
            regex: "^I.*|^[0-9].{23}I.*"
        };

        const warningRule = {
            token: "warning",
            regex: "^W.*|^[0-9].{23}W.*"
        };

        const errorRule = {
            token: "error",
            regex: "^E.*|^[0-9].{23}E.*"
        };

        const fatalRule = {
            token: "fatal",
            regex: "^F.*|^[0-9].{23}F.*"
        };

        return [verboseRule, debugRule, infoRule, warningRule, errorRule, fatalRule];
    }

    static createViewer(DOMElement, fontSize) {
        const viewer = ace.edit(DOMElement);

        viewer.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            showPrintMargin: false,
            mode: "ace/mode/log",
            fontFamily: "Consolas, monaco, 'Courier New', Courier, monospace",
            fontSize: fontSize + "px"
        });

        return viewer;
    }
}
