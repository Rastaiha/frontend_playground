(function() {
  window.RactiveEditFormCheckbox = Ractive.extend({
    data: function() {
      return {
        disabled: void 0, // Boolean
        id: void 0, // String
        isChecked: void 0, // Boolean
        labelText: void 0, // String
        name: void 0 // String
      };
    },
    twoway: false,
    template: `<div class="widget-edit-checkbox-wrapper">
  <input id="{{id}}" class="widget-edit-checkbox"
         name="[[name]]" type="checkbox" checked="{{isChecked}}"
         {{# disabled === true }} disabled {{/}} />
  <label for="{{id}}" class="widget-edit-input-label">{{labelText}}</label>
</div>`
  });

}).call(this);

//# sourceMappingURL=checkbox.js.map
