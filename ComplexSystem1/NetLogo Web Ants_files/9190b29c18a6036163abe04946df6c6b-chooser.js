(function() {
  var ChooserEditForm;

  ChooserEditForm = EditForm.extend({
    data: function() {
      return {
        choices: void 0, // String
        display: void 0, // String
        setHiddenInput: (function(code) { // We do this so we can validate the contents of the CodeMirror input --JAB (5/14/18)
          var elem, ex, validityStr;
          elem = this.find(`#${this.get('id')}-choices-hidden`);
          elem.value = code;
          validityStr = (function() {
            try {
              Converter.stringToJSValue(`[${code}]`);
              return "";
            } catch (error) {
              ex = error;
              return "Invalid format: Must be a space-separated list of NetLogo literal values";
            }
          })();
          return elem.setCustomValidity(validityStr);
        })
      };
    },
    twoway: false,
    components: {
      formCode: RactiveEditFormMultilineCode,
      formVariable: RactiveEditFormVariable
    },
    computed: {
      chooserChoices: {
        get: function() {
          return this.get('choices').map(function(x) {
            return workspace.dump(x, true);
          }).join('\n');
        }
      }
    },
    genProps: function(form) {
      var choices, choicesArr, varName;
      varName = form.varName.value;
      choices = this.findComponent('formCode').findComponent('codeContainer').get('code');
      choicesArr = Converter.stringToJSValue(`[${choices}]`);
      return {
        choices: choicesArr,
        display: varName,
        variable: varName.toLowerCase()
      };
    },
    partials: {
      title: "Chooser",
      widgetFields: `<formVariable id="{{id}}-varname" value="{{display}}"        name="varName" />
<formCode     id="{{id}}-choices" value="{{chooserChoices}}" name="codeChoices"
              label="Choices" config="{}" style="" onchange="{{setHiddenInput}}" />
<input id="{{id}}-choices-hidden" name="trueCodeChoices" class="all-but-hidden"
       style="margin: -5px 0 0 7px;" type="text" />
<div class="widget-edit-hint-text">Example: "a" "b" "c" 1 2 3</div>`
    }
  });

  window.RactiveChooser = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit, this.standardOptions(this).delete],
        resizeDirs: ['left', 'right']
      };
    },
    observe: {
      'widget.currentValue': function() {
        var currentChoice, widget;
        widget = this.get('widget');
        currentChoice = widget.choices.findIndex(function(c) {
          return c === widget.currentValue;
        });
        return this.set('widget.currentChoice', currentChoice >= 0 ? currentChoice : 0);
      }
    },
    components: {
      editForm: ChooserEditForm
    },
    eventTriggers: function() {
      var recompileEvent;
      recompileEvent = this.findComponent('editForm').get('amProvingMyself') ? this._weg.recompileLite : this._weg.recompile;
      return {
        choices: [this._weg.refreshChooser],
        variable: [recompileEvent, this._weg.rename]
      };
    },
    minWidth: 55,
    minHeight: 45,
    // coffeelint: disable=max_line_length
    template: `{{>editorOverlay}}
<label id="{{id}}" class="netlogo-widget netlogo-chooser netlogo-input {{classes}}" style="{{dims}}">
  <span class="netlogo-label">{{widget.display}}</span>
  <select class="netlogo-chooser-select" value="{{widget.currentValue}}"{{# isEditing }} disabled{{/}} >
  {{#widget.choices}}
    <option class="netlogo-chooser-option" value="{{.}}">{{>literal}}</option>
  {{/}}
  </select>
</label>
<editForm idBasis="{{id}}" choices="{{widget.choices}}" display="{{widget.display}}" />`,
    partials: {
      literal: `{{# typeof . === "string"}}{{.}}{{/}}
{{# typeof . === "number"}}{{.}}{{/}}
{{# typeof . === "boolean"}}{{.}}{{/}}
{{# typeof . === "object"}}
  [{{#.}}
    {{>literal}}
  {{/}}]
{{/}}`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=chooser.js.map
