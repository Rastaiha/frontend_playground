(function() {
  /*

    type Metric = {
      interval: Number
    , reporter: () => Any
    }

    type VariableConfig = {
      name:           String
      parameterSpace: { type: "discreteValues", values: Array[Any] }
                    | { type: "range", min: Number, max: Number, interval: Number }
    }

    type BehaviorSpaceConfig =
      {
        experimentName:      String
        parameterSet:        { type: "discreteCombos",   combos:    Array[Object[Any]]    }
                           | { type: "cartesianProduct", variables: Array[VariableConfig] }
        repetitionsPerCombo: Number
        metrics:             Object[Metric]
        setup:               () => Unit
        go:                  () => Unit
        stopCondition:       () => Boolean
        iterationLimit:      Number
      }

    type Results = Array[{ config: Object[Any], results: Object[Object[Any]] }]

   */
  var cartesianProduct, executeRun, genCartesianSet;

  // (BehaviorSpaceConfig, (String, Any) => Unit, (Any) => Any) => Results
  window.runBabyBehaviorSpace = function(config, setGlobal, dump) {
    var combination, experimentName, finalParameterSet, finalResults, flatten, go, iterationLimit, key, metrics, pSet, parameterSet, repetitionsPerCombo, results, setup, stopCondition, value;
    ({experimentName, parameterSet, repetitionsPerCombo, metrics, setup, go, stopCondition, iterationLimit} = config);
    parameterSet = (function() {
      switch (parameterSet.type) {
        case "discreteCombos":
          return parameterSet.combos;
        case "cartesianProduct":
          return genCartesianSet(parameterSet.variables);
        default:
          throw new Exception(`Unknown parameter set type: ${type}`);
      }
    })();
    flatten = function(xs) {
      return [].concat(...xs);
    };
    finalParameterSet = flatten((function() {
      var j, len, results1;
      results1 = [];
      for (j = 0, len = parameterSet.length; j < len; j++) {
        combination = parameterSet[j];
        results1.push((function() {
          var k, ref, results2;
          results2 = [];
          for (k = 1, ref = repetitionsPerCombo; (1 <= ref ? k <= ref : k >= ref); 1 <= ref ? k++ : k--) {
            results2.push(combination);
          }
          return results2;
        })());
      }
      return results1;
    })());
    window.Meta.behaviorSpaceName = experimentName != null ? experimentName : "BabyBehaviorSpace";
    window.Meta.behaviorSpaceRun = 0;
    finalResults = (function() {
      var j, len, results1;
      results1 = [];
      for (j = 0, len = finalParameterSet.length; j < len; j++) {
        pSet = finalParameterSet[j];
        for (key in pSet) {
          value = pSet[key];
          setGlobal(key, value);
        }
        results = executeRun(setup, go, stopCondition, iterationLimit, metrics, dump);
        window.Meta.behaviorSpaceRun = window.Meta.behaviorSpaceRun + 1;
        results1.push({
          config: pSet,
          results
        });
      }
      return results1;
    })();
    window.Meta.behaviorSpaceName = "";
    window.Meta.behaviorSpaceRun = 0;
    return finalResults;
  };

  // Code courtesy of Danny at https://stackoverflow.com/a/36234242/1116979
  // (Array[Array[Any]]) => Array[Array[Any]]
  cartesianProduct = function(xs) {
    return xs.reduce(function(acc, x) {
      var nested;
      nested = acc.map(function(a) {
        return x.map(function(b) {
          return a.concat(b);
        });
      });
      return nested.reduce((function(flattened, l) {
        return flattened.concat(l);
      }), []);
    }, [[]]);
  };

  // (Array[VariableConfig], Number) => Array[Object[Any]]
  genCartesianSet = function(variables) {
    var basicParameterSet, condense;
    basicParameterSet = variables.map(function({
        name,
        parameterSpace: {type, values, min, max, interval}
      }) {
      var x;
      values = (function() {
        var j, ref, ref1, ref2, results1;
        switch (type) {
          case "discreteValues":
            return values;
          case "range":
            results1 = [];
            for (x = j = ref = min, ref1 = max, ref2 = interval; ref2 !== 0 && (ref2 > 0 ? j <= ref1 : j >= ref1); x = j += ref2) {
              results1.push(x);
            }
            return results1;
            break;
          default:
            throw new Exception(`Unknown parameter space type: ${type}`);
        }
      })();
      return values.map(function(value) {
        return {name, value};
      });
    });
    condense = (function(acc, {name, value}) {
      acc[name] = value;
      return acc;
    });
    return cartesianProduct(basicParameterSet).map(function(combo) {
      return combo.reduce(condense, {});
    });
  };

  // (() => Unit, () => Unit, () => Boolean, Number, Object[Metric], (Any) => Any) => Object[Object[Any]]
  executeRun = function(setup, go, stopCondition, iterationLimit, metrics, dump) {
    var iters, maxIters, measure, measurements;
    iters = 0;
    maxIters = iterationLimit < 1 ? -1 : iterationLimit;
    measurements = {};
    measure = function(i) {
      var interval, ms, name, reporter;
      ms = {};
      for (name in metrics) {
        ({reporter, interval} = metrics[name]);
        if (interval === 0 || (i % interval) === 0) {
          ms[name] = dump(reporter());
        }
      }
      if (Object.keys(ms).length > 0) {
        measurements[i] = ms;
      }
    };
    setup();
    while (!stopCondition() && iters < maxIters) {
      measure(iters);
      go();
      iters++;
    }
    measure(iters);
    return measurements;
  };

}).call(this);

//# sourceMappingURL=babybehaviorspace.js.map
