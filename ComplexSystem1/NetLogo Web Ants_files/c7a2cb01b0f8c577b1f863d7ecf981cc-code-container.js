(function() {
  var RactiveCodeContainerBase, editFormCodeContainerFactory;

  RactiveCodeContainerBase = Ractive.extend({
    _editor: void 0, // CodeMirror
    data: function() {
      return {
        code: void 0, // String
        extraClasses: void 0, // Array[String]
        extraConfig: void 0, // Object
        id: void 0, // String
        initialCode: void 0, // String
        isDisabled: false,
        injectedConfig: void 0, // Object
        onchange: (function() {}), // (String) => Unit
        style: void 0 // String
      };
    },
    // An astute observer will ask what the purpose of `initialCode` is--why wouldn't we just make it
    // equivalent to `code`?  It's a good (albeit maddening) question.  Ractive does some funny stuff
    // if the code that comes in is the same as what is getting hit by `set` in the editor's on-change
    // event.  Basically, even though we explicitly say all over the place that we don't want to be
    // doing two-way binding, that `set` call will change the value here and everywhere up the chain.
    // So, to avoid that, `initialCode` is a dummy variable, and we dump it into `code` as soon as
    // reasonably possible.  --JAB (5/2/16)
    oncomplete: function() {
      var initialCode, ref;
      initialCode = this.get('initialCode');
      this.set('code', (ref = initialCode != null ? initialCode : this.get('code')) != null ? ref : "");
      this._setupCodeMirror();
    },
    twoway: false,
    _setupCodeMirror: function() {
      var baseConfig, config, ref, ref1;
      baseConfig = {
        mode: 'netlogo',
        theme: 'netlogo-default',
        value: this.get('code').toString(),
        viewportMargin: 2e308
      };
      config = Object.assign({}, baseConfig, (ref = this.get('extraConfig')) != null ? ref : {}, (ref1 = this.get('injectedConfig')) != null ? ref1 : {});
      this._editor = new CodeMirror(this.find(`#${this.get('id')}`), config);
      this._editor.on('change', () => {
        var code;
        code = this._editor.getValue();
        this.set('code', code);
        this.parent.fire('code-changed', code);
        return this.get('onchange')(code);
      });
      this.observe('isDisabled', function(isDisabled) {
        var classes;
        this._editor.setOption('readOnly', isDisabled ? 'nocursor' : false);
        classes = this.find('.netlogo-code').querySelector('.CodeMirror-scroll').classList;
        if (isDisabled) {
          classes.add('cm-disabled');
        } else {
          classes.remove('cm-disabled');
        }
      });
    },
    // (String) => Unit
    setCode: function(code) {
      var str;
      str = code.toString();
      if ((this._editor != null) && this._editor.getValue() !== str) {
        this._editor.setValue(str);
      }
    },
    template: `<div id="{{id}}" class="netlogo-code {{(extraClasses || []).join(' ')}}" style="{{style}}"></div>`
  });

  window.RactiveCodeContainerMultiline = RactiveCodeContainerBase.extend({
    data: function() {
      return {
        extraConfig: {
          tabSize: 2,
          extraKeys: {
            "Ctrl-F": "findPersistent",
            "Cmd-F": "findPersistent"
          }
        }
      };
    },
    highlightProcedure: function(procedureName, index) {
      var end, start;
      end = this._editor.posFromIndex(index);
      start = CodeMirror.Pos(end.line, end.ch - procedureName.length);
      this._editor.setSelection(start, end);
    },
    getEditor: function() {
      return this._editor;
    }
  });

  window.RactiveCodeContainerOneLine = RactiveCodeContainerBase.extend({
    oncomplete: function() {
      var forceOneLine;
      this._super();
      forceOneLine = function(_, change) {
        var oneLineText;
        oneLineText = change.text.join('').replace(/\n/g, '');
        change.update(change.from, change.to, [oneLineText]);
        return true;
      };
      this._editor.on('beforeChange', forceOneLine);
    }
  });

  // (Ractive) => Ractive
  editFormCodeContainerFactory = function(container) {
    return Ractive.extend({
      data: function() {
        return {
          config: void 0, // Object
          id: void 0, // String
          label: void 0, // String
          onchange: (function() {}), // (String) => Unit
          style: void 0, // String
          value: void 0 // String
        };
      },
      twoway: false,
      components: {
        codeContainer: container
      },
      template: `<label for="{{id}}">{{label}}</label>
<codeContainer id="{{id}}" initialCode="{{value}}" injectedConfig="{{config}}"
               onchange="{{onchange}}" style="{{style}}" />`
    });
  };

  window.RactiveEditFormOneLineCode = editFormCodeContainerFactory(RactiveCodeContainerOneLine);

  window.RactiveEditFormMultilineCode = editFormCodeContainerFactory(RactiveCodeContainerMultiline);

}).call(this);

//# sourceMappingURL=code-container.js.map
