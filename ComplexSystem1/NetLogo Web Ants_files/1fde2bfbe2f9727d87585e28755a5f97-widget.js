(function() {
  var WidgetEventGenerators,
    splice = [].splice;

  WidgetEventGenerators = {
    recompile: function() {
      return {
        run: function(ractive, widget) {
          return ractive.fire('recompile');
        },
        type: "recompile"
      };
    },
    recompileLite: function() {
      return {
        run: function(ractive, widget) {
          return ractive.fire('recompile-lite');
        },
        type: "recompile-lite"
      };
    },
    redrawView: function() {
      return {
        run: function(ractive, widget) {
          return ractive.fire('redraw-view');
        },
        type: "redrawView"
      };
    },
    refreshChooser: function() {
      return {
        // For whatever reason, if Ractive finds second argument of `fire` to be an object (in this case, our `widget`),
        // it merges that arg into the context and ruins everything. --JAB (4/8/18)
        run: function(ractive, widget) {
          return ractive.fire('refresh-chooser', "ignore", widget);
        },
        type: "refreshChooser"
      };
    },
    rename: function(oldName, newName) {
      return {
        run: function(ractive, widget) {
          return ractive.fire('rename-interface-global', oldName, newName, widget.currentValue);
        },
        type: `rename:${oldName},${newName}`
      };
    },
    resizePatches: function() {
      return {
        run: function(ractive, widget) {
          return ractive.fire('set-patch-size', widget.dimensions.patchSize);
        },
        type: "resizePatches"
      };
    },
    resizeView: function() {
      return {
        run: function(ractive, widget) {
          return ractive.fire('resize-view');
        },
        type: "resizeView"
      };
    },
    updateEngineValue: function() {
      return {
        run: function(ractive, widget) {
          return world.observer.setGlobal(widget.variable, widget.currentValue);
        },
        type: "updateCurrentValue"
      };
    },
    updateTopology: function() {
      return {
        run: function(ractive, widget) {
          return ractive.fire('update-topology');
        },
        type: "updateTopology"
      };
    }
  };

  window.RactiveWidget = RactiveDraggableAndContextable.extend({
    _weg: WidgetEventGenerators,
    data: function() {
      return {
        id: void 0, // String
        isEditing: void 0, // Boolean
        isSelected: void 0, // Boolean
        resizeDirs: ['left', 'right', 'top', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
        widget: void 0 // Widget
      };
    },
    components: {
      editForm: void 0 // Element
    },
    computed: {
      classes: function() {
        return `${this.get('isEditing') ? 'interface-unlocked' : ''}
${this.get('isSelected') ? 'selected' : ''}`;
      },
      dims: function() {
        return `position: absolute;
left: ${this.get('left')}px; top: ${this.get('top')}px;
width: ${this.get('right') - this.get('left')}px; height: ${this.get('bottom') - this.get('top')}px;`;
      }
    },
    // (Object[Number]) => Unit
    handleResize: function({left, right, top, bottom}) {
      this.set('widget.left', left);
      this.set('widget.right', right);
      this.set('widget.top', top);
      this.set('widget.bottom', bottom);
    },
    // () => Unit
    handleResizeEnd: function() {},
    on: {
      'edit-widget': function() {
        if (this.get('isNotEditable') !== true) {
          this.fire('hide-context-menu');
          this.findComponent('editForm').fire("show-yourself");
          false;
        }
      },
      init: function() {
        var ref;
        if ((ref = this.findComponent('editForm')) != null) {
          ref.fire("activate-cloaking-device");
        }
      },
      'initialize-widget': function() {
        this.findComponent('editForm').fire("prove-your-worth");
        return false;
      },
      "*.has-been-proven-unworthy": function() {
        return this.fire('unregister-widget', this.get('widget').id, true); // Original event name: "cutMyLifeIntoPieces" --JAB (11/8/17)
      },
      "*.update-widget-value": function(_, values) {
        var event, eventArraysArray, events, ex, getByPath, i, isTroublesome, k, len, name, newies, oldies, scrapeWidget, setByPath, triggerNames, triggers, uniqueEvents, v, widget, widgets;
        getByPath = function(obj) {
          return function(path) {
            return path.split('.').reduce((function(acc, x) {
              return acc[x];
            }), obj);
          };
        };
        setByPath = function(obj) {
          return function(path) {
            return function(value) {
              var key, lastParent, parents, ref;
              ref = path.split('.'), [...parents] = ref, [key] = splice.call(parents, -1);
              lastParent = parents.reduce((function(acc, x) {
                return acc[x];
              }), obj);
              return lastParent[key] = value;
            };
          };
        };
        try {
          widget = this.get('widget');
          widgets = Object.values(this.parent.get('widgetObj'));
          isTroublesome = function(w) {
            return w.variable === values.variable && w.type !== widget.type;
          };
          if ((values.variable != null) && widgets.some(isTroublesome)) {
            return this.fire('reject-duplicate-var', values.variable);
          } else {
            scrapeWidget = function(widget, triggerNames) {
              return triggerNames.reduce((function(acc, x) {
                acc[x] = getByPath(widget)(x);
                return acc;
              }), {});
            };
            triggers = this.eventTriggers();
            triggerNames = Object.keys(triggers);
            oldies = scrapeWidget(widget, triggerNames);
            for (k in values) {
              v = values[k];
              setByPath(widget)(k)(v);
            }
            newies = scrapeWidget(widget, triggerNames);
            eventArraysArray = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = triggerNames.length; i < len; i++) {
                name = triggerNames[i];
                if (newies[name] !== oldies[name]) {
                  results.push(triggers[name].map(function(constructEvent) {
                    return constructEvent(oldies[name], newies[name]);
                  }));
                }
              }
              return results;
            })();
            events = [].concat(...eventArraysArray);
            uniqueEvents = events.reduce((function(acc, x) {
              if (acc.find(function(y) {
                return y.type === x.type;
              }) == null) {
                return acc.concat([x]);
              } else {
                return acc;
              }
            }), []);
            for (i = 0, len = uniqueEvents.length; i < len; i++) {
              event = uniqueEvents[i];
              event.run(this, widget);
            }
            return this.fire('update-widgets');
          }
        } catch (error) {
          ex = error;
          return console.error(ex);
        } finally {
          return false;
        }
      }
    },
    partials: {
      editorOverlay: `{{ #isEditing }}
  <div draggable="true" style="{{dims}}" class="editor-overlay{{#isSelected}} selected{{/}}"
       on-click="@this.fire('hide-context-menu') && @this.fire('select-widget', @event)"
       on-contextmenu="@this.fire('show-context-menu', @event)"
       on-dblclick="@this.fire('edit-widget')"
       on-dragstart="start-widget-drag"
       on-drag="drag-widget"
       on-dragend="stop-widget-drag"></div>
{{/}}`
    }
  });

}).call(this);

//# sourceMappingURL=widget.js.map
