(function() {
  // (Element|String, Array[Widget], String, String, Boolean, String, String, BrowserCompiler) => WidgetController
  var entwine, entwineDimensions;

  window.initializeUI = function(containerArg, widgets, code, info, isReadOnly, filename, compiler) {
    var configs, container, controller, ractive, updateUI, viewController, viewModel;
    container = typeof containerArg === 'string' ? document.querySelector(containerArg) : containerArg;
    // This sucks. The buttons need to be able to invoke a redraw and widget
    // update (unless we want to wait for the next natural redraw, possibly one
    // second depending on speed slider), but we can't make the controller until
    // the widgets are filled out. So, we close over the `controller` variable
    // and then fill it out at the end when we actually make the thing.
    // BCH 11/10/2014
    controller = null;
    updateUI = function() {
      controller.redraw();
      return controller.updateWidgets();
    };
    window.setUpWidgets(widgets, updateUI);
    ractive = window.generateRactiveSkeleton(container, widgets, code, info, isReadOnly, filename, function(code) {
      return compiler.isReporter(code);
    });
    container.querySelector('.netlogo-model').focus();
    viewModel = widgets.find(function({type}) {
      return type === 'view';
    });
    ractive.set('primaryView', viewModel);
    viewController = new ViewController(container.querySelector('.netlogo-view-container'), viewModel.fontSize);
    entwineDimensions(viewModel, viewController.model.world);
    entwine([[viewModel, "fontSize"], [viewController.view, "fontSize"]], viewModel.fontSize);
    configs = window.genConfigs(ractive, viewController, container, compiler);
    controller = new WidgetController(ractive, viewController, configs);
    window.controlEventTraffic(controller);
    window.handleWidgetSelection(ractive);
    window.handleContextMenu(ractive);
    return controller;
  };

  // (Array[(Object[Any], String)], Any) => Unit
  entwine = function(objKeyPairs, value) {
    var backingValue, i, key, len, obj;
    backingValue = value;
    for (i = 0, len = objKeyPairs.length; i < len; i++) {
      [obj, key] = objKeyPairs[i];
      Object.defineProperty(obj, key, {
        get: function() {
          return backingValue;
        },
        set: function(newValue) {
          return backingValue = newValue;
        }
      });
    }
  };

  // (Widgets.View, ViewController.View) => Unit
  entwineDimensions = function(viewWidget, modelView) {
    var mName, translations, wName;
    translations = {
      maxPxcor: "maxpxcor",
      maxPycor: "maxpycor",
      minPxcor: "minpxcor",
      minPycor: "minpycor",
      patchSize: "patchsize",
      wrappingAllowedInX: "wrappingallowedinx",
      wrappingAllowedInY: "wrappingallowediny"
    };
    for (wName in translations) {
      mName = translations[wName];
      entwine([[viewWidget.dimensions, wName], [modelView, mName]], viewWidget.dimensions[wName]);
    }
  };

}).call(this);

//# sourceMappingURL=initialize-ui.js.map
