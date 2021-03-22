(function() {
  var RactiveEditFormCoordBoundInput, ViewEditForm;

  RactiveEditFormCoordBoundInput = Ractive.extend({
    data: function() {
      return {
        id: void 0, // String
        hint: void 0, // String
        label: void 0, // String
        max: void 0, // Number
        min: void 0, // Number
        name: void 0, // String
        value: void 0 // Number
      };
    },
    isolated: true,
    twoway: false,
    components: {
      labeledInput: RactiveEditFormLabeledInput
    },
    template: `<div>
  <labeledInput id="{{id}}" labelStr="{{label}}"
                labelStyle="min-width: 100px; white-space: nowrap;"
                name="{{name}}" style="text-align: right;" type="number"
                attrs="min='{{min}}' max='{{max}}' step=1 required"
                value="{{value}}" />
  <div class="widget-edit-hint-text">{{hint}}</div>
</div>`
  });

  ViewEditForm = EditForm.extend({
    data: function() {
      return {
        framerate: void 0, // Number
        isShowingTicks: void 0, // Boolean
        maxX: void 0, // Number
        maxY: void 0, // Number
        minX: void 0, // Number
        minY: void 0, // Number
        patchSize: void 0, // Number
        tickLabel: void 0, // String
        turtleLabelSize: void 0, // Number
        wrapsInX: void 0, // Boolean
        wrapsInY: void 0 // Boolean
      };
    },
    computed: {
      topology: {
        get: function() {
          if (this.get('wrapsInX')) {
            if (this.get('wrapsInY')) {
              return "Torus";
            } else {
              return "Horizontal Cylinder";
            }
          } else if (this.get('wrapsInY')) {
            return "Vertical Cylinder";
          } else {
            return "Box";
          }
        }
      }
    },
    twoway: false,
    components: {
      coordInput: RactiveEditFormCoordBoundInput,
      formCheckbox: RactiveEditFormCheckbox,
      formFontSize: RactiveEditFormFontSize,
      labeledInput: RactiveEditFormLabeledInput,
      spacer: RactiveEditFormSpacer
    },
    genProps: function(form) {
      return {
        'dimensions.maxPxcor': Number.parseInt(form.maxX.value),
        'dimensions.maxPycor': Number.parseInt(form.maxY.value),
        'dimensions.minPxcor': Number.parseInt(form.minX.value),
        'dimensions.minPycor': Number.parseInt(form.minY.value),
        'dimensions.patchSize': Number.parseInt(form.patchSize.value),
        'dimensions.wrappingAllowedInX': form.wrapsInX.checked,
        'dimensions.wrappingAllowedInY': form.wrapsInY.checked,
        fontSize: Number.parseInt(form.turtleLabelSize.value),
        frameRate: Number.parseInt(form.framerate.value),
        showTickCounter: form.isShowingTicks.checked,
        tickCounterLabel: form.tickLabel.value
      };
    },
    // coffeelint: disable=max_line_length
    partials: {
      title: "Model Settings",
      widgetFields: `{{>worldSet}}
<spacer height="10px" />
{{>viewSet}}
<spacer height="10px" />
{{>tickCounterSet}}`,
      worldSet: `<fieldset class="widget-edit-fieldset">
  <legend class="widget-edit-legend">World</legend>
  <div class="flex-row">
    {{>coordColumn}}
    <spacer width="8%" />
    {{>wrappingColumn}}
  </div>
</fieldset>`,
      coordColumn: `<div class="flex-column">

  <coordInput id="{{id}}-min-x" label="min-pxcor:" name="minX" value="{{minX}}"
              min="-50000" max="0" hint="minimum x coordinate for patches" />

  <coordInput id="{{id}}-max-x" label="max-pxcor:" name="maxX" value="{{maxX}}"
              min="0" max="50000" hint="maximum x coordinate for patches" />

  <coordInput id="{{id}}-min-y" label="min-pycor:" name="minY" value="{{minY}}"
              min="-50000" max="0" hint="minimum y coordinate for patches" />

  <coordInput id="{{id}}-max-y" label="max-pycor:" name="maxY" value="{{maxY}}"
              min="0" max="50000" hint="maximum y coordinate for patches" />

</div>`,
      wrappingColumn: `<div class="flex-column">
  <formCheckbox id="{{id}}-wraps-in-x" isChecked="{{ wrapsInX }}"
                labelText="Wraps horizontally" name="wrapsInX" />
  <spacer height="10px" />
  <formCheckbox id="{{id}}-wraps-in-y" isChecked="{{ wrapsInY }}"
                labelText="Wraps vertically" name="wrapsInY" />
</div>`,
      viewSet: `<fieldset class="widget-edit-fieldset">
  <legend class="widget-edit-legend">View</legend>
  <div class="flex-row">
    <div class="flex-column" style="flex-grow: 1;">
      <labeledInput id="{{id}}-patch-size" labelStr="Patch size:"
                    name="patchSize" type="number" value="{{patchSize}}"
                    attrs="min=-1 step='any' required" />
      <div class="widget-edit-hint-text">measured in pixels</div>
    </div>
    <spacer width="20px" />
    <div class="flex-column" style="flex-grow: 1;">
      <formFontSize id="{{id}}-turtle-label-size" name="turtleLabelSize" value="{{turtleLabelSize}}"/>
      <div class="widget-edit-hint-text">of labels on agents</div>
    </div>
  </div>

  <spacer height="10px" />

  <labeledInput id="{{id}}-framerate" labelStr="Frame rate:" name="framerate"
                style="text-align: right;" type="number" value="{{framerate}}"
                attrs="min=0 step='any' required" />
  <div class="widget-edit-hint-text">Frames per second at normal speed</div>

</fieldset>`,
      tickCounterSet: `<fieldset class="widget-edit-fieldset">
  <legend class="widget-edit-legend">Tick Counter</legend>
  <formCheckbox id="{{id}}-is-showing-ticks" isChecked="{{ isShowingTicks }}"
                labelText="Show tick counter" name="isShowingTicks" />
  <spacer height="10px" />
  <labeledInput id="{{id}}-tick-label" labelStr="Tick counter label:" name="tickLabel"
                style="width: 230px;" type="text" value="{{tickLabel}}" />
</fieldset>`
    }
  });

  // coffeelint: enable=max_line_length
  window.RactiveView = RactiveWidget.extend({
    data: function() {
      return {
        contextMenuOptions: [this.standardOptions(this).edit],
        resizeDirs: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
        ticks: void 0 // String
      };
    },
    components: {
      editForm: ViewEditForm
    },
    eventTriggers: function() {
      return {
        fontSize: [this._weg.redrawView],
        'dimensions.maxPxcor': [this._weg.resizeView, this._weg.redrawView],
        'dimensions.maxPycor': [this._weg.resizeView, this._weg.redrawView],
        'dimensions.minPxcor': [this._weg.resizeView, this._weg.redrawView],
        'dimensions.minPycor': [this._weg.resizeView, this._weg.redrawView],
        'dimensions.patchSize': [this._weg.resizePatches, this._weg.redrawView],
        'dimensions.wrappingAllowedInX': [this._weg.updateTopology, this._weg.redrawView],
        'dimensions.wrappingAllowedInY': [this._weg.updateTopology, this._weg.redrawView]
      };
    },
    // (Object[Number]) => Unit
    handleResize: function({
        left: newLeft,
        right: newRight,
        top: newTop,
        bottom: newBottom
      }) {
      var bottom, dHeight, dWidth, dx, dy, left, movedLeft, movedUp, newHeight, newWidth, oldBottom, oldHeight, oldLeft, oldRight, oldTop, oldWidth, patchSize, ratio, right, scaledHeight, scaledWidth, top;
      if (newLeft >= 0 && newTop >= 0) {
        oldLeft = this.get('left');
        oldRight = this.get('right');
        oldTop = this.get('top');
        oldBottom = this.get('bottom');
        oldWidth = oldRight - oldLeft;
        oldHeight = oldBottom - oldTop;
        newWidth = newRight - newLeft;
        newHeight = newBottom - newTop;
        dWidth = Math.abs(oldWidth - newWidth);
        dHeight = Math.abs(oldHeight - newHeight);
        ratio = dWidth > dHeight ? newHeight / oldHeight : newWidth / oldWidth;
        patchSize = parseFloat((this.get('widget.dimensions.patchSize') * ratio).toFixed(2));
        scaledWidth = patchSize * (this.get('widget.dimensions.maxPxcor') - this.get('widget.dimensions.minPxcor') + 1);
        scaledHeight = patchSize * (this.get('widget.dimensions.maxPycor') - this.get('widget.dimensions.minPycor') + 1);
        dx = scaledWidth - oldWidth;
        dy = scaledHeight - oldHeight;
        movedLeft = newLeft !== oldLeft;
        movedUp = newTop !== oldTop;
        [top, bottom] = movedUp ? [oldTop - dy, newBottom] : [newTop, oldBottom + dy];
        [left, right] = movedLeft ? [oldLeft - dx, newRight] : [newLeft, oldRight + dx];
        if (left >= 0 && top >= 0) {
          this.set('widget.top', Math.round(top));
          this.set('widget.bottom', Math.round(bottom));
          this.set('widget.left', Math.round(left));
          this.set('widget.right', Math.round(right));
          this.findComponent('editForm').set('patchSize', patchSize);
        }
      }
    },
    // () => Unit
    handleResizeEnd: function() {
      this.fire('set-patch-size', this.findComponent('editForm').get('patchSize'));
    },
    minWidth: 10,
    minHeight: 10,
    // coffeelint: disable=max_line_length
    template: `{{>editorOverlay}}
{{>view}}
<editForm idBasis="view" style="width: 510px;"
          maxX="{{widget.dimensions.maxPxcor}}" maxY="{{widget.dimensions.maxPycor}}"
          minX="{{widget.dimensions.minPxcor}}" minY="{{widget.dimensions.minPycor}}"
          wrapsInX="{{widget.dimensions.wrappingAllowedInX}}" wrapsInY="{{widget.dimensions.wrappingAllowedInY}}"
          patchSize="{{widget.dimensions.patchSize}}" turtleLabelSize="{{widget.fontSize}}"
          framerate="{{widget.frameRate}}"
          isShowingTicks="{{widget.showTickCounter}}" tickLabel="{{widget.tickCounterLabel}}" />`,
    partials: {
      view: `<div id="{{id}}" class="netlogo-widget netlogo-view-container {{classes}}" style="{{dims}}"></div>`
    }
  });

  // coffeelint: enable=max_line_length

}).call(this);

//# sourceMappingURL=view.js.map
