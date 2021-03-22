(function() {
  window.RactiveEditFormLabeledInput = Ractive.extend({
    data: function() {
      return {
        attrs: void 0, // String
        checked: void 0, // Boolean
        class: void 0, // String
        divClass: "flex-row", // String
        id: void 0, // String
        labelStr: void 0, // String
        labelStyle: void 0, // String
        max: void 0, // Number
        min: void 0, // Number
        name: void 0, // String
        onChange: void 0, // String
        style: void 0, // String
        type: void 0, // String
        value: void 0 // Any
      };
    },
    twoway: false,
    on: {
      // (Context) => Unit
      'exec': function(context) {
        var event;
        event = this.get('onChange');
        if (event) {
          if (this.get('type') === 'number') {
            this.set('value', this.clampNumber(this.get('value'), this.get('min'), this.get('max')));
          }
          this.fire(event, context, this.get('value'));
        }
      }
    },
    // (Number, Number, Number) => Number
    clampNumber: function(value, min, max) {
      if ((min != null) && value < min) {
        return min;
      } else if ((max != null) && value > max) {
        return max;
      } else {
        return value;
      }
    },
    template: `<div class="{{ divClass }}">
  <label for="{{ id }}" class="widget-edit-input-label" style="{{ labelStyle }}">{{ labelStr }}</label>
  <div style="flex-grow: 1;">
    <input class="widget-edit-text widget-edit-input {{ class }}" {{#if id }}id="{{ id }}"{{/if}} name="{{ name }}"
      min="{{ min }}" max="{{ max }}" on-change="exec"
      type="{{ type }}" checked="{{ checked }}" value="{{ value }}" style="{{ style }}" {{ attrs }} />
  </div>
</div>`
  });

  window.RactiveTwoWayLabeledInput = RactiveEditFormLabeledInput.extend({
    data: function() {
      return {
        attrs: 'lazy step="any"'
      };
    },
    twoway: true
  });

}).call(this);

//# sourceMappingURL=labeled-input.js.map
