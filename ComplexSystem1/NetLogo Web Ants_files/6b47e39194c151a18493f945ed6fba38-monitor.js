(function() {
  var MonitorEditForm;

  MonitorEditForm = EditForm.extend({
    data: function() {
      return {
        display: void 0, // String
        fontSize: void 0, // Number
        precision: void 0, // Number
        source: void 0 // String
      };
    },
    components: {
      formCode: RactiveEditFormMultilineCode,
      formFontSize: RactiveEditFormFontSize,
      labeledInput: RactiveEditFormLabeledInput,
      spacer: RactiveEditFormSpacer
    },
    twoway: false,
    // Note how we obtain the code.  We don't grab it out of the form.  The code is not given a `name`.
    // `name` is not valid on a `div`.  Our CodeMirror instances are using `div`s.  They *could* use
    // `textarea`s, but I tried that, and it just makes things harder for us.  `textarea`s can take
    // `name`s, yes, but CodeMirror only updates the true `textarea`'s value for submission when the
    // `submit` event is triggered, and we're not using the proper `submit` event (since we're using
    // Ractive's), so the `textarea` doesn't have the correct value when we get here.  It's much, much
    // more straight-forward to just go digging in the form component for its value. --JAB (4/21/16)
    genProps: function(form) {
      var fontSize;
      fontSize = parseInt(form.fontSize.value);
      return {
        display: (form.display.value !== "" ? form.display.value : void 0),
        fontSize,
        bottom: this.parent.get('widget.top') + (2 * fontSize) + 23,
        precision: parseInt(form.precision.value),
        source: this.findComponent('formCode').findComponent('codeContainer').get('code')
      };
    },
    partials: {
      title: "Monitor",
      // coffeelint: disable=max_line_length
      widgetFields: `<formCode id="{{id}}-source" name="source" value="{{source}}" label="Reporter" />

<spacer height="15px" />

<div class="flex-row" style="align-items: center;">
  <labeledInput id="{{id}}-display" labelStr="Display name:" name="display" class="widget-edit-inputbox" type="text" value="{{display}}" />
</div>

<spacer height="15px" />

<div class="flex-row" style="align-items: center; justify-content: space-between;">

  <label for="{{id}}">Decimal places: </label>
  <input  id="{{id}}" name="precision" placeholder="(Required)"
          class="widget-edit-inputbox" style="width: 70px;"
          type="number" value="{{precision}}" min=-30 max=17 step=1 required />
  <spacer width="50px" />
  <formFontSize id="{{id}}-font-size" name="fontSize" value="{{fontSize}}"/>

</div>`
    }
  });

  // coffeelint: enable=max_line_length
  window.RactiveMonitor = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit, this.standardOptions(this).delete],
        errorClass: void 0, // String
        resizeDirs: ['left', 'right']
      };
    },
    components: {
      editForm: MonitorEditForm
    },
    eventTriggers: function() {
      return {
        source: [this._weg.recompile]
      };
    },
    minWidth: 20,
    minHeight: 45,
    template: `{{>editorOverlay}}
{{>monitor}}
<editForm idBasis="{{id}}" display="{{widget.display}}" fontSize="{{widget.fontSize}}"
          precision="{{widget.precision}}" source="{{widget.source}}" />`,
    // coffeelint: disable=max_line_length
    partials: {
      monitor: `<div id="{{id}}" class="netlogo-widget netlogo-monitor netlogo-output {{classes}}"
     style="{{dims}} font-size: {{widget.fontSize}}px;">
  <label class="netlogo-label {{errorClass}}" on-click="show-errors">{{widget.display || widget.source}}</label>
  <output class="netlogo-value">{{widget.currentValue}}</output>
</div>`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=monitor.js.map
