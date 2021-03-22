(function() {
  var DEFAULT_REDRAW_DELAY, FAST_UPDATE_EXP, MAX_REDRAW_DELAY, MAX_UPDATE_DELAY, MAX_UPDATE_TIME, NETLOGO_VERSION, REDRAW_EXP, SLOW_UPDATE_EXP, globalEval, now, ref,
    splice = [].splice;

  MAX_UPDATE_DELAY = 1000;

  FAST_UPDATE_EXP = 0.5;

  SLOW_UPDATE_EXP = 4;

  MAX_UPDATE_TIME = 100;

  DEFAULT_REDRAW_DELAY = 1000 / 30;

  MAX_REDRAW_DELAY = 1000;

  REDRAW_EXP = 2;

  NETLOGO_VERSION = '2.8.4';

  // performance.now gives submillisecond timing, which improves the event loop
  // for models with submillisecond go procedures. Unfortunately, iOS Safari
  // doesn't support it. BCH 10/3/2014
  now = (ref = typeof performance !== "undefined" && performance !== null ? performance.now.bind(performance) : void 0) != null ? ref : Date.now.bind(Date);

  // See http://perfectionkills.com/global-eval-what-are-the-options/ for what
  // this is doing. This is a holdover till we get the model attaching to an
  // object instead of global namespace. - BCH 11/3/2014
  globalEval = eval;

  window.AgentModel = tortoise_require('agentmodel');

  window.SessionLite = (function() {
    class SessionLite {
      
        // (Element|String, BrowserCompiler, Array[Rewriter], Array[Widget],
      //   String, String, Boolean, String, String, Boolean, (String) => Unit)
      constructor(container, compiler, rewriters, widgets, code, info, readOnly, filename, modelJS, lastCompileFailed, displayError) {
        var ref1;
        this.eventLoop = this.eventLoop.bind(this);
        this.promptFilename = this.promptFilename.bind(this);
        this.alertErrors = this.alertErrors.bind(this);
        this.compiler = compiler;
        this.rewriters = rewriters;
        this.displayError = displayError;
        this._eventLoopTimeout = -1;
        this._lastRedraw = 0;
        this._lastUpdate = 0;
        this.drawEveryFrame = false;
        this.widgetController = initializeUI(container, widgets, code, info, readOnly, filename, this.compiler);
        this.widgetController.ractive.on('*.recompile', (_, callback) => {
          return this.recompile(callback);
        });
        this.widgetController.ractive.on('*.recompile-lite', (_, callback) => {
          return this.recompileLite(callback);
        });
        this.widgetController.ractive.on('export-nlogo', (_, event) => {
          return this.exportNlogo(event);
        });
        this.widgetController.ractive.on('export-html', (_, event) => {
          return this.exportHtml(event);
        });
        this.widgetController.ractive.on('open-new-file', (_, event) => {
          return this.openNewFile();
        });
        this.widgetController.ractive.on('*.run', (_, code, errorLog) => {
          return this.run(code, errorLog);
        });
        this.widgetController.ractive.on('*.set-global', (_, varName, value) => {
          return this.setGlobal(varName, value);
        });
        this.widgetController.ractive.set('lastCompileFailed', lastCompileFailed);
        window.modelConfig = Object.assign((ref1 = window.modelConfig) != null ? ref1 : {}, this.widgetController.configs);
        window.modelConfig.version = NETLOGO_VERSION;
        globalEval(modelJS);
      }

      modelTitle() {
        return this.widgetController.ractive.get('modelTitle');
      }

      startLoop() {
        if (procedures.startup != null) {
          window.handlingErrors(procedures.startup)();
        }
        this.widgetController.redraw();
        this.widgetController.updateWidgets();
        return requestAnimationFrame(this.eventLoop);
      }

      updateDelay() {
        var delay, speed, speedFactor, viewWidget;
        viewWidget = this.widgetController.widgets().filter(function({type}) {
          return type === 'view';
        })[0];
        speed = this.widgetController.speed();
        delay = 1000 / viewWidget.frameRate;
        if (speed > 0) {
          speedFactor = Math.pow(Math.abs(speed), FAST_UPDATE_EXP);
          return delay * (1 - speedFactor);
        } else {
          speedFactor = Math.pow(Math.abs(speed), SLOW_UPDATE_EXP);
          return MAX_UPDATE_DELAY * speedFactor + delay * (1 - speedFactor);
        }
      }

      redrawDelay() {
        var speed, speedFactor;
        speed = this.widgetController.speed();
        if (speed > 0) {
          speedFactor = Math.pow(Math.abs(this.widgetController.speed()), REDRAW_EXP);
          return MAX_REDRAW_DELAY * speedFactor + DEFAULT_REDRAW_DELAY * (1 - speedFactor);
        } else {
          return DEFAULT_REDRAW_DELAY;
        }
      }

      eventLoop(timestamp) {
        var i, j, maxNumUpdates, ref1, updatesDeadline;
        this._eventLoopTimeout = requestAnimationFrame(this.eventLoop);
        updatesDeadline = Math.min(this._lastRedraw + this.redrawDelay(), now() + MAX_UPDATE_TIME);
        maxNumUpdates = this.drawEveryFrame ? 1 : (now() - this._lastUpdate) / this.updateDelay();
        if (!this.widgetController.ractive.get('isEditing')) {
// maxNumUpdates can be 0. Need to guarantee i is ascending.
          for (i = j = 1, ref1 = maxNumUpdates; j <= ref1; i = j += 1) {
            this._lastUpdate = now();
            this.widgetController.runForevers();
            if (now() >= updatesDeadline) {
              break;
            }
          }
        }
        if (Updater.hasUpdates()) {
          // First conditional checks if we're on time with updates. If so, we may as
          // well redraw. This keeps animations smooth for fast models. BCH 11/4/2014
          if (i > maxNumUpdates || now() - this._lastRedraw > this.redrawDelay() || this.drawEveryFrame) {
            this._lastRedraw = now();
            this.widgetController.redraw();
          }
        }
        // Widgets must always be updated, because global variables and plots can be
        // altered without triggering an "update".  That is to say that `Updater`
        // only concerns itself with View updates. --JAB (9/2/15)
        return this.widgetController.updateWidgets();
      }

      teardown() {
        this.widgetController.teardown();
        return cancelAnimationFrame(this._eventLoopTimeout);
      }

      // (() => Unit) => Unit
      recompileLite(successCallback = (function() {})) {
        var lastCompileFailed, someWidgetIsFailing;
        lastCompileFailed = this.widgetController.ractive.get('lastCompileFailed');
        someWidgetIsFailing = this.widgetController.widgets().some(function(w) {
          var ref1;
          return ((ref1 = w.compilation) != null ? ref1.success : void 0) === false;
        });
        if (lastCompileFailed || someWidgetIsFailing) {
          this.recompile(successCallback);
        }
      }

      // (String) => String
      rewriteCode(code) {
        var rewriter;
        rewriter = function(newCode, rw) {
          if (rw.injectCode != null) {
            return rw.injectCode(newCode);
          } else {
            return newCode;
          }
        };
        return this.rewriters.reduce(rewriter, code);
      }

      rewriteExport(code) {
        var rewriter;
        rewriter = function(newCode, rw) {
          if (rw.exportCode != null) {
            return rw.exportCode(newCode);
          } else {
            return newCode;
          }
        };
        return this.rewriters.reduce(rewriter, code);
      }

      // () => Array[String]
      rewriterCommands() {
        var extrasReducer;
        extrasReducer = function(extras, rw) {
          if (rw.getExtraCommands != null) {
            return extras.concat(rw.getExtraCommands());
          } else {
            return extras;
          }
        };
        return this.rewriters.reduce(extrasReducer, []);
      }

      // (String, String, Array[String])
      rewriteErrors(original, rewritten, errors) {
        var rewriter;
        errors = errors.map((r) => {
          r.lineNumber = rewritten.slice(0, r.start).split("\n").length;
          return r;
        });
        rewriter = function(newErrors, rw) {
          if (rw.updateErrors != null) {
            return rw.updateErrors(original, rewritten, newErrors);
          } else {
            return newErrors;
          }
        };
        return this.rewriters.reduce(rewriter, errors);
      }

      // (() => Unit) => Unit
      recompile(successCallback = (function() {})) {
        var code, compileParams, extraCommands, oldWidgets, rewritten;
        code = this.widgetController.code();
        oldWidgets = this.widgetController.widgets();
        rewritten = this.rewriteCode(code);
        extraCommands = this.rewriterCommands();
        compileParams = {
          code: rewritten,
          widgets: oldWidgets,
          commands: extraCommands,
          reporters: [],
          turtleShapes: typeof turtleShapes !== "undefined" && turtleShapes !== null ? turtleShapes : [],
          linkShapes: typeof linkShapes !== "undefined" && linkShapes !== null ? linkShapes : []
        };
        Tortoise.startLoading(() => {
          var errors, ex, res, state;
          try {
            res = this.compiler.fromModel(compileParams);
            if (res.model.success) {
              state = world.exportState();
              this.widgetController.redraw(); // Redraw right before `Updater` gets clobbered --JAB (2/27/18)
              globalEval(res.model.result);
              world.importState(state);
              this.widgetController.ractive.set('isStale', false);
              this.widgetController.ractive.set('lastCompiledCode', code);
              this.widgetController.ractive.set('lastCompileFailed', false);
              this.widgetController.redraw();
              this.widgetController.freshenUpWidgets(oldWidgets, globalEval(res.widgets));
              successCallback();
              res.commands.forEach(function(c) {
                if (c.success) {
                  return (new Function(c.result))();
                }
              });
              this.rewriters.forEach(function(rw) {
                return typeof rw.compileComplete === "function" ? rw.compileComplete() : void 0;
              });
            } else {
              this.widgetController.ractive.set('lastCompileFailed', true);
              errors = this.rewriteErrors(code, rewritten, res.model.result);
              this.alertCompileError(errors);
            }
          } catch (error) {
            ex = error;
            this.alertCompileError([ex], this.alertErrors);
          } finally {
            Tortoise.finishLoading();
          }
        });
      }

      getNlogo() {
        return this.compiler.exportNlogo({
          info: Tortoise.toNetLogoMarkdown(this.widgetController.ractive.get('info')),
          code: this.rewriteExport(this.widgetController.code()),
          widgets: this.widgetController.widgets(),
          turtleShapes: turtleShapes,
          linkShapes: linkShapes
        });
      }

      exportNlogo() {
        var exportBlob, exportName, exportedNLogo;
        exportName = this.promptFilename(".nlogo");
        if (exportName != null) {
          exportedNLogo = this.getNlogo();
          if (exportedNLogo.success) {
            exportBlob = new Blob([exportedNLogo.result], {
              type: "text/plain:charset=utf-8"
            });
            return saveAs(exportBlob, exportName);
          } else {
            return this.alertCompileError(exportedNLogo.result);
          }
        }
      }

      promptFilename(extension) {
        var suggestion;
        suggestion = this.modelTitle() + extension;
        return window.prompt('Filename:', suggestion);
      }

      exportHtml() {
        var exportName;
        exportName = this.promptFilename(".html");
        if (exportName != null) {
          window.req = new XMLHttpRequest();
          req.open('GET', standaloneURL);
          req.onreadystatechange = () => {
            var dom, exportBlob, nlogo, nlogoScript, parser, wrapper;
            if (req.readyState === req.DONE) {
              if (req.status === 200) {
                nlogo = this.getNlogo();
                if (nlogo.success) {
                  parser = new DOMParser();
                  dom = parser.parseFromString(req.responseText, "text/html");
                  nlogoScript = dom.querySelector("#nlogo-code");
                  nlogoScript.textContent = nlogo.result;
                  nlogoScript.dataset.filename = exportName.replace(/\.html$/, ".nlogo");
                  wrapper = document.createElement("div");
                  wrapper.appendChild(dom.documentElement);
                  exportBlob = new Blob([wrapper.innerHTML], {
                    type: "text/html:charset=utf-8"
                  });
                  return saveAs(exportBlob, exportName);
                } else {
                  return this.alertCompileError(nlogo.result);
                }
              } else {
                return alert("Couldn't get standalone page");
              }
            }
          };
          return req.send("");
        }
      }

      // () => Unit
      openNewFile() {
        if (confirm('Are you sure you want to open a new model?  You will lose any changes that you have not exported.')) {
          parent.postMessage({
            hash: "NewModel",
            type: "nlw-set-hash"
          }, "*");
          window.postMessage({
            type: "nlw-open-new"
          }, "*");
        }
      }

      // (Object[Any], ([{ config: Object[Any], results: Object[Array[Any]] }]) => Unit) => Unit
      asyncRunBabyBehaviorSpace(config, reaction) {
        return Tortoise.startLoading(() => {
          reaction(this.runBabyBehaviorSpace(config));
          return Tortoise.finishLoading();
        });
      }

      // (Object[Any]) => [{ config: Object[Any], results: Object[Array[Any]] }]
      runBabyBehaviorSpace({experimentName, parameterSet, repetitionsPerCombo, metrics, setupCode, goCode, stopConditionCode, iterationLimit}) {
        var _, compiledMetrics, convert, go, last, map, massagedConfig, metricFs, miniDump, pipeline, ref1, result, rewritten, setGlobal, setup, stopCondition, toObject, unwrapCompilation, zip;
        ({last, map, toObject, zip} = tortoise_require('brazier/array'));
        ({pipeline} = tortoise_require('brazier/function'));
        rewritten = this.rewriteCode(this.widgetController.code());
        result = this.compiler.fromModel({
          code: rewritten,
          widgets: this.widgetController.widgets(),
          commands: [setupCode, goCode],
          reporters: metrics.map(function(m) {
            return m.reporter;
          }).concat([stopConditionCode]),
          turtleShapes: [],
          linkShapes: []
        });
        unwrapCompilation = function(prefix, defaultCode) {
          return function({
              result: compiledCode,
              success
            }) {
            return new Function(`${prefix}${success ? compiledCode : defaultCode}`);
          };
        };
        [setup, go] = result.commands.map(unwrapCompilation("", ""));
        ref1 = result.reporters.map(unwrapCompilation("return ", "-1")), [...metricFs] = ref1, [_] = splice.call(metricFs, -1);
        stopCondition = unwrapCompilation("return ", "false")(last(result.reporters));
        convert = function([{reporter, interval}, f]) {
          return [
            reporter,
            {
              reporter: f,
              interval
            }
          ];
        };
        compiledMetrics = pipeline(zip(metrics), map(convert), toObject)(metricFs);
        massagedConfig = {
          experimentName,
          parameterSet,
          repetitionsPerCombo,
          metrics: compiledMetrics,
          setup,
          go,
          stopCondition,
          iterationLimit
        };
        setGlobal = world.observer.setGlobal.bind(world.observer);
        miniDump = function(x) {
          var ref2;
          if (Array.isArray(x)) {
            return x.map(miniDump);
          } else if ((ref2 = typeof x) === "boolean" || ref2 === "number" || ref2 === "string") {
            return x;
          } else {
            return workspace.dump(x);
          }
        };
        return window.runBabyBehaviorSpace(massagedConfig, setGlobal, miniDump);
      }

      // (String, Any) => Unit
      setGlobal(varName, value) {
        world.observer.setGlobal(varName, value);
      }

      // (String, (Array[String]) => Unit) => Unit
      run(code, errorLog) {
        var command, commandResult, compileErrorLog, ex, result, success;
        compileErrorLog = (result) => {
          return this.alertCompileError(result, errorLog);
        };
        commandResult = this.compiler.compileCommand(code);
        ({result, success} = commandResult);
        if (!success) {
          compileErrorLog(result);
          return;
        }
        command = new Function(result);
        try {
          window.handlingErrors(command)(errorLog);
        } catch (error) {
          ex = error;
          if (!(ex instanceof Exception.HaltInterrupt)) {
            throw ex;
          }
        }
      }

      // (String, (String, Array[{ message: String}]) => String) =>
      //  { success: true, value: Any } | { success: false, error: String }
      runReporter(code, errorLog) {
        var ex, message, reporter, reporterValue, result, success;
        errorLog = errorLog != null ? errorLog : function(prefix, errs) {
          var message;
          message = `${prefix}: ${errs.map(function(err) {
            return err.message;
          })}`;
          console.error(message);
          return message;
        };
        result = this.compiler.compileReporter(code);
        ({result, success} = reporterResult);
        if (!success) {
          message = errorLog("Reporter error", result);
          return {
            success: false,
            error: message
          };
        }
        reporter = new Function(`return ( ${result} );`);
        try {
          reporterValue = reporter();
          return {
            success: true,
            value: reporterValue
          };
        } catch (error) {
          ex = error;
          message = errorLog("Runtime error", [ex]);
          return {
            success: false,
            error: message
          };
        }
      }

      alertCompileError(result, errorLog = this.alertErrors) {
        return errorLog(result.map(function(err) {
          if (err.lineNumber != null) {
            return `(Line ${err.lineNumber}) ${err.message}`;
          } else {
            return err.message;
          }
        }));
      }

      alertErrors(messages) {
        return this.displayError(messages.join('\n'));
      }

    };

    SessionLite.prototype.widgetController = void 0; // WidgetController

    return SessionLite;

  }).call(this);

}).call(this);

//# sourceMappingURL=session-lite.js.map
