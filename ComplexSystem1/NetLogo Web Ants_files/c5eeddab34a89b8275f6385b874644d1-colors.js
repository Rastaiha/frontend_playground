(function() {
  // input: number in [0, 140) range
  // result: CSS color string
  var b, baseIndex, cachedNetlogoColors, color, colorTimesTen, g, i, j, len, netlogoBaseColors, netlogoColorNamesIndices, r, ref, step;

  window.netlogoColorToCSS = function(netlogoColor) {
    var a, array, b, g, r;
    [r, g, b] = array = netlogoColorToRGB(netlogoColor);
    a = array.length > 3 ? array[3] : 255;
    if (a < 255) {
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  // Since a turtle's color's transparency applies to its whole shape,  and not
  // just the parts that use its default color, often we want to use the opaque
  // version of its color so we can use global transparency on it. BCH 12/10/2014
  window.netlogoColorToOpaqueCSS = function(netlogoColor) {
    var array, b, g, r;
    [r, g, b] = array = netlogoColorToRGB(netlogoColor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // (Number) => String
  window.netlogoColorToHexString = function(netlogoColor) {
    var hexes, rgb;
    rgb = netlogoColorToRGB(netlogoColor);
    hexes = rgb.map(function(x) {
      var hex;
      hex = x.toString(16);
      if (hex.length === 1) {
        return `0${hex}`;
      } else {
        return hex;
      }
    });
    return `#${hexes.join('')}`;
  };

  // (String) => Number
  window.hexStringToNetlogoColor = function(hex) {
    var b, g, hexPair, r, rgbHexes;
    hexPair = "([0-9a-f]{2})";
    rgbHexes = hex.toLowerCase().match(new RegExp(`#${hexPair}${hexPair}${hexPair}`)).slice(1);
    [r, g, b] = rgbHexes.map(function(x) {
      return parseInt(x, 16);
    });
    return ColorModel.nearestColorNumberOfRGB(r, g, b);
  };

  window.netlogoColorToRGB = function(netlogoColor) {
    switch (typeof netlogoColor) {
      case "number":
        return cachedNetlogoColors[Math.floor(netlogoColor * 10)];
      case "object":
        return netlogoColor.map(Math.round);
      case "string":
        return netlogoBaseColors[netlogoColorNamesIndices[netlogoColor]];
      default:
        return console.error(`Unrecognized color: ${netlogoColor}`);
    }
  };

  netlogoColorNamesIndices = {};

  ref = ['gray', 'red', 'orange', 'brown', 'yellow', 'green', 'lime', 'turqoise', 'cyan', 'sky', 'blue', 'violet', 'magenta', 'pink', 'black', 'white'];
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    color = ref[i];
    netlogoColorNamesIndices[color] = i;
  }

  // copied from api/Color.scala. note these aren't the same numbers as
  // `map extract-rgb base-colors` gives you; see comments in Scala source
  netlogoBaseColors = [
    [
      140,
      140,
      140 // gray       (5)
    ],
    [
      215,
      48,
      39 // red       (15)
    ],
    [
      241,
      105,
      19 // orange    (25)
    ],
    [
      156,
      109,
      70 // brown     (35)
    ],
    [
      237,
      237,
      47 // yellow    (45)
    ],
    [
      87,
      176,
      58 // green     (55)
    ],
    [
      42,
      209,
      57 // lime      (65)
    ],
    [
      27,
      158,
      119 // turquoise (75)
    ],
    [
      82,
      196,
      196 // cyan      (85)
    ],
    [
      43,
      140,
      190 // sky       (95)
    ],
    [
      50,
      92,
      168 // blue     (105)
    ],
    [
      123,
      78,
      163 // violet   (115)
    ],
    [
      166,
      25,
      105 // magenta  (125)
    ],
    [
      224,
      126,
      149 // pink     (135)
    ],
    [
      0,
      0,
      0 // black
    ],
    [
      255,
      255,
      255 // white
    ]
  ];

  cachedNetlogoColors = (function() {
    var k, results;
    results = [];
    for (colorTimesTen = k = 0; k <= 1400; colorTimesTen = ++k) {
      baseIndex = Math.floor(colorTimesTen / 100);
      [r, g, b] = netlogoBaseColors[baseIndex];
      step = (colorTimesTen % 100 - 50) / 50.48 + 0.012;
      if (step < 0) {
        r += Math.floor(r * step);
        g += Math.floor(g * step);
        b += Math.floor(b * step);
      } else {
        r += Math.floor((0xFF - r) * step);
        g += Math.floor((0xFF - g) * step);
        b += Math.floor((0xFF - b) * step);
      }
      results.push([r, g, b]);
    }
    return results;
  })();

}).call(this);

//# sourceMappingURL=colors.js.map
