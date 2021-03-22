(function() {
  var SwitchEditForm;

  SwitchEditForm = EditForm.extend({
    data: function() {
      return {
        display: void 0 // String
      };
    },
    twoway: false,
    components: {
      formVariable: RactiveEditFormVariable
    },
    genProps: function(form) {
      var variable;
      variable = form.variable.value;
      return {
        display: variable,
        variable: variable.toLowerCase()
      };
    },
    partials: {
      title: "Switch",
      widgetFields: `<formVariable id="{{id}}-varname" name="variable" value="{{display}}"/>`
    }
  });

  window.RactiveSwitch = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit, this.standardOptions(this).delete],
        resizeDirs: ['left', 'right']
      };
    },
    // `on` and `currentValue` should be synonymous for Switches.  It is necessary that we
    // update `on`, because that's what the widget reader looks at at compilation time in
    // order to determine the value of the Switch. --JAB (3/31/16)
    oninit: function() {
      this._super();
      return Object.defineProperty(this.get('widget'), "on", {
        get: function() {
          return this.currentValue;
        },
        set: function(x) {
          return this.currentValue = x;
        }
      });
    },
    components: {
      editForm: SwitchEditForm
    },
    eventTriggers: function() {
      var recompileEvent;
      recompileEvent = this.findComponent('editForm').get('amProvingMyself') ? this._weg.recompileLite : this._weg.recompile;
      return {
        variable: [recompileEvent, this._weg.rename]
      };
    },
    minWidth: 35,
    minHeight: 33,
    template: `{{>editorOverlay}}
{{>switch}}
<editForm idBasis="{{id}}" display="{{widget.display}}" />`,
    // coffeelint: disable=max_line_length
    partials: {
      switch: `<label id="{{id}}" class="netlogo-widget netlogo-switcher netlogo-input {{classes}}" style="{{dims}}">
  <input type="checkbox" checked="{{ widget.currentValue }}" {{# isEditing }} disabled{{/}} />
  <span class="netlogo-label">{{ widget.display }}</span>
</label>`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=switch.js.map
