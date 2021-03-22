(function () {
  window.RactiveModelTitle = RactiveContextable.extend({
    data: function () {
      return {
        contextMenuOptions: [
          {
            text: "Edit",
            isEnabled: true,
            action: () => {
              return this.fire('edit-title');
            }
          }
        ],
        isEditing: void 0, // Boolean
        title: void 0 // String
      };
    },
    on: {
      'edit-title': function () {
        var defaultOnEmpty, newName, oldName, ref;
        defaultOnEmpty = function (s) {
          if (s === '') {
            return "Untitled";
          } else {
            return s;
          }
        };
        if (this.get('isEditing')) {
          oldName = this.get('title');
          newName = prompt("Enter a new name for your model", oldName);
          this.set('title', (ref = defaultOnEmpty(newName)) != null ? ref : oldName);
        }
      }
    },
    template: `<div class="netlogo-model-masthead">
  <div class="flex-row" style="justify-content: center; height: 30px; line-height: 30px;">
    <h2 id="netlogo-title"
        on-contextmenu="@this.fire('show-context-menu', @event)"
        class="netlogo-widget netlogo-model-title {{classes}}{{# isEditing }} interface-unlocked initial-color{{/}}"
        on-dblclick="edit-title">
      {{ title }}
    </h2>
  </div>
</div>`
  });

}).call(this);

//# sourceMappingURL=title.js.map
