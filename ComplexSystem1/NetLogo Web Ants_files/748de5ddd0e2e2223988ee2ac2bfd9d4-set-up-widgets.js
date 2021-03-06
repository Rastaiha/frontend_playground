(function() {
  // (Array[Widget], () => Unit) => Unit
  var reporterOf;

  window.setUpWidgets = function(widgets, updateUI) {
    var i, id, len, widget;
// Note that this must execute before models so we can't call any model or
// engine functions. BCH 11/5/2014
    for (id = i = 0, len = widgets.length; i < len; id = ++i) {
      widget = widgets[id];
      setUpWidget(widget, id, updateUI);
    }
  };

  reporterOf = function(str) {
    return new Function(`return ${str}`);
  };

  // Destructive - Adds everything for maintaining state to the widget models,
  // such `currentValue`s and actual functions for buttons instead of just code.
  window.setUpWidget = function(widget, id, updateUI) {
    widget.id = id;
    if (widget.variable != null) {
      // Convert from NetLogo variables to Tortoise variables.
      widget.variable = widget.variable.toLowerCase();
    }
    switch (widget.type) {
      case "switch":
        setUpSwitch(widget, widget);
        break;
      case "slider":
        widget.currentValue = widget.default;
        setUpSlider(widget, widget);
        break;
      case "inputBox":
        setUpInputBox(widget, widget);
        break;
      case "button":
        setUpButton(updateUI)(widget, widget);
        break;
      case "chooser":
        setUpChooser(widget, widget);
        break;
      case "monitor":
        setUpMonitor(widget, widget);
    }
  };

  // (InputBox, InputBox) => Unit
  window.setUpInputBox = function(source, destination) {
    destination.boxedValue = source.boxedValue;
    destination.currentValue = destination.boxedValue.value;
    destination.variable = source.variable;
    destination.display = destination.variable;
  };

  // (Switch, Switch) => Unit
  window.setUpSwitch = function(source, destination) {
    destination.on = source.on;
    destination.currentValue = destination.on;
  };

  // (Chooser, Chooser) => Unit
  window.setUpChooser = function(source, destination) {
    destination.choices = source.choices;
    destination.currentChoice = source.currentChoice;
    destination.currentValue = destination.choices[destination.currentChoice];
  };

  // (() => Unit) => (Button, Button) => Unit
  window.setUpButton = function(updateUI) {
    return function(source, destination) {
      var ref, task;
      if (source.forever) {
        destination.running = false;
      }
      if ((ref = source.compilation) != null ? ref.success : void 0) {
        destination.compiledSource = source.compiledSource;
        task = window.handlingErrors(new Function(destination.compiledSource));
        (function(task) {
          var wrappedTask;
          wrappedTask = source.forever ? function() {
            var ex, mustStop;
            mustStop = (function() {
              try {
                return task() instanceof Exception.StopInterrupt;
              } catch (error) {
                ex = error;
                return ex instanceof Exception.HaltInterrupt;
              }
            })();
            if (mustStop) {
              destination.running = false;
              return updateUI();
            }
          } : function() {
            var ex;
            try {
              task();
            } catch (error) {
              ex = error;
              if (!ex instanceof Exception.HaltInterrupt) {
                throw ex;
              }
            }
            return updateUI();
          };
          return (function(wrappedTask) {
            return destination.run = wrappedTask;
          })(wrappedTask);
        })(task);
      } else {
        destination.run = function() {
          var ref1, ref2;
          destination.running = false;
          return showErrors(["Button failed to compile with:"].concat((ref1 = (ref2 = source.compilation) != null ? ref2.messages : void 0) != null ? ref1 : []));
        };
      }
    };
  };

  // (Monitor, Monitor) => Unit
  window.setUpMonitor = function(source, destination) {
    var ref;
    if ((ref = source.compilation) != null ? ref.success : void 0) {
      destination.compiledSource = source.compiledSource;
      destination.reporter = reporterOf(destination.compiledSource);
      destination.currentValue = "";
    } else {
      destination.reporter = function() {
        return "N/A";
      };
      destination.currentValue = "N/A";
    }
  };

  // (Slider, Slider) => Unit
  window.setUpSlider = function(source, destination) {
    var ref;
    destination.default = source.default;
    destination.compiledMin = source.compiledMin;
    destination.compiledMax = source.compiledMax;
    destination.compiledStep = source.compiledStep;
    if ((ref = source.compilation) != null ? ref.success : void 0) {
      destination.getMin = reporterOf(destination.compiledMin);
      destination.getMax = reporterOf(destination.compiledMax);
      destination.getStep = reporterOf(destination.compiledStep);
    } else {
      destination.getMin = function() {
        return destination.currentValue;
      };
      destination.getMax = function() {
        return destination.currentValue;
      };
      destination.getStep = function() {
        return 0.001;
      };
    }
    destination.minValue = destination.currentValue;
    destination.maxValue = destination.currentValue + 1;
    destination.stepValue = 0.001;
  };

}).call(this);

//# sourceMappingURL=set-up-widgets.js.map
