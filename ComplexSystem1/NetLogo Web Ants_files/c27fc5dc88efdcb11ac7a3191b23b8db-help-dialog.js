(function() {
  var isMac, keyRow, keyTable, platformCtrlHtml;

  isMac = window.navigator.platform.startsWith('Mac');

  platformCtrlHtml = isMac ? "&#8984;" : "ctrl";

  // (Array[String], String) => String
  keyRow = function(keys, explanation) {
    return `<tr>
  <td class="help-keys">${keys.map(function(key) {
      return "<kbd>" + key + "</kbd>";
    }).join('')}</td>
  <td class="help-explanation">${explanation}</td>
</tr>`;
  };

  // (Array[Array[Array[String], String]]) => String
  keyTable = function(entries) {
    return `<table class="help-key-table">
  ${entries.map(function([keys, explanation]) {
      return keyRow(keys, explanation);
    }).join('\n')}
</table>`;
  };

  window.RactiveHelpDialog = Ractive.extend({
    data: function() {
      return {
        isOverlayUp: void 0, // Boolean
        isVisible: void 0, // Boolean
        stateName: void 0, // String
        wareaHeight: void 0, // Number
        wareaWidth: void 0 // Number
      };
    },
    observe: {
      isVisible: function(newValue, oldValue) {
        this.set('isOverlayUp', newValue);
        if (newValue) {
          setTimeout((() => {
            return this.find("#help-dialog").focus();
          }), 0); // Dialog isn't visible yet, so can't be focused --JAB (5/2/18)
          this.fire('dialog-opened', this);
        } else {
          this.fire('dialog-closed', this);
        }
      }
    },
    on: {
      'close-popup': function() {
        this.set('isVisible', false);
        return false;
      },
      'handle-key': function({
          original: {keyCode}
        }) {
        if (keyCode === 27) {
          this.fire('close-popup');
          return false;
        }
      }
    },
    // coffeelint: disable=max_line_length
    template: `<div id="help-dialog" class="help-popup"
     style="{{# !isVisible }}display: none;{{/}} top: {{(wareaHeight * .1) + 150}}px; left: {{wareaWidth * .1}}px; width: {{wareaWidth * .8}}px; {{style}}"
     on-keydown="handle-key" tabindex="0">
  <div id="{{id}}-closer" class="widget-edit-closer" on-click="close-popup">X</div>
  <div>{{>helpText}}</div>
</div>`,
    partials: {
      helpAuthoringEditWidget: keyTable([[["enter"], "submit form"], [["escape"], "close form and ignore any changes made"]]),
      helpAuthoringStandard: keyTable([[[platformCtrlHtml, "shift", "l"], "switch to interactive mode"], [[platformCtrlHtml, "shift", "h"], "toggle resizer visibility"], [["escape"], "close context menu if it is open, or deselect any selected widget"], [[platformCtrlHtml], "hold to ignore \"snap to grid\" while moving or resizing the selected widget"], [["&uarr;", "&darr;", "&larr;", "&rarr;"], "move widget, irrespective of the grid"]].concat(!isMac ? [[["delete"], "delete the selected widget"]] : [])),
      helpInteractive: keyTable([[[platformCtrlHtml, "shift", "l"], "switch to authoring mode"], [[platformCtrlHtml, "u"], "find all usages of selected text (when in NetLogo Code editor)"], [[platformCtrlHtml, ";"], "comment/uncomment a line of code (when in NetLogo Code editor)"]]),
      helpText: `<table>
  {{# stateName === 'interactive' }}
    {{>helpInteractive}}
  {{elseif stateName === 'authoring - plain' }}
    {{>helpAuthoringStandard}}
  {{elseif stateName === 'authoring - editing widget' }}
    {{>helpAuthoringEditWidget}}
  {{else}}
    Invalid help state.
  {{/}}
</table>`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=help-dialog.js.map
