(function() {
  // coffeelint: disable=max_line_length
  var FlexColumn, SliderEditForm;

  FlexColumn = Ractive.extend({
    template: `<div class="flex-column" style="align-items: center; flex-grow: 1; max-width: 140px;">
  {{ yield }}
</div>`
  });

  SliderEditForm = EditForm.extend({
    data: function() {
      return {
        bottom: void 0, // Number
        direction: void 0, // String
        left: void 0, // Number
        maxCode: void 0, // String
        minCode: void 0, // String
        right: void 0, // Number
        stepCode: void 0, // String
        top: void 0, // Number
        units: void 0, // String
        value: void 0, // Number
        variable: void 0 // String
      };
    },
    twoway: false,
    components: {
      column: FlexColumn,
      formCheckbox: RactiveEditFormCheckbox,
      formMaxCode: RactiveEditFormOneLineCode,
      formMinCode: RactiveEditFormOneLineCode,
      formStepCode: RactiveEditFormOneLineCode,
      formVariable: RactiveEditFormVariable,
      labeledInput: RactiveEditFormLabeledInput,
      spacer: RactiveEditFormSpacer
    },
    genProps: function(form) {
      var bottom, oldBottom, oldLeft, oldRight, oldTop, right, value;
      value = Number.parseFloat(form.value.value);
      oldTop = this.get('top');
      oldRight = this.get('right');
      oldBottom = this.get('bottom');
      oldLeft = this.get('left');
      [right, bottom] = (this.get('direction') === 'horizontal' && form.vertical.checked) || (this.get('direction') === 'vertical' && !form.vertical.checked) ? [oldLeft + (oldBottom - oldTop), oldTop + (oldRight - oldLeft)] : [oldRight, oldBottom];
      return {
        bottom,
        currentValue: value,
        default: value,
        direction: (form.vertical.checked ? "vertical" : "horizontal"),
        display: form.variable.value,
        max: this.findComponent('formMaxCode').findComponent('codeContainer').get('code'),
        min: this.findComponent('formMinCode').findComponent('codeContainer').get('code'),
        right,
        step: this.findComponent('formStepCode').findComponent('codeContainer').get('code'),
        units: (form.units.value !== "" ? form.units.value : void 0),
        variable: form.variable.value.toLowerCase()
      };
    },
    partials: {
      title: "Slider",
      widgetFields: `<formVariable id="{{id}}-varname" name="variable" value="{{variable}}"/>

<spacer height="15px" />

<div class="flex-row" style="align-items: stretch; justify-content: space-around">
  <column>
    <formMinCode id="{{id}}-min-code" label="Minimum" name="minCode" config="{ scrollbarStyle: 'null' }"
                 style="width: 100%;" value="{{minCode}}" />
  </column>
  <column>
    <formStepCode id="{{id}}-step-code" label="Increment" name="stepCode" config="{ scrollbarStyle: 'null' }"
                  style="width: 100%;" value="{{stepCode}}" />
  </column>
  <column>
    <formMaxCode id="{{id}}-max-code" label="Maximum" name="maxCode" config="{ scrollbarStyle: 'null' }"
                 style="width: 100%;" value="{{maxCode}}" />
  </column>
</div>

<div class="widget-edit-hint-text" style="margin-left: 4px; margin-right: 4px;">min, increment, and max may be numbers or reporters</div>

<div class="flex-row" style="align-items: center;">
  <labeledInput id="{{id}}-value" labelStr="Default value:" name="value" type="number" value="{{value}}" attrs="required step='any'"
                style="flex-grow: 1; text-align: right;" />
  <labeledInput id="{{id}}-units" labelStr="Units:" labelStyle="margin-left: 10px;" name="units" type="text" value="{{units}}"
                style="flex-grow: 1; padding: 4px;" />
</div>

<spacer height="15px" />

<formCheckbox id="{{id}}-vertical" isChecked="{{ direction === 'vertical' }}" labelText="Vertical?"
              name="vertical" />`
    }
  });

  window.RactiveSlider = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit, this.standardOptions(this).delete],
        errorClass: void 0 // String
      };
    },
    on: {
      'reset-if-invalid': function(context) {
        // input elements don't reject out-of-range hand-typed numbers so we have to do the dirty work
        if (context.node.validity.rangeOverflow) {
          return this.set('widget.currentValue', this.get('widget.maxValue'));
        } else if (context.node.validity.rangeUnderflow) {
          return this.set('widget.currentValue', this.get('widget.minValue'));
        }
      }
    },
    computed: {
      resizeDirs: {
        get: function() {
          if (this.get('widget.direction') !== 'vertical') {
            return ['left', 'right'];
          } else {
            return ['top', 'bottom'];
          }
        },
        set: (function() {})
      }
    },
    components: {
      editForm: SliderEditForm
    },
    eventTriggers: function() {
      return {
        currentValue: [this._weg.updateEngineValue],
        max: [this._weg.recompile],
        min: [this._weg.recompile],
        step: [this._weg.recompile],
        variable: [this._weg.recompile, this._weg.rename]
      };
    },
    minWidth: 60,
    minHeight: 33,
    template: `{{>editorOverlay}}
{{>slider}}
<editForm direction="{{widget.direction}}" idBasis="{{id}}" maxCode="{{widget.max}}"
          minCode="{{widget.min}}" stepCode="{{widget.step}}" units="{{widget.units}}"
          top="{{widget.top}}" right="{{widget.right}}" bottom="{{widget.bottom}}"
          left="{{widget.left}}" value="{{widget.default}}" variable="{{widget.variable}}" />`,
    partials: {
      slider: `<label id="{{id}}" class="netlogo-widget netlogo-slider netlogo-input {{errorClass}} {{classes}}"
       style="{{ #widget.direction !== 'vertical' }}{{dims}}{{else}}{{>verticalDims}}{{/}}">
  <input type="range"
         max="{{widget.maxValue}}" min="{{widget.minValue}}"
         step="{{widget.stepValue}}" value="{{widget.currentValue}}"
         {{# isEditing }}disabled{{/}} />
  <div class="netlogo-slider-label">
    <span class="netlogo-label" on-click="show-errors">{{widget.display}}</span>
    <span class="netlogo-slider-value">
      <input type="number" on-change="reset-if-invalid"
             style="width: {{widget.currentValue.toString().length + 3.0}}ch"
             min="{{widget.minValue}}" max="{{widget.maxValue}}"
             value="{{widget.currentValue}}" step="{{widget.stepValue}}"
             {{# isEditing }}disabled{{/}} />
      {{#widget.units}}{{widget.units}}{{/}}
    </span>
  </div>
</label>`,
      verticalDims: `position: absolute;
left: {{ left }}px; top: {{ top }}px;
width: {{ bottom - top }}px; height: {{ right - left }}px;
transform: translateY({{ bottom - top }}px) rotate(270deg);
transform-origin: top left;`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=slider.js.map
