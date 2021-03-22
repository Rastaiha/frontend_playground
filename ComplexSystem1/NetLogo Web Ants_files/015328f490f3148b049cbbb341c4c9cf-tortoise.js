(function() {
  var Tortoise, defaultDisplayError, finishLoading, fromNlogo, fromNlogoWithoutCode, fromURL, globalEval, handleAjaxLoad, handleCompilation, loadData, loadError, loading, newSession, nlogoToSections, normalizedFileName, openSession, reportAjaxError, reportCompilerError, sectionsToNlogo, startLoading, toNetLogoMarkdown, toNetLogoWebMarkdown;

  loadError = function(url) {
    return `Unable to load NetLogo model from ${url}, please ensure:
<ul>
  <li>That you can download the resource <a target="_blank" href="${url}">at this link</a></li>
  <li>That the server containing the resource has
    <a target="_blank" href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing">
      Cross-Origin Resource Sharing
    </a>
    configured appropriately</li>
</ul>
If you have followed the above steps and are still seeing this error,
please send an email to our <a href="mailto:bugs@ccl.northwestern.edu">"bugs" mailing list</a>
with the following information:
<ul>
  <li>The full URL of this page (copy and paste from address bar)</li>
  <li>Your operating system and browser version</li>
</ul>`;
  };

  toNetLogoWebMarkdown = function(md) {
    return md.replace(new RegExp('<!---*\\s*((?:[^-]|-+[^->])*)\\s*-*-->', 'g'), function(match, commentText) {
      return `[nlw-comment]: <> (${commentText.trim()})`;
    });
  };

  toNetLogoMarkdown = function(md) {
    return md.replace(new RegExp('\\[nlw-comment\\]: <> \\(([^\\)]*)\\)', 'g'), function(match, commentText) {
      return `<!-- ${commentText} -->`;
    });
  };

  // handleAjaxLoad : String, (String) => (), (XMLHttpRequest) => () => Unit
  handleAjaxLoad = (url, onSuccess, onFailure) => {
    var req;
    req = new XMLHttpRequest();
    req.open('GET', url);
    req.onreadystatechange = function() {
      if (req.readyState === req.DONE) {
        if (req.status === 0 || req.status >= 400) {
          return onFailure(req);
        } else {
          return onSuccess(req.responseText);
        }
      }
    };
    return req.send("");
  };

  // newSession: String|DomElement, BrowserCompiler, Array[Rewriter], ModelResult,
  //   Boolean, String => SessionLite
  newSession = function(container, compiler, rewriters, modelResult, readOnly = false, filename = "export", lastCompileFailed, onError = void 0) {
    var code, info, result, widgets, wiggies;
    ({
      code,
      info,
      model: {result},
      widgets: wiggies
    } = modelResult);
    widgets = globalEval(wiggies);
    info = toNetLogoWebMarkdown(info);
    return new SessionLite(container, compiler, rewriters, widgets, code, info, readOnly, filename, result, lastCompileFailed, onError);
  };

  // We separate on both / and \ because we get URLs and Windows-esque filepaths
  normalizedFileName = function(path) {
    var pathComponents;
    pathComponents = path.split(/\/|\\/);
    return decodeURI(pathComponents[pathComponents.length - 1]);
  };

  loadData = function(container, pathOrURL, name, loader, onError) {
    return {
      container,
      loader,
      onError,
      modelPath: pathOrURL,
      name
    };
  };

  openSession = function(load, compiler, rewriters) {
    return function(model, lastCompileFailed) {
      var name, ref, session;
      name = (ref = load.name) != null ? ref : normalizedFileName(load.modelPath);
      session = newSession(load.container, compiler, rewriters, model, false, name, lastCompileFailed, load.onError);
      load.loader.finish();
      return session;
    };
  };

  // process: function which takes a loader as an argument, producing a function that can be run
  loading = function(process) {
    var loader;
    document.querySelector("#loading-overlay").style.display = "";
    loader = {
      finish: function() {
        return document.querySelector("#loading-overlay").style.display = "none";
      }
    };
    return setTimeout(process(loader), 20);
  };

  defaultDisplayError = function(container) {
    return function(errors) {
      return container.innerHTML = `<div style='padding: 5px 10px;'>${errors}</div>`;
    };
  };

  reportCompilerError = function(load) {
    return function(res) {
      var errors;
      errors = res.model.result.map(function(err) {
        var contains, message;
        contains = function(s, x) {
          return s.indexOf(x) > -1;
        };
        message = err.message;
        if (contains(message, "Couldn't find corresponding reader") || contains(message, "Models must have 12 sections")) {
          return `${message} (see <a href='https://netlogoweb.org/docs/faq#model-format-error'>here</a> for more information)`;
        } else {
          return message;
        }
      }).join('<br/>');
      load.onError(errors);
      return load.loader.finish();
    };
  };

  reportAjaxError = function(load) {
    return function(req) {
      load.onError(loadError(load.modelPath));
      return load.loader.finish();
    };
  };

  // process: optional argument that allows the loading process to be async to
  // give the animation time to come up.
  startLoading = function(process) {
    document.querySelector("#loading-overlay").style.display = "";
    // This gives the loading animation time to come up. BCH 7/25/2015
    if ((process != null)) {
      return setTimeout(process, 20);
    }
  };

  finishLoading = function() {
    return document.querySelector("#loading-overlay").style.display = "none";
  };

  fromNlogo = function(nlogo, container, path, callback, onError = defaultDisplayError(container), rewriters = []) {
    return loading(function(loader) {
      var load, name, segments;
      segments = path.split(/\/|\\/);
      name = segments[segments.length - 1];
      load = loadData(container, path, name, loader, onError);
      return handleCompilation(nlogo, callback, load, rewriters);
    });
  };

  fromURL = function(url, modelName, container, callback, onError = defaultDisplayError(container), rewriters = []) {
    return loading(function(loader) {
      var compile, load;
      load = loadData(container, url, modelName, loader, onError);
      compile = function(nlogo) {
        return handleCompilation(nlogo, callback, load, rewriters);
      };
      return handleAjaxLoad(url, compile, reportAjaxError(load));
    });
  };

  handleCompilation = function(nlogo, callback, load, rewriters) {
    var compiler, extraCommands, extrasReducer, onFailure, onSuccess, result, rewriter, rewrittenNlogo, success;
    compiler = new BrowserCompiler();
    onSuccess = function(input, lastCompileFailed) {
      callback(openSession(load, compiler, rewriters)(input, lastCompileFailed));
      input.commands.forEach(function(c) {
        if (c.success) {
          return (new Function(c.result))();
        }
      });
      return rewriters.forEach(function(rw) {
        return typeof rw.compileComplete === "function" ? rw.compileComplete() : void 0;
      });
    };
    onFailure = reportCompilerError(load);
    rewriter = function(newCode, rw) {
      if (rw.injectNlogo != null) {
        return rw.injectNlogo(newCode);
      } else {
        return newCode;
      }
    };
    rewrittenNlogo = rewriters.reduce(rewriter, nlogo);
    extrasReducer = function(extras, rw) {
      if (rw.getExtraCommands != null) {
        return extras.concat(rw.getExtraCommands());
      } else {
        return extras;
      }
    };
    extraCommands = rewriters.reduce(extrasReducer, []);
    result = compiler.fromNlogo(rewrittenNlogo, extraCommands);
    if (result.model.success) {
      result.code = nlogo === rewrittenNlogo ? result.code : nlogoToSections(nlogo)[0].slice(0, -1);
      return onSuccess(result, false);
    } else {
      success = fromNlogoWithoutCode(nlogo, compiler, onSuccess);
      onFailure(result, success);
    }
  };

  nlogoToSections = function(nlogo) {
    return nlogo.split(/^\@#\$#\@#\$#\@$/gm);
  };

  sectionsToNlogo = function(sections) {
    return sections.join("@#$#@#$#@");
  };

  // If we have a compiler failure, maybe just the code section has errors.
  // We do a second chance compile to see if it'll work without code so we
  // can get some widgets/plots on the screen and let the user fix those
  // errors up.  -JMB August 2017

  // (String, BrowserCompiler, (Model) => Session?) => Boolean
  fromNlogoWithoutCode = function(nlogo, compiler, onSuccess) {
    var newNlogo, oldCode, result, sections;
    sections = nlogoToSections(nlogo);
    if (sections.length !== 12) {
      return false;
    } else {
      oldCode = sections[0];
      sections[0] = "";
      newNlogo = sectionsToNlogo(sections);
      result = compiler.fromNlogo(newNlogo, []);
      if (!result.model.success) {
        return false;
      } else {
        // It mutates state, but it's an easy way to get the code re-added
        // so it can be edited/fixed.
        result.code = oldCode;
        onSuccess(result, true);
        return result.model.success;
      }
    }
  };

  Tortoise = {startLoading, finishLoading, fromNlogo, fromURL, toNetLogoMarkdown, toNetLogoWebMarkdown, nlogoToSections, sectionsToNlogo};

  if (typeof window !== "undefined" && window !== null) {
    window.Tortoise = Tortoise;
  } else {
    exports.Tortoise = Tortoise;
  }

  // See http://perfectionkills.com/global-eval-what-are-the-options/ for what
  // this is doing. This is a holdover till we get the model attaching to an
  // object instead of global namespace. - BCH 11/3/2014
  globalEval = eval;

}).call(this);

//# sourceMappingURL=tortoise.js.map
