(function() {
  window.RactiveInfoTabEditor = Ractive.extend({
    data: function() {
      return {
        isEditing: false
      };
    },
    onrender: function() {
      var infoTabEditor;
      infoTabEditor = CodeMirror(this.find('.netlogo-info-editor'), {
        value: this.get('rawText'),
        tabsize: 2,
        mode: 'markdown',
        theme: 'netlogo-default',
        editing: this.get('isEditing'),
        lineWrapping: true
      });
      return infoTabEditor.on('change', () => {
        this.set('rawText', infoTabEditor.getValue());
        return this.set('info', infoTabEditor.getValue());
      });
    },
    template: `<div class='netlogo-info-editor'></div>`
  });

  window.RactiveInfoTabWidget = Ractive.extend({
    components: {
      infoeditor: RactiveInfoTabEditor
    },
    computed: {
      sanitizedText: function() {
        return this.mdToHTML(this.get("rawText"));
      }
    },
    mdToHTML: function(md) {
      // html_sanitize is provided by Google Caja - see https://code.google.com/p/google-caja/wiki/JsHtmlSanitizer
      // RG 8/18/15
      return window.html_sanitize(exports.toHTML(md), function(url) {
        if (/^https?:\/\//.test(url)) {
          return url;
        } else {
          return void 0; // URL Sanitizer
        }
      }, function(id) {
        return id; // ID Sanitizer
      });
    },
    template: `<div class='netlogo-tab-content netlogo-info'
     grow-in='{disable:"info-toggle"}' shrink-out='{disable:"info-toggle"}'>
  {{# !isEditing }}
    <div class='netlogo-info-markdown'>{{{sanitizedText}}}</div>
  {{ else }}
    <infoeditor rawText='{{rawText}}' />
  {{ / }}
</div>`
  });

}).call(this);

//# sourceMappingURL=info.js.map
