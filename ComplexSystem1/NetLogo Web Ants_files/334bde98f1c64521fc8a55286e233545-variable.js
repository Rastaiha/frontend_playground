(function() {
  window.RactiveEditFormVariable = Ractive.extend({
    data: function() {
      return {
        id: void 0, // String
        name: void 0, // String
        value: void 0 // String
      };
    },
    twoway: false,
    on: {
      validate: function({node}) {
        var validityStr, varName;
        varName = node.value.toLowerCase();
        validityStr = window.keywords.all.some(function(kw) {
          return kw.toLowerCase() === varName;
        }) ? `'${node.value}' is a reserved name` : "";
        node.setCustomValidity(validityStr);
        return false;
      }
    },
    // coffeelint: disable=max_line_length
    template: `<label for="{{id}}">Global variable: </label>
<input id="{{id}}" class="widget-edit-text" name="{{name}}" placeholder="(Required)"
       type="text" value="{{value}}"
       autofocus autocomplete="off" on-input="validate"
       pattern="[=*!<>:#+/%'&$^.?\\-_a-zA-Z][=*!<>:#+/%'&$^.?\\-\\w]*"
       title="One or more alphanumeric characters and characters in (( $^.?=*!<>:#+/%'&-_ )).  Cannot start with a number"
       required />`
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=variable.js.map
