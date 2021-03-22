(function() {
  var ButtonEditForm;

  ButtonEditForm = EditForm.extend({
    data: function() {
      return {
        actionKey: void 0, // String
        display: void 0, // String
        isForever: void 0, // Boolean
        source: void 0, // String
        startsDisabled: void 0, // Boolean
        type: void 0 // String
      };
    },
    computed: {
      displayedType: {
        get: function() {
          return this._typeToDisplay(this.get('type'));
        }
      }
    },
    on: {
      'handle-action-key-press': function({
          event: {key},
          node
        }) {
        if (key !== "Enter") {
          return node.value = "";
        }
      }
    },
    twoway: false,
    components: {
      formCheckbox: RactiveEditFormCheckbox,
      formCode: RactiveEditFormMultilineCode,
      formDropdown: RactiveEditFormDropdown,
      labeledInput: RactiveEditFormLabeledInput,
      spacer: RactiveEditFormSpacer
    },
    genProps: function(form) {
      var key, source;
      key = form.actionKey.value;
      source = this.findComponent('formCode').findComponent('codeContainer').get('code');
      return {
        actionKey: (key.length === 1 ? key.toUpperCase() : null),
        buttonKind: this._displayToType(form.type.value),
        disableUntilTicksStart: form.startsDisabled.checked,
        display: (form.display.value !== "" ? form.display.value : void 0),
        forever: form.forever.checked,
        source: (source !== "" ? source : void 0)
      };
    },
    partials: {
      title: "Button",
      // coffeelint: disable=max_line_length
      widgetFields: `<div class="flex-row" style="align-items: center;">
  <formDropdown id="{{id}}-type" choices="['observer', 'turtles', 'patches', 'links']" name="type" label="Agent(s):" selected="{{displayedType}}" />
  <formCheckbox id="{{id}}-forever-checkbox" isChecked={{isForever}} labelText="Forever" name="forever" />
</div>

<spacer height="15px" />

<formCheckbox id="{{id}}-start-disabled-checkbox" isChecked={{startsDisabled}} labelText="Disable until ticks start" name="startsDisabled" />

<spacer height="15px" />

<formCode id="{{id}}-source" name="source" value="{{source}}" label="Commands" />

<spacer height="15px" />

<div class="flex-row" style="align-items: center;">
  <labeledInput id="{{id}}-display" labelStr="Display name:" name="display" class="widget-edit-inputbox" type="text" value="{{display}}" />
</div>

<spacer height="15px" />

<div class="flex-row" style="align-items: center;">
  <label for="{{id}}-action-key">Action key:</label>
  <input  id="{{id}}-action-key" name="actionKey" type="text" value="{{actionKey}}"
          class="widget-edit-inputbox" style="text-transform: uppercase; width: 33px;"
          on-keypress="handle-action-key-press" />
</div>`
    },
    // coffeelint: enable=max_line_length
    _displayToType: function(display) {
      return {
        observer: "Observer",
        turtles: "Turtle",
        patches: "Patch",
        links: "Link"
      }[display];
    },
    _typeToDisplay: function(type) {
      return {
        Observer: "observer",
        Turtle: "turtles",
        Patch: "patches",
        Link: "links"
      }[type];
    }
  });

  window.RactiveButton = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit, this.standardOptions(this).delete],
        errorClass: void 0, // String
        ticksStarted: void 0 // Boolean
      };
    },
    computed: {
      isEnabled: {
        get: function() {
          return (this.get('ticksStarted') || (!this.get('widget').disableUntilTicksStart)) && (!this.get('isEditing'));
        }
      }
    },
    oninit: function() {
      this._super();
      return this.on('activate-button', function(_, run) {
        if (this.get('isEnabled')) {
          return run();
        }
      });
    },
    components: {
      editForm: ButtonEditForm
    },
    eventTriggers: function() {
      return {
        buttonKind: [this._weg.recompile],
        forever: [this._weg.recompile],
        source: [this._weg.recompile]
      };
    },
    minWidth: 35,
    minHeight: 30,
    // coffeelint: disable=max_line_length
    template: `{{>editorOverlay}}
{{>button}}
<editForm actionKey="{{widget.actionKey}}" display="{{widget.display}}"
          idBasis="{{id}}" isForever="{{widget.forever}}" source="{{widget.source}}"
          startsDisabled="{{widget.disableUntilTicksStart}}" type="{{widget.buttonKind}}" />`,
    partials: {
      button: `{{# widget.forever }}
  {{>foreverButton}}
{{ else }}
  {{>standardButton}}
{{/}}`,
      standardButton: `<button id="{{id}}" type="button" style="{{dims}}"
        class="netlogo-widget netlogo-button netlogo-command{{# !isEnabled }} netlogo-disabled{{/}} {{errorClass}} {{classes}}"
        on-click="@this.fire('activate-button', @this.get('widget.run'))">
  {{>buttonContext}}
  {{>label}}
  {{>actionKeyIndicator}}
</button>`,
      foreverButton: `<label id="{{id}}" style="{{dims}}"
       class="netlogo-widget netlogo-button netlogo-forever-button{{#widget.running}} netlogo-active{{/}} netlogo-command{{# !isEnabled }} netlogo-disabled{{/}} {{errorClass}} {{classes}}">
  {{>buttonContext}}
  {{>label}}
  {{>actionKeyIndicator}}
  <input type="checkbox" checked={{ widget.running }} {{# !isEnabled }}disabled{{/}}/>
  <div class="netlogo-forever-icon"></div>
</label>`,
      buttonContext: `<div class="netlogo-button-agent-context">
{{#if widget.buttonKind === "Turtle" }}
  T
{{elseif widget.buttonKind === "Patch" }}
  P
{{elseif widget.buttonKind === "Link" }}
  L
{{/if}}
</div>`,
      label: `<span class="netlogo-label">{{widget.display || widget.source}}</span>`,
      actionKeyIndicator: `{{# widget.actionKey }}
  <span class="netlogo-action-key {{# widget.hasFocus }}netlogo-focus{{/}}">
    {{widget.actionKey}}
  </span>
{{/}}`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=button.js.map
