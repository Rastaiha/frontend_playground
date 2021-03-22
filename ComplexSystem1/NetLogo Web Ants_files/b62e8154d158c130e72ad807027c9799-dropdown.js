(function() {
  window.RactiveEditFormDropdown = Ractive.extend({
    data: function() {
      return {
        changeEvent: void 0, // String
        choices: void 0, // Array[String | { value: String, text: String }]
        disableds: void 0, // Array[String]
        name: void 0, // String
        id: void 0, // String
        label: void 0, // String
        selected: void 0, // String
        checkIsDisabled: function(item) {
          var disableds, ref;
          disableds = (ref = this.get('disableds')) != null ? ref : [];
          return disableds.some(function(d) {
            return d === item || (item.value != null) && item.value === d;
          });
        },
        valOf: function(item) {
          if (item.value != null) {
            return item.value;
          } else {
            return item;
          }
        },
        textOf: function(item) {
          if (item.text != null) {
            return item.text;
          } else {
            return item;
          }
        }
      };
    },
    on: {
      // (Context) => Unit
      '*.changed': function(_) {
        var event;
        event = this.get('changeEvent');
        if ((event != null)) {
          this.fire(event);
        }
      }
    },
    twoway: false,
    template: `<div class="{{ divClass }}">
  <label for="{{ id }}" class="widget-edit-input-label">{{ label }}</label>
  <select id="{{ id }}" name="{{ name }}" class="widget-edit-dropdown" value="{{ selected }}">
    {{#choices }}
      <option value="{{ valOf(this) }}" {{# checkIsDisabled(this) }} disabled {{/}}>{{ textOf(this) }}</option>
    {{/}}
  </select>
</div>`
  });

  window.RactiveTwoWayDropdown = window.RactiveEditFormDropdown.extend({
    twoway: true
  });

}).call(this);

//# sourceMappingURL=dropdown.js.map
