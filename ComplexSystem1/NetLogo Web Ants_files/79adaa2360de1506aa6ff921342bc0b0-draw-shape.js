(function() {
  var IMAGE_SIZE, drawPath, setColoring;

  IMAGE_SIZE = 300; // Images are 300x300, in line with netlogo shapes.

  window.ShapeDrawer = class ShapeDrawer {
    constructor(shapes1, onePixel1) {
      this.shapes = shapes1;
      this.onePixel = onePixel1;
    }

    setTransparency(ctx, color) {
      return ctx.globalAlpha = color.length > 3 ? color[3] / 255 : 1;
    }

    drawShape(ctx, color, shapeName, thickness = 1) {
      ctx.translate(.5, -.5);
      ctx.scale(-1 / IMAGE_SIZE, 1 / IMAGE_SIZE);
      this.setTransparency(ctx, color);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
      ctx.clip();
      this.drawRawShape(ctx, color, shapeName, thickness);
      ctx.restore();
    }

    // Does not clip. Clipping should be handled by the `drawShape` method that
    // calls this. How clipping is performed depends on whether images are being
    // cached or not. BCH 7/13/2015
    drawRawShape(ctx, color, shapeName, thickness = 1) {
      var elem, j, len, ref, shape;
      ctx.lineWidth = IMAGE_SIZE * this.onePixel * thickness;
      shape = this.shapes[shapeName] || defaultShape;
      ref = shape.elements;
      for (j = 0, len = ref.length; j < len; j++) {
        elem = ref[j];
        draw[elem.type](ctx, color, elem);
      }
    }

  };

  window.CachingShapeDrawer = class CachingShapeDrawer extends ShapeDrawer {
    constructor(shapes, onePixel) {
      // Maps (shape name, color) -> canvas
      // Shape/color combinations are pre-rendered to these canvases so they can be
      // quickly rendered to display.

      // If memory is a problem, this can be turned into FIFO, LRU, or LFU cache.
      // Alternatively, each turtle could have it's own personal image pre-rendered.
      // This should be overall better, though, since it will perform well even if
      // turtles are constantly changing shape or color.
      super(shapes, onePixel);
      this.shapeCache = {};
    }

    drawShape(ctx, color, shapeName, thickness = 1) {
      var shapeCanvas, shapeCtx, shapeKey;
      shapeName = shapeName.toLowerCase();
      shapeKey = this.shapeKey(shapeName, color);
      shapeCanvas = this.shapeCache[shapeKey];
      if (shapeCanvas == null) {
        shapeCanvas = document.createElement('canvas');
        shapeCanvas.width = shapeCanvas.height = IMAGE_SIZE;
        shapeCtx = shapeCanvas.getContext('2d');
        this.drawRawShape(shapeCtx, color, shapeName);
        this.shapeCache[shapeKey] = shapeCanvas;
      }
      ctx.translate(.5, -.5);
      ctx.scale(-1 / IMAGE_SIZE, 1 / IMAGE_SIZE);
      this.setTransparency(ctx, color);
      ctx.drawImage(shapeCanvas, 0, 0);
    }

    shapeKey(shapeName, color) {
      return [shapeName, netlogoColorToOpaqueCSS(color)];
    }

  };

  setColoring = function(ctx, color, element) {
    // Since a turtle's color's transparency applies to its whole shape,  and not
    // just the parts that use its default color, we want to use the opaque
    // version of its color so we can use global transparency on it. BCH 12/10/2014
    color = netlogoColorToOpaqueCSS(color);
    if (element.filled) {
      if (element.marked) {
        ctx.fillStyle = color;
      } else {
        ctx.fillStyle = element.color;
      }
    } else {
      if (element.marked) {
        ctx.strokeStyle = color;
      } else {
        ctx.strokeStyle = element.color;
      }
    }
  };

  drawPath = function(ctx, color, element) {
    setColoring(ctx, color, element);
    if (element.filled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  window.draw = {
    circle: function(ctx, color, circle) {
      var r;
      r = circle.diam / 2;
      ctx.beginPath();
      ctx.arc(circle.x + r, circle.y + r, r, 0, 2 * Math.PI, false);
      ctx.closePath();
      drawPath(ctx, color, circle);
    },
    polygon: function(ctx, color, polygon) {
      var i, j, len, ref, x, xcors, y, ycors;
      xcors = polygon.xcors;
      ycors = polygon.ycors;
      ctx.beginPath();
      ctx.moveTo(xcors[0], ycors[0]);
      ref = xcors.slice(1);
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        x = ref[i];
        y = ycors[i + 1];
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      drawPath(ctx, color, polygon);
    },
    rectangle: function(ctx, color, rectangle) {
      var h, w, x, y;
      x = rectangle.xmin;
      y = rectangle.ymin;
      w = rectangle.xmax - x;
      h = rectangle.ymax - y;
      setColoring(ctx, color, rectangle);
      if (rectangle.filled) {
        ctx.fillRect(x, y, w, h);
      } else {
        ctx.strokeRect(x, y, w, h);
      }
    },
    line: function(ctx, color, line) {
      var h, w, x, y;
      x = line.x1;
      y = line.y1;
      w = line.x2 - line.x1;
      h = line.y2 - line.y1;
      setColoring(ctx, color, line);
      // Note that this is 1/20 the size of the image. Smaller this, and the
      // lines are hard to see in most cases.
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    }
  };

  window.defaultShape = {
    rotate: true,
    elements: [
      {
        type: 'polygon',
        color: 'grey',
        filled: 'true',
        marked: 'true',
        xcors: [150,
      40,
      150,
      260],
        ycors: [5,
      250,
      205,
      250]
      }
    ]
  };

}).call(this);

//# sourceMappingURL=draw-shape.js.map
