(function() {
  var alreadyHasA, defaultOptions, genWidgetCreator;

  genWidgetCreator = function(name, widgetType, isEnabled = true, enabler = (function() {
      return false;
    })) {
    return {
      text: `Create ${name}`,
      enabler,
      isEnabled,
      action: function(context, mouseX, mouseY) {
        return context.fire('create-widget', widgetType, mouseX, mouseY);
      }
    };
  };

  alreadyHasA = function(componentName) {
    return function(ractive) {
      if (ractive.parent != null) {
        return alreadyHasA(componentName)(ractive.parent);
      } else {
        return ractive.findComponent(componentName) == null;
      }
    };
  };

  defaultOptions = [["Button", "button"], ["Chooser", "chooser"], ["Input", "inputBox"], ["Note", "textBox"], ["Monitor", "monitor"], ["Output", "output", false, alreadyHasA('outputWidget')], ["Plot", "plot", false], ["Slider", "slider"], ["Switch", "switch"]].map(function(args) {
    return genWidgetCreator(...args);
  });

  window.RactiveContextable = Ractive.extend({
    // type ContextMenuOptions = [{ text: String, isEnabled: Boolean, action: () => Unit }]
    data: function() {
      return {
        contextMenuOptions: void 0 // ContextMenuOptions
      };
    },
    standardOptions: function(component) {
      return {
        delete: {
          text: "Delete",
          isEnabled: true,
          action: function() {
            component.fire('hide-context-menu');
            return component.fire('unregister-widget', component.get('widget').id);
          }
        },
        edit: {
          text: "Edit",
          isEnabled: true,
          action: function() {
            return component.fire('edit-widget');
          }
        }
      };
    }
  });

  window.RactiveContextMenu = Ractive.extend({
    data: function() {
      return {
        options: void 0, // ContextMenuOptions
        mouseX: 0, // Number
        mouseY: 0, // Number
        target: void 0, // Ractive
        visible: false // Boolean
      };
    },
    on: {
      'ignore-click': function() {
        return false;
      },
      'cover-thineself': function() {
        this.set('visible', false);
        this.fire('unlock-selection');
      },
      'reveal-thineself': function(_, component, x, y) {
        var ref;
        this.set('target', component);
        this.set('options', (ref = component != null ? component.get('contextMenuOptions') : void 0) != null ? ref : defaultOptions);
        this.set('visible', true);
        this.set('mouseX', x);
        this.set('mouseY', y);
        if (component instanceof RactiveWidget) {
          this.fire('lock-selection', component);
        }
      }
    },
    template: `{{# visible }}
<div id="netlogo-widget-context-menu" class="widget-context-menu" style="top: {{mouseY}}px; left: {{mouseX}}px;">
  <div id="{{id}}-context-menu" class="netlogo-widget-editor-menu-items">
    <ul class="context-menu-list">
      {{# options }}
        {{# (..enabler !== undefined && ..enabler(target)) || ..isEnabled }}
          <li class="context-menu-item" on-mouseup="..action(target, mouseX, mouseY)">{{..text}}</li>
        {{ else }}
          <li class="context-menu-item disabled" on-mouseup="ignore-click">{{..text}}</li>
        {{/}}
      {{/}}
    </ul>
  </div>
</div>
{{/}}`
  });

}).call(this);

//# sourceMappingURL=context-menu.js.map
