import AceEditor from '@/AceEditor.js'
import ace from "ace-builds"

describe('AceEditor', () => {
    beforeEach(() => {
    })

    it('should call setOptions with correct options when createViewer is called', () => {
        AceEditor.createViewer("mango", 100);
        let options = ace.setOptions.mock.calls[0][0];
        expect(options.readOnly).toEqual(true);
        expect(options.highlightActiveLine).toEqual(false);
        expect(options.showPrintMargin).toEqual(false);
        expect(options.mode).toEqual("ace/mode/log");
        expect(options.fontFamily).toEqual("Consolas, monaco, 'Courier New', Courier, monospace");
        expect(options.fontSize).toEqual('100px');
    })

    it('should return correct rule when createRule is called', () => {
        let rule = AceEditor.createRule();
        expect(rule[0].token).toEqual("verbose");
        expect(rule[0].regex).toEqual("^V.*|^[0-9].{23}V.*");
        expect(rule[1].token).toEqual("debug");
        expect(rule[1].regex).toEqual("^D.*|^[0-9].{23}D.*");
        expect(rule[2].token).toEqual("info");
        expect(rule[2].regex).toEqual("^I.*|^[0-9].{23}I.*");
        expect(rule[3].token).toEqual("warning");
        expect(rule[3].regex).toEqual("^W.*|^[0-9].{23}W.*");
        expect(rule[4].token).toEqual("error");
        expect(rule[4].regex).toEqual("^E.*|^[0-9].{23}E.*");
        expect(rule[5].token).toEqual("fatal");
        expect(rule[5].regex).toEqual("^F.*|^[0-9].{23}F.*");
    })

})
