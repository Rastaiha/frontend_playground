(function() {
  window.RactiveTickCounter = Ractive.extend({
    data: function() {
      return {
        isVisible: void 0, // Boolean
        label: void 0, // String
        value: void 0 // Number
      };
    },
    twoway: false,
    template: `<span class="netlogo-label">
  {{ # isVisible }}
    {{label}}: {{value}}
  {{else}}
    &nbsp;
  {{/}}
</span>`
  });

}).call(this);

//# sourceMappingURL=tick-counter.js.map
