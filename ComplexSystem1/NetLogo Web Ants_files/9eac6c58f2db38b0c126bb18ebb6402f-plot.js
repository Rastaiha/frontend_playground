(function() {
  window.RactivePlot = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).delete],
        isNotEditable: true,
        menuIsOpen: false,
        resizeCallback: (function(x, y) {})
      };
    },
    observe: {
      'left right top bottom': function() {
        this.get('resizeCallback')(this.get('right') - this.get('left'), this.get('bottom') - this.get('top'));
      }
    },
    on: {
      render: function() {
        var ractive, topLevel, topLevelObserver;
        ractive = this;
        topLevel = document.querySelector(`#${this.get('id')}`);
        topLevelObserver = new MutationObserver(function(mutations) {
          return mutations.forEach(function({addedNodes}) {
            var container, containerObserver;
            container = Array.from(addedNodes).find(function(elem) {
              return elem.classList.contains("highcharts-container");
            });
            if (container != null) {
              topLevelObserver.disconnect();
              containerObserver = new MutationObserver(function(mutties) {
                return mutties.forEach(function({
                    addedNodes: addedNodies
                  }) {
                  var menu, menuObserver;
                  menu = Array.from(addedNodies).find(function(elem) {
                    return elem.classList.contains("highcharts-contextmenu");
                  });
                  if (menu != null) {
                    ractive.set('menuIsOpen', true);
                    containerObserver.disconnect();
                    menuObserver = new MutationObserver(function() {
                      return ractive.set('menuIsOpen', menu.style.display !== "none");
                    });
                    return menuObserver.observe(menu, {
                      attributes: true
                    });
                  }
                });
              });
              return containerObserver.observe(container, {
                childList: true
              });
            }
          });
        });
        return topLevelObserver.observe(topLevel, {
          childList: true
        });
      }
    },
    minWidth: 100,
    minHeight: 85,
    // coffeelint: disable=max_line_length
    template: `{{>editorOverlay}}
<div id="{{id}}" class="netlogo-widget netlogo-plot {{classes}}"
     style="{{dims}}{{#menuIsOpen}}z-index: 10;{{/}}"></div>`
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=plot.js.map
