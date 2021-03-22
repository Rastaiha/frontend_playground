(function() {
  window.RactiveConsoleWidget = Ractive.extend({
    data: function() {
      return {
        input: '',
        isEditing: void 0, // Boolean (for widget editing)
        agentTypes: ['observer', 'turtles', 'patches', 'links'],
        agentTypeIndex: 0,
        checkIsReporter: void 0, // (String) => Boolean
        history: [], // Array of {agentType, input} objects
        historyIndex: 0,
        workingEntry: {}, // Stores {agentType, input} when user up arrows
        output: ''
      };
    },
    computed: {
      agentType: {
        get: function() {
          return this.get('agentTypes')[this.get('agentTypeIndex')];
        },
        set: function(val) {
          var index;
          index = this.get('agentTypes').indexOf(val);
          if (index >= 0) {
            this.set('agentTypeIndex', index);
            return this.focusCommandCenterEditor();
          }
        }
      }
    },
    components: {
      printArea: RactivePrintArea
    },
    onrender: function() {
      var changeAgentType, commandCenterEditor, consoleErrorLog, moveInHistory, run;
      changeAgentType = () => {
        return this.set('agentTypeIndex', (this.get('agentTypeIndex') + 1) % this.get('agentTypes').length);
      };
      moveInHistory = (index) => {
        var entry, newIndex;
        newIndex = this.get('historyIndex') + index;
        if (newIndex < 0) {
          newIndex = 0;
        } else if (newIndex > this.get('history').length) {
          newIndex = this.get('history').length;
        }
        if (this.get('historyIndex') === this.get('history').length) {
          this.set('workingEntry', {
            agentType: this.get('agentType'),
            input: this.get('input')
          });
        }
        if (newIndex === this.get('history').length) {
          this.set(this.get('workingEntry'));
        } else {
          entry = this.get('history')[newIndex];
          this.set(entry);
        }
        return this.set('historyIndex', newIndex);
      };
      consoleErrorLog = (messages) => {
        return this.set('output', `${this.get('output')}ERROR: ${messages.join('\n')}\n`);
      };
      run = () => {
        var agentType, history, input, lastEntry;
        input = this.get('input');
        if (input.trim().length > 0) {
          agentType = this.get('agentType');
          if (this.get('checkIsReporter')(input)) {
            input = `show ${input}`;
          }
          this.set('output', `${this.get('output')}${agentType}> ${input}\n`);
          history = this.get('history');
          lastEntry = history.length > 0 ? history[history.length - 1] : {
            agentType: '',
            input: ''
          };
          if (lastEntry.input !== input || lastEntry.agentType !== agentType) {
            history.push({agentType, input});
          }
          this.set('historyIndex', history.length);
          if (agentType !== 'observer') {
            input = `ask ${agentType} [ ${input} ]`;
          }
          this.fire('run', {}, input, consoleErrorLog);
          this.set('input', '');
          return this.set('workingEntry', {});
        }
      };
      this.on('clear-history', function() {
        return this.set('output', '');
      });
      commandCenterEditor = CodeMirror(this.find('.netlogo-command-center-editor'), {
        value: this.get('input'),
        mode: 'netlogo',
        theme: 'netlogo-default',
        scrollbarStyle: 'null',
        extraKeys: {
          Enter: run,
          Up: () => {
            return moveInHistory(-1);
          },
          Down: () => {
            return moveInHistory(1);
          },
          Tab: () => {
            return changeAgentType();
          }
        }
      });
      this.focusCommandCenterEditor = function() {
        return commandCenterEditor.focus();
      };
      commandCenterEditor.on('beforeChange', function(_, change) {
        var oneLineText;
        oneLineText = change.text.join('').replace(/\n/g, '');
        change.update(change.from, change.to, [oneLineText]);
        return true;
      });
      commandCenterEditor.on('change', () => {
        return this.set('input', commandCenterEditor.getValue());
      });
      this.observe('input', function(newValue) {
        if (newValue !== commandCenterEditor.getValue()) {
          commandCenterEditor.setValue(newValue);
          return commandCenterEditor.execCommand('goLineEnd');
        }
      });
      return this.observe('isEditing', function(isEditing) {
        var classes;
        commandCenterEditor.setOption('readOnly', isEditing ? 'nocursor' : false);
        classes = this.find('.netlogo-command-center-editor').querySelector('.CodeMirror-scroll').classList;
        if (isEditing) {
          classes.add('cm-disabled');
        } else {
          classes.remove('cm-disabled');
        }
      });
    },
    // String -> Unit
    appendText: function(str) {
      this.set('output', this.get('output') + str);
    },
    template: `<div class='netlogo-tab-content netlogo-command-center'
     grow-in='{disable:"console-toggle"}' shrink-out='{disable:"console-toggle"}'>
  <printArea id='command-center-print-area' output='{{output}}'/>

  <div class='netlogo-command-center-input'>
    <label>
      <select value="{{agentType}}">
      {{#agentTypes}}
        <option value="{{.}}">{{.}}</option>
      {{/}}
      </select>
    </label>
    <div class="netlogo-command-center-editor"></div>
    <button on-click='clear-history'>Clear</button>
  </div>
</div>`
  });

}).call(this);

//# sourceMappingURL=console.js.map
