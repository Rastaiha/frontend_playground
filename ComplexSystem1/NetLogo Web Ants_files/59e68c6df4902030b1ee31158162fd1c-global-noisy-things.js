(function() {
  window.NLWAlerter = class NLWAlerter {
    // Element -> Boolean -> NLWAlerter
    constructor(_alertWindow, _isStandalone) {
      this._alertWindow = _alertWindow;
      this._isStandalone = _isStandalone;
      this.alertContainer = this._alertWindow.querySelector("#alert-dialog");
    }

    // String -> Boolean -> String -> Unit
    display(title, dismissable, content) {
      this._alertWindow.querySelector("#alert-title").innerHTML = title;
      this._alertWindow.querySelector("#alert-message").innerHTML = content.replace(/(?:\n)/g, "<br>");
      if (this._isStandalone) {
        this._alertWindow.querySelector(".standalone-text").style.display = '';
      }
      if (!dismissable) {
        this._alertWindow.querySelector("#alert-dismiss-container").style.display = 'none';
      } else {
        this._alertWindow.querySelector("#alert-dismiss-container").style.display = '';
      }
      this._alertWindow.style.display = '';
    }

    // String -> Boolean -> String -> Unit
    displayError(content, dismissable = true, title = "Error") {
      this.display(title, dismissable, content);
    }

    // Unit -> Unit
    hide() {
      this._alertWindow.style.display = 'none';
    }

  };

  // (Array[String]) => Unit
  window.showErrors = function(errors) {
    if (errors.length > 0) {
      if (window.nlwAlerter != null) {
        window.nlwAlerter.displayError(errors.join('<br/>'));
      } else {
        alert(errors.join('\n'));
      }
    }
  };

  // [T] @ (() => T) => ((Array[String]) => Unit) => T
  window.handlingErrors = function(f) {
    return function(errorLog = window.showErrors) {
      var ex, message;
      try {
        return f();
      } catch (error) {
        ex = error;
        if (!(ex instanceof Exception.HaltInterrupt)) {
          message = !(ex instanceof TypeError) ? ex.message : `A type error has occurred in the simulation engine.
More information about these sorts of errors can be found
<a href="https://netlogoweb.org/docs/faq#type-errors">here</a>.<br><br>
Advanced users might find the generated error helpful, which is as follows:<br><br>
<b>${ex.message}</b><br><br>`;
          errorLog([message]);
          throw new Exception.HaltInterrupt();
        } else {
          throw ex;
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=global-noisy-things.js.map
