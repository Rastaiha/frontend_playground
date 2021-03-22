(function() {
  window.RactivePrintArea = Ractive.extend({
    data: function() {
      return {
        fontSize: void 0, // Number
        id: void 0, // String
        output: void 0 // String
      };
    },
    observe: {
      output: function() {
        return this.update('output').then(() => {
          var outputElem;
          outputElem = this.find("#" + this.get("id"));
          return outputElem != null ? outputElem.scrollTop = outputElem.scrollHeight : void 0;
        });
      }
    },
    template: `<pre id='{{id}}' class='netlogo-output-area'
     style="font-size: {{fontSize}}px;">{{output}}</pre>`
  });

}).call(this);

//# sourceMappingURL=print-area.js.map
