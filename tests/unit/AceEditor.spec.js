import AceEditor from '@/AceEditor.js'
import ace from "ace-builds"

describe('AceEditor', () => {
    beforeEach(() => {
    })

    it('should call define when init is called', () => {
        AceEditor.init();
        expect(ace.define).toBeCalledWith('ace/mode/log', expect.any(Function));
        expect(ace.define).toBeCalledWith('ace/mode/log_highlight_rules', expect.any(Function));
        console.log(ace.define.mock.calls[0][1]);
        console.log(ace.define.mock.calls[1][0]);
        let logCB = ace.define.mock.calls[0][1];
        let mockRequire = jest.fn();
        let mockInherits = jest.fn();
        let dummyReturn = {Mode: 'orange', inherits: mockInherits, LogHighlightRules: 'apple'};
        mockRequire.mockReturnValue(dummyReturn);
        let mockExports = jest.fn();
        logCB(mockRequire, mockExports);
        mockExports.Mode();
        expect(mockRequire).toBeCalledTimes(3)
        expect(mockInherits).toBeCalledTimes(1);
        expect(mockExports.Mode).toEqual(expect.any(Function));

        let mockRequire2 = jest.fn();
        let mockInherits2 = jest.fn();
        let dummyReturn2 = {Mode: 'orange', inherits: mockInherits2, TextHighlightRules: 'banana'};
        mockRequire2.mockReturnValue(dummyReturn2);
        let mockExports2 = jest.fn();
        let logHighlightCB = ace.define.mock.calls[1][1];
        logHighlightCB(mockRequire2, mockExports2);
        mockExports2.LogHighlightRules();
        expect(mockRequire2).toBeCalledTimes(2)
        expect(mockInherits2).toBeCalledTimes(1);
        expect(mockExports2.LogHighlightRules).toEqual(expect.any(Function));
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
