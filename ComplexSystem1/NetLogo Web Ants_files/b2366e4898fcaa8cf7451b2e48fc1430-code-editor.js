(function() {
  window.RactiveModelCodeComponent = Ractive.extend({
    data: function() {
      return {
        code: void 0, // String
        isReadOnly: void 0, // Boolean
        lastCompiledCode: void 0, // String
        lastCompileFailed: false, // Boolean
        procedureNames: {}, // Object[String, Number]
        autoCompleteStatus: false, // Boolean
        codeUsage: [], // Array[{pos: CodeMirror.Pos, lineNumber: Number, line: String }]
        usageVisibility: false, // Boolean
        selectedCode: void 0, // String
        usageLeft: void 0, // String
        usageTop: void 0 // String
      };
    },
    components: {
      codeEditor: RactiveCodeContainerMultiline
    },
    computed: {
      isStale: '(code !== lastCompiledCode) || lastCompileFailed'
    },
    // (String) => Unit
    setCode: function(code) {
      this.findComponent('codeEditor').setCode(code);
    },
    setupProceduresDropdown: function() {
      $('#procedurenames-dropdown').chosen({
        search_contains: true
      });
      $('#procedurenames-dropdown').on('change', () => {
        var index, procedureNames, selectedProcedure;
        procedureNames = this.get('procedureNames');
        selectedProcedure = $('#procedurenames-dropdown').val();
        index = procedureNames[selectedProcedure];
        return this.findComponent('codeEditor').highlightProcedure(selectedProcedure, index);
      });
      $('#procedurenames-dropdown').on('chosen:showing_dropdown', () => {
        return this.setProcedureNames();
      });
    },
    getProcedureNames: function() {
      var codeString, procedureCheck, procedureMatch, procedureNames;
      codeString = this.get('code');
      procedureNames = {};
      procedureCheck = /^\s*(?:to|to-report)\s(?:\s*;.*\n)*\s*(\w\S*)/gm;
      while ((procedureMatch = procedureCheck.exec(codeString))) {
        procedureNames[procedureMatch[1]] = procedureMatch.index + procedureMatch[0].length;
      }
      return procedureNames;
    },
    setProcedureNames: function() {
      var procedureNames;
      procedureNames = this.getProcedureNames();
      this.set('procedureNames', procedureNames);
      $('#procedurenames-dropdown').trigger('chosen:updated');
    },
    setupAutoComplete: function(hintList) {
      var editor;
      CodeMirror.registerHelper('hintWords', 'netlogo', hintList);
      editor = this.findComponent('codeEditor').getEditor();
      editor.on('keyup', (cm, event) => {
        if (!cm.state.completionActive && event.keyCode > 64 && event.keyCode < 91 && this.get('autoCompleteStatus')) {
          return cm.showHint({
            completeSingle: false
          });
        }
      });
    },
    netLogoHintHelper: function(cm, options) {
      var cur, found, from, term, to, token;
      cur = cm.getCursor();
      token = cm.getTokenAt(cur);
      to = CodeMirror.Pos(cur.line, token.end);
      if (token.string && /\S/.test(token.string[token.string.length - 1])) {
        term = token.string;
        from = CodeMirror.Pos(cur.line, token.start);
      } else {
        term = '';
        from = to;
      }
      found = options.words.filter(function(word) {
        return word.slice(0, term.length) === term;
      });
      if (found.length > 0) {
        return {
          list: found,
          from: from,
          to: to
        };
      }
    },
    autoCompleteWords: function() {
      var allKeywords, supportedKeywords;
      allKeywords = new Set(window.keywords.all);
      supportedKeywords = Array.from(allKeywords).filter(function(kw) {
        return !window.keywords.unsupported.includes(kw);
      }).map(function(kw) {
        return kw.replace("\\", "");
      });
      return Object.keys(this.getProcedureNames()).concat(supportedKeywords);
    },
    toggleLineComments: function(editor) {
      var anchor, cursor, end, head, start;
      ({start, end} = (editor.somethingSelected()) ? (({head, anchor} = editor.listSelections()[0]), (head.line > anchor.line || (head.line === anchor.line && head.ch > anchor.ch)) ? {
        start: anchor,
        end: head
      } : {
        start: head,
        end: anchor
      }) : (cursor = editor.getCursor(), {
        start: cursor,
        end: cursor
      }));
      if (!editor.uncomment(start, end)) {
        editor.lineComment(start, end);
      }
    },
    setupCodeUsagePopup: function() {
      var codeUsageMap, editor;
      editor = this.findComponent('codeEditor').getEditor();
      codeUsageMap = {
        'Ctrl-U': () => {
          if (editor.somethingSelected()) {
            return this.setCodeUsage();
          }
        },
        'Cmd-U': () => {
          if (editor.somethingSelected()) {
            return this.setCodeUsage();
          }
        },
        'Ctrl-;': () => {
          this.toggleLineComments(editor);
        },
        'Cmd-;': () => {
          this.toggleLineComments(editor);
        }
      };
      editor.addKeyMap(codeUsageMap);
      editor.on('cursorActivity', (cm) => {
        if (this.get('usageVisibility')) {
          return this.set('usageVisibility', false);
        }
      });
    },
    getCodeUsage: function() {
      var check, codeString, codeUsage, editor, line, lineNumber, match, pos, selectedCode;
      editor = this.findComponent('codeEditor').getEditor();
      selectedCode = editor.getSelection().trim();
      this.set('selectedCode', selectedCode);
      codeString = this.get('code');
      check = new RegExp(selectedCode, "gm");
      codeUsage = [];
      while ((match = check.exec(codeString))) {
        pos = editor.posFromIndex(match.index);
        lineNumber = pos.line + 1;
        line = editor.getLine(pos.line);
        codeUsage.push({pos, lineNumber, line});
      }
      return codeUsage;
    },
    setCodeUsage: function() {
      var codeUsage, editor, pos;
      codeUsage = this.getCodeUsage();
      editor = this.findComponent('codeEditor').getEditor();
      this.set('codeUsage', codeUsage);
      pos = editor.cursorCoords(editor.getCursor());
      this.set('usageLeft', pos.left);
      this.set('usageTop', pos.top);
      this.set('usageVisibility', true);
    },
    on: {
      'complete': function(_) {
        this.setupProceduresDropdown();
        CodeMirror.registerHelper('hint', 'fromList', this.netLogoHintHelper);
        this.setupAutoComplete(this.autoCompleteWords());
        this.setupCodeUsagePopup();
      },
      'recompile': function(_) {
        this.setupAutoComplete(this.autoCompleteWords());
      },
      'jump-to-usage': function(context, usagePos) {
        var editor, end, selectedCode, start;
        editor = this.findComponent('codeEditor').getEditor();
        selectedCode = this.get('selectedCode');
        end = usagePos;
        start = CodeMirror.Pos(end.line, end.ch + selectedCode.length);
        editor.setSelection(start, end);
        this.set('usageVisibility', false);
      }
    },
    // coffeelint: disable=max_line_length
    template: `<div class="netlogo-tab-content netlogo-code-container"
     grow-in='{disable:"code-tab-toggle"}' shrink-out='{disable:"code-tab-toggle"}'>
  <ul class="netlogo-codetab-widget-list">
    <li class="netlogo-codetab-widget-listitem">
      <select class="netlogo-procedurenames-dropdown" id="procedurenames-dropdown" data-placeholder="Jump to Procedure" tabindex="2">
        {{#each procedureNames:name}}
          <option value="{{name}}">{{name}}</option>
        {{/each}}
      </select>
    </li>
    <li class="netlogo-codetab-widget-listitem">
      {{# !isReadOnly }}
        <button class="netlogo-widget netlogo-ugly-button netlogo-recompilation-button{{#isEditing}} interface-unlocked{{/}}"
            on-click="recompile" {{# !isStale }}disabled{{/}} >Recompile Code</button>
      {{/}}
    </li>
    <li class="netlogo-codetab-widget-listitem">
      <input type='checkbox' class="netlogo-autocomplete-checkbox" checked='{{autoCompleteStatus}}'>
      <label class="netlogo-autocomplete-label">
        Auto Complete {{# autoCompleteStatus}}Enabled{{else}}Disabled{{/}}
      </label>
    </li>
  </ul>
  <codeEditor id="netlogo-code-tab-editor" code="{{code}}"
              injectedConfig="{ lineNumbers: true, readOnly: {{isReadOnly}} }"
              extraClasses="['netlogo-code-tab']" />
</div>
<div class="netlogo-codeusage-popup" style="left: {{usageLeft}}px; top: {{usageTop}}px;">
  {{# usageVisibility}}
    <ul class="netlogo-codeusage-list">
      {{#each codeUsage}}
        <li class="netlogo-codeusage-item" on-click="[ 'jump-to-usage', this.pos ]">{{this.lineNumber}}: {{this.line}}</li>
      {{/each}}
    </ul>
  {{/}}
</div>`
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=code-editor.js.map
