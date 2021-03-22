(function() {
  window.Line = class Line {
    constructor(x11, y11, x21, y21) {
      this.x1 = x11;
      this.y1 = y11;
      this.x2 = x21;
      this.y2 = y21;
    }

    midpoint() {
      var midpointX, midpointY;
      midpointX = (this.x1 + this.x2) / 2;
      midpointY = (this.y1 + this.y2) / 2;
      return [midpointX, midpointY];
    }

  };

  window.LinkDrawer = class LinkDrawer {
    constructor(view, shapes) {
      var directionIndicators, name, ref, shape;
      this.traceCurvedLine = this.traceCurvedLine.bind(this);
      this._drawLinkLine = this._drawLinkLine.bind(this);
      this.view = view;
      this.shapes = shapes;
      directionIndicators = {};
      ref = this.shapes;
      for (name in ref) {
        shape = ref[name];
        directionIndicators[name] = shape['direction-indicator'];
      }
      this.linkShapeDrawer = new ShapeDrawer(directionIndicators, this.view.onePixel);
    }

    traceCurvedLine(x1, y1, x2, y2, cx, cy, ctx) {
      ctx.moveTo(x1, y1);
      return ctx.quadraticCurveTo(cx, cy, x2, y2);
    }

    shouldWrapInDim(canWrap, dimensionSize, cor1, cor2) {
      var distance;
      distance = Math.abs(cor1 - cor2);
      return canWrap && distance > dimensionSize / 2;
    }

    calculateShortestLineAngle(x1, y1, x2, y2) {
      var shortestX, shortestY;
      shortestX = Math.min(x1 - x2, x2 - x1);
      shortestY = Math.min(y1 - y2, y2 - y1);
      return Math.atan2(shortestY, shortestX);
    }

    calculateComps(x1, y1, x2, y2, size) {
      var xcomp, ycomp;
      // Comps are NetLogo magic. Taken from the source.
      // JTT 5/1/15
      xcomp = (y2 - y1) / size;
      ycomp = (x1 - x2) / size;
      return [xcomp, ycomp];
    }

    calculateSublineOffset(centerOffset, thickness, xcomp, ycomp) {
      var thicknessFactor, xOff, yOff;
      thicknessFactor = thickness / this.view.onePixel;
      xOff = centerOffset * thicknessFactor * xcomp;
      yOff = centerOffset * thicknessFactor * ycomp;
      return [xOff, yOff];
    }

    getOffsetSubline(x1, y1, x2, y2, xOff, yOff) {
      var lx1, lx2, ly1, ly2;
      lx1 = x1 + xOff;
      lx2 = x2 + xOff;
      ly1 = y1 + yOff;
      ly2 = y2 + yOff;
      return new Line(lx1, ly1, lx2, ly2);
    }

    calculateControlPoint(midpointX, midpointY, curviness, xcomp, ycomp) {
      var controlX, controlY;
      controlX = midpointX - curviness * xcomp;
      controlY = midpointY - curviness * ycomp;
      return [controlX, controlY];
    }

    drawSubline({x1, y1, x2, y2}, dashPattern, thickness, color, isCurved, controlX, controlY, ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash(dashPattern.map((x) => {
        return x * this.view.onePixel;
      }));
      ctx.strokeStyle = netlogoColorToCSS(color);
      ctx.lineWidth = thickness;
      ctx.lineCap = isCurved ? 'round' : 'square';
      this.traceCurvedLine(x1, y1, x2, y2, controlX, controlY, ctx);
      ctx.stroke();
      ctx.setLineDash([1, 0]);
      return ctx.restore();
    }

    drawShape(x, y, cx, cy, heading, color, thickness, linkShape, shapeName, ctx) {
      var realThickness, scale, shapeTheta, shift, shiftCoefficientX, shiftCoefficientY, sx, sy, theta, thicknessFactor;
      ctx.save();
      theta = this.calculateShortestLineAngle(x, y, cx, cy);
      shiftCoefficientX = x - cx > 0 ? -1 : 1;
      shiftCoefficientY = y - cy > 0 ? -1 : 1;
      shift = this.view.onePixel * 20;
      sx = x + shift * Math.abs(Math.cos(theta)) * shiftCoefficientX;
      sy = y + shift * Math.abs(Math.sin(theta)) * shiftCoefficientY;
      shapeTheta = Math.atan2(sy - y, sx - x) - Math.PI / 2;
      ctx.translate(sx, sy);
      if (linkShape['direction-indicator'].rotate) {
        ctx.rotate(shapeTheta);
      } else {
        ctx.rotate(Math.PI);
      }
      // one pixel should == one patch (before scale) -- JTT 4/15/15
      thicknessFactor = thickness / this.view.onePixel;
      if (thickness <= 1) {
        scale = 1 / this.view.onePixel / 5;
        realThickness = thickness * 10;
      } else {
        scale = thicknessFactor / 2;
        realThickness = 0.5;
      }
      ctx.scale(scale, scale);
      this.linkShapeDrawer.drawShape(ctx, color, shapeName, realThickness);
      return ctx.restore();
    }

    drawLabel(x, y, labelText, color) {
      return this.view.drawLabel(x - 3 * this.view.onePixel, y + 3 * this.view.onePixel, labelText, color);
    }

    draw(link, end1, end2, canWrapX, canWrapY, ctx = this.view.ctx, isStamp = false) {
      var adjustedThickness, color, theta, thickness, wrapX, wrapY, x1, x2, y1, y2;
      if (!link['hidden?']) {
        ({color, thickness} = link);
        ({
          xcor: x1,
          ycor: y1
        } = end1);
        ({
          xcor: x2,
          ycor: y2
        } = end2);
        theta = this.calculateShortestLineAngle(x1, y1, x2, y2);
        adjustedThickness = thickness > this.view.onePixel ? thickness : this.view.onePixel;
        wrapX = this.shouldWrapInDim(canWrapX, this.view.worldWidth, x1, x2);
        wrapY = this.shouldWrapInDim(canWrapY, this.view.worldHeight, y1, y2);
        return this.getWrappedLines(x1, y1, x2, y2, wrapX, wrapY).forEach(this._drawLinkLine(link, adjustedThickness, ctx, isStamp));
      }
    }

    _drawLinkLine({
        color,
        size,
        heading,
        'directed?': isDirected,
        shape: shapeName,
        label,
        'label-color': labelColor
      }, thickness, ctx, isStamp) {
      return ({x1, y1, x2, y2}) => {
        var curviness, lines, linkShape;
        linkShape = this.shapes[shapeName];
        ({curviness, lines} = linkShape);
        return lines.forEach((line) => {
          var centerOffset, controlX, controlY, dashPattern, hasLabel, isCurved, isMiddleLine, midpointX, midpointY, offsetSubline, visible, xOff, xcomp, yOff, ycomp;
          ({
            'x-offset': centerOffset,
            'dash-pattern': dashPattern,
            'is-visible': visible
          } = line);
          if (visible) {
            [xcomp, ycomp] = this.calculateComps(x1, y1, x2, y2, size);
            [xOff, yOff] = this.calculateSublineOffset(centerOffset, thickness, xcomp, ycomp);
            offsetSubline = this.getOffsetSubline(x1, y1, x2, y2, xOff, yOff);
            isMiddleLine = line === lines[1];
            isCurved = curviness > 0;
            hasLabel = label != null;
            [midpointX, midpointY] = offsetSubline.midpoint();
            [controlX, controlY] = this.calculateControlPoint(midpointX, midpointY, curviness, xcomp, ycomp);
            this.drawSubline(offsetSubline, dashPattern, thickness, color, isCurved, controlX, controlY, ctx);
            if (isMiddleLine) {
              if (isDirected && size > (.25 * this.view.onePixel)) {
                this.drawShape(x2, y2, controlX, controlY, heading, color, thickness, linkShape, shapeName, ctx);
              }
              if (hasLabel && !isStamp) {
                return this.drawLabel(controlX, controlY, label, labelColor);
              }
            }
          }
        });
      };
    }

    getWrappedLines(x1, y1, x2, y2, lineWrapsX, lineWrapsY) {
      var worldHeight, worldWidth;
      worldWidth = this.view.worldWidth;
      worldHeight = this.view.worldHeight;
      if (lineWrapsX && lineWrapsY) {
        if (x1 < x2) {
          if (y1 < y2) {
            return [new Line(x1, y1, x2 - worldWidth, y2 - worldHeight), new Line(x1 + worldWidth, y1, x2, y2 - worldHeight), new Line(x1 + worldWidth, y1 + worldHeight, x2, y2), new Line(x1, y1 + worldHeight, x2 - worldWidth, y2)];
          } else {
            return [new Line(x1, y1, x2 - worldWidth, y2 + worldHeight), new Line(x1 + worldWidth, y1, x2, y2 + worldHeight), new Line(x1 + worldWidth, y1 - worldHeight, x2, y2), new Line(x1, y1 - worldHeight, x2 - worldWidth, y2)];
          }
        } else {
          if (y1 < y2) {
            return [new Line(x1, y1, x2 + worldWidth, y2 - worldHeight), new Line(x1 - worldWidth, y1, x2, y2 - worldHeight), new Line(x1 - worldWidth, y1 + worldHeight, x2, y2), new Line(x1, y1 + worldHeight, x2 + worldWidth, y2)];
          } else {
            return [new Line(x1, y1, x2 + worldWidth, y2 + worldHeight), new Line(x1 - worldWidth, y1, x2, y2 + worldHeight), new Line(x1 - worldWidth, y1 - worldHeight, x2, y2), new Line(x1, y1 - worldHeight, x2 + worldWidth, y2)];
          }
        }
      } else if (lineWrapsX) {
        if (x1 < x2) {
          return [new Line(x1, y1, x2 - worldWidth, y2), new Line(x1 + worldWidth, y1, x2, y2)];
        } else {
          return [new Line(x1, y1, x2 + worldWidth, y2), new Line(x1 - worldWidth, y1, x2, y2)];
        }
      } else if (lineWrapsY) {
        if (y1 < y2) {
          return [new Line(x1, y1, x2, y2 - worldHeight), new Line(x1, y1 + worldHeight, x2, y2)];
        } else {
          return [new Line(x1, y1 - worldHeight, x2, y2), new Line(x1, y1, x2, y2 + worldHeight)];
        }
      } else {
        return [new Line(x1, y1, x2, y2)];
      }
    }

  };

}).call(this);

//# sourceMappingURL=link-drawer.js.map
