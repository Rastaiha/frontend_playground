(function() {
  var LabelEditForm;

  LabelEditForm = EditForm.extend({
    data: function() {
      return {
        color: void 0, // String
        fontSize: void 0, // Number
        text: void 0, // String
        transparent: void 0, // Boolean
        _color: void 0 // String
      };
    },
    twoway: false,
    components: {
      colorInput: RactiveColorInput,
      formCheckbox: RactiveEditFormCheckbox,
      formFontSize: RactiveEditFormFontSize,
      labeledInput: RactiveEditFormLabeledInput,
      spacer: RactiveEditFormSpacer
    },
    genProps: function(form) {
      return {
        color: this.findComponent('colorInput').get('value'),
        display: form.text.value,
        fontSize: parseInt(form.fontSize.value),
        transparent: form.transparent.checked
      };
    },
    on: {
      init: function() {
        // A hack (because two-way binding isn't fully properly disabling?!) --JAB (4/11/18)
        this.set('_color', this.get('color'));
      }
    },
    partials: {
      title: "Note",
      // coffeelint: disable=max_line_length
      widgetFields: `<label for="{{id}}-text">Text</label><br>
<textarea id="{{id}}-text" class="widget-edit-textbox"
          name="text" placeholder="Enter note text here..."
          value="{{text}}" autofocus></textarea>

<spacer height="20px" />

<div class="flex-row" style="align-items: center;">
  <div style="width: 48%;">
    <formFontSize id="{{id}}-font-size" name="fontSize" value="{{fontSize}}"/>
  </div>
  <spacer width="4%" />
  <div style="width: 48%;">
    <div class="flex-row" style="align-items: center;">
      <label for="{{id}}-text-color" class="widget-edit-input-label">Text color:</label>
      <div style="flex-grow: 1;">
        <colorInput id="{{id}}-text-color" name="color" class="widget-edit-text widget-edit-input widget-edit-color-pick" value="{{_color}}" />
      </div>
    </div>
  </div>
</div>

<spacer height="15px" />

<formCheckbox id="{{id}}-transparent-checkbox" isChecked={{transparent}} labelText="Transparent background" name="transparent" />`
    }
  });

  // coffeelint: enable=max_line_length
  window.RactiveLabel = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit, this.standardOptions(this).delete],
        convertColor: netlogoColorToCSS
      };
    },
    components: {
      editForm: LabelEditForm
    },
    eventTriggers: function() {
      return {};
    },
    minWidth: 13,
    minHeight: 13,
    template: `{{>editorOverlay}}
{{>label}}
{{>form}}`,
    // coffeelint: disable=max_line_length
    partials: {
      // Note that ">{{ display }}</pre>" thing is necessary. Since <pre> formats
      // text exactly as it appears, an extra space between the ">" and the
      // "{{ display }}" would result in an actual newline in the widget.
      // BCH 7/28/2015
      label: `<pre id="{{id}}" class="netlogo-widget netlogo-text-box {{classes}}"
     style="{{dims}} font-size: {{widget.fontSize}}px; color: {{ convertColor(widget.color) }}; {{# widget.transparent}}background: transparent;{{/}}"
     >{{ widget.display }}</pre>`,
      form: `<editForm idBasis="{{id}}" color="{{widget.color}}"
          fontSize="{{widget.fontSize}}" text="{{widget.display}}"
          transparent="{{widget.transparent}}" />`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=label.js.map
