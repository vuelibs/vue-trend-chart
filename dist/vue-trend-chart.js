(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['vue-trend-chart'] = factory());
}(this, function () { 'use strict';

  function validatePadding (padding) {
    var arr = padding
      .split(" ")
      .filter(function (item) { return item !== ""; })
      .map(function (item) { return parseInt(item); });
    if (arr.length < 1 || arr.length > 4) { return false; }
    return arr.every(function (item) { return typeof item == "number" && item >= 0; });
  }

  function getPadding (padding) {
    var arr = padding
      .split(" ")
      .filter(function (item) { return item !== ""; })
      .map(function (item) { return parseInt(item); });
    switch (arr.length) {
      case 4:
        return { top: arr[0], right: arr[1], bottom: arr[2], left: arr[3] };
        break;
      case 3:
        return { top: arr[0], right: arr[1], bottom: arr[2], left: arr[1] };
        break;
      case 2:
        return { top: arr[0], right: arr[1], bottom: arr[0], left: arr[1] };
        break;
      default:
        return { top: arr[0], right: arr[0], bottom: arr[0], left: arr[0] };
        break;
    }
  }

  var TrendChartGrid = {
    name: "TrendChartGrid",
    props: {
      xAxes: {
        default: false,
        type: Boolean
      },
      xAxesLines: {
        type: Number
      },
      xAxesStrokeWidth: {
        default: 1,
        type: Number
      },
      xAxesStrokeColor: {
        default: "black",
        type: String
      },
      xAxesStrokeDasharray: {
        default: null,
        type: String
      },
      yAxes: {
        default: false,
        type: Boolean
      },
      yAxesLines: {
        type: Number
      },
      yAxesStrokeWidth: {
        default: 1,
        type: Number
      },
      yAxesStrokeColor: {
        default: "black",
        type: String
      },
      yAxesStrokeDasharray: {
        default: null,
        type: String
      },
      padding: {
        default: "0",
        type: String,
        validator: function validator(value) {
          return validatePadding(value);
        }
      }
    },
    computed: {
      xLines: function xLines() {
        return this.xAxesLines || this.$parent.params.maxAmount;
      },
      boundary: function boundary() {
        return this.$parent.boundary;
      },
      gridPaddingObject: function gridPaddingObject() {
        return this.$parent.gridPaddingObject;
      }
    },
    methods: {
      setXLineParams: function setXLineParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var xLines = ref.xLines;
        var gridPaddingObject = ref.gridPaddingObject;
        var xAxesStrokeColor = ref.xAxesStrokeColor;
        var xAxesStrokeWidth = ref.xAxesStrokeWidth;
        var xAxesStrokeDasharray = ref.xAxesStrokeDasharray;
        var step = (boundary.maxX - boundary.minX) / (xLines - 1);
        var x = boundary.minX + step * (n - 1);
        var x1 = x;
        var x2 = x;
        var y1 = boundary.minY - gridPaddingObject.top;
        var y2 = boundary.maxY + gridPaddingObject.bottom;
        return {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
          stroke: xAxesStrokeColor,
          "stroke-width": xAxesStrokeWidth,
          "stroke-dasharray": xAxesStrokeDasharray
        };
      },
      setYLineParams: function setYLineParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var yAxesLines = ref.yAxesLines;
        var gridPaddingObject = ref.gridPaddingObject;
        var yAxesStrokeColor = ref.yAxesStrokeColor;
        var yAxesStrokeWidth = ref.yAxesStrokeWidth;
        var yAxesStrokeDasharray = ref.yAxesStrokeDasharray;
        var step = (boundary.maxY - boundary.minY) / (yAxesLines - 1);
        var y = boundary.minY + step * (n - 1);
        var x1 = boundary.minX - gridPaddingObject.left;
        var x2 = boundary.maxX + gridPaddingObject.right;
        var y1 = y;
        var y2 = y;
        return {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
          stroke: yAxesStrokeColor,
          "stroke-width": yAxesStrokeWidth,
          "stroke-dasharray": yAxesStrokeDasharray
        };
      }
    },
    render: function render(h) {
      if (!this.xAxes || !this.yAxes) { return; }

      var children = [];

      // x axes
      if (this.xAxes && this.xLines > 0) {
        var lines = [];
        for (var i = 1; i <= this.xLines; i++) {
          lines.push(
            h("line", {
              class: "trend-chart-grid-x-axis",
              attrs: Object.assign({}, this.setXLineParams(i))
            })
          );
        }
        children.push(
          h(
            "g",
            {
              class: "trend-chart-grid-x"
            },
            lines
          )
        );
      }
      // y axes
      if (this.yAxes && this.yAxesLines > 0) {
        var lines$1 = [];
        for (var i$1 = 0; i$1 <= this.yAxesLines; i$1++) {
          lines$1.push(
            h("line", {
              class: "trend-chart-grid-y-axis",
              attrs: Object.assign({}, this.setYLineParams(i$1))
            })
          );
        }
        children.push(
          h(
            "g",
            {
              class: "trend-chart-grid-y"
            },
            lines$1
          )
        );
      }

      // Render component
      return h("g", children);
    }
  };

  var TrendChartLabels = {
    name: "TrendChartLabels",
    props: {
      xLabels: {
        type: Array
      },
      xLabelsPosition: {
        default: "bottom",
        type: String,
        validator: function validator(value) {
          return ["top", "bottom"].indexOf(value) !== -1;
        }
      },
      xLabelsOffset: {
        default: 5,
        type: Number
      },
      yLabelsAmount: {
        type: Number
      },
      yLabelsPosition: {
        default: "left",
        type: String,
        validator: function validator(value) {
          return ["left", "right"].indexOf(value) !== -1;
        }
      },
      yLabelsOffset: {
        default: 5,
        type: Number
      },
      yLabelsTextFormatter: {
        default: function (value) { return value; },
        type: Function
      }
    },
    computed: {
      boundary: function boundary() {
        return this.$parent.boundary;
      },
      gridPaddingObject: function gridPaddingObject() {
        return this.$parent.gridPaddingObject;
      }
    },
    methods: {
      setXLabelsParams: function setXLabelsParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var gridPaddingObject = ref.gridPaddingObject;
        var xLabels = ref.xLabels;
        var xLabelsPosition = ref.xLabelsPosition;
        var xLabelsOffset = ref.xLabelsOffset;
        var step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
        var x = boundary.minX + step * n;
        var y =
          xLabelsPosition == "bottom"
            ? boundary.maxY + gridPaddingObject.bottom + xLabelsOffset
            : boundary.minY - gridPaddingObject.top - xLabelsOffset;
        return { x: x, y: y };
      },
      setYLabelsParams: function setYLabelsParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var gridPaddingObject = ref.gridPaddingObject;
        var yLabelsAmount = ref.yLabelsAmount;
        var yLabelsPosition = ref.yLabelsPosition;
        var yLabelsOffset = ref.yLabelsOffset;
        var step = (boundary.maxY - boundary.minY) / (yLabelsAmount - 1);
        var x =
          yLabelsPosition == "left"
            ? boundary.minX - gridPaddingObject.left - yLabelsOffset
            : boundary.maxX + gridPaddingObject.right + yLabelsOffset;
        var y = boundary.maxY - step * n;
        return { x: x, y: y };
      }
    },
    render: function render(h) {
      var this$1 = this;

      if (
        !(this.xLabels && this.xLabels.length) ||
        !(this.yLabelsAmount && this.yLabelsAmount > 0)
      )
        { return; }

      var children = [];

      // x labels
      if (this.xLabels && this.xLabels.length) {
        children.push(
          h(
            "g",
            {
              class: "trend-chart-labels-x"
            },
            this.xLabels.map(function (label, i) {
              return h(
                "text",
                {
                  class: "trend-chart-label-x",
                  attrs: Object.assign({}, this$1.setXLabelsParams(i),
                    {"text-anchor": "middle",
                    "dominant-baseline":
                      this$1.xLabelsPosition == "bottom"
                        ? "text-before-edge"
                        : "text-after-edge"})
                },
                label
              );
            })
          )
        );
      }

      // y labels
      if (this.yLabelsAmount && this.yLabelsAmount > 0) {
        var labels = [];
        for (var i = 0; i < this.yLabelsAmount; i++) {
          labels.push(
            h(
              "text",
              {
                class: "trend-chart-label-y",
                attrs: Object.assign({}, this.setYLabelsParams(i),
                  {"text-anchor": this.yLabelsPosition == "left" ? "end" : "start"})
              },
              this.yLabelsTextFormatter(
                this.$parent.params.minValue +
                  ((this.$parent.params.maxValue - this.$parent.params.minValue) /
                    (this.yLabelsAmount - 1)) *
                    i
              )
            )
          );
        }
        children.push(
          h(
            "g",
            {
              class: "trend-chart-labels-y"
            },
            labels
          )
        );
      }

      // Render component
      return h("g", children);
    }
  };

  function genPoints (arr, ref, max, min, maxAmount) {
    var minX = ref.minX;
    var minY = ref.minY;
    var maxX = ref.maxX;
    var maxY = ref.maxY;

    arr = arr.map(function (item) { return (typeof item === "number" ? item : item.value); });
    var minValue = min - 0.001;
    var gridX = (maxX - minX) / (maxAmount - 1);
    var gridY = (maxY - minY) / (max + 0.001 - minValue);

    return arr.map(function (value, index) {
      return {
        x: index * gridX + minX,
        y:
          maxY -
          (value - minValue) * gridY +
          +(index === maxAmount - 1) * 0.00001 -
          +(index === 0) * 0.00001
      };
    });
  }

  function genPath (pnts, smooth, ref) {
    var maxY = ref.maxY;

    var points = [].concat( pnts );
    var start = points.shift();
    var end = points[points.length - 1];
    var distance = points[0].x - start.x;
    var bezierX = distance / 2;

    // Create Line Path
    var linePath = "M " + (start.x) + "," + (start.y);
    points.forEach(function (point, index) {
      if (!smooth) { linePath += " L" + (point.x) + "," + (point.y); }
      else {
        var prev = points[index - 1] || start;
        linePath += " C " + (bezierX + prev.x) + "," + (prev.y) + " " + (bezierX + prev.x) + "," + (point.y) + " " + (point.x) + "," + (point.y);
      }
    });

    // Create Fill Path
    var fillPath = linePath;
    if (end.Y !== maxY) { fillPath += " L" + (end.x) + "," + maxY; }
    if (start.Y !== maxY) { fillPath += " L" + (start.x) + "," + maxY; }
    fillPath += " Z";

    return { linePath: linePath, fillPath: fillPath };
  }

  var TrendChartCurve = {
    name: "TrendChartCurve",
    props: {
      data: {
        required: true,
        type: Array
      },
      className: {
        type: String
      },
      smooth: {
        default: false,
        type: Boolean
      },
      stroke: {
        default: true,
        type: Boolean
      },
      strokeWidth: {
        default: 1,
        type: Number
      },
      strokeColor: {
        default: "black",
        type: String
      },
      strokeGradient: {
        type: Array
      },
      strokeGradientDirection: {
        default: "to top",
        type: String,
        validator: function validator(value) {
          return (
            ["to top", "to left", "to bottom", "to right"].indexOf(value) !== -1
          );
        }
      },
      strokeDasharray: {
        default: "none",
        type: String
      },
      fill: {
        default: false,
        type: Boolean
      },
      fillColor: {
        default: "black",
        type: String
      },
      fillGradient: {
        type: Array
      },
      fillGradientDirection: {
        default: "to top",
        type: String,
        validator: function validator(value) {
          return (
            ["to top", "to left", "to bottom", "to right"].indexOf(value) !== -1
          );
        }
      },
      fillOpacity: {
        default: 1,
        type: Number
      },
      showPoints: {
        default: false,
        type: Boolean
      },
      pointsRadius: {
        default: 2,
        type: Number
      },
      pointsFill: {
        default: "black",
        type: String
      },
      pointsStrokeWidth: {
        type: Number
      },
      pointsStrokeColor: {
        type: String
      }
    },
    computed: {
      points: function points() {
        return genPoints(
          this.data,
          this.$parent.boundary,
          this.$parent.params.maxValue,
          this.$parent.params.minValue,
          this.$parent.params.maxAmount
        );
      },
      paths: function paths() {
        return genPath(this.points, this.smooth, this.$parent.boundary);
      },
      strokeGradientId: function strokeGradientId() {
        return ("vtsg" + (this._uid));
      },
      fillGradientId: function fillGradientId() {
        return ("vtfg" + (this._uid));
      }
    },
    methods: {
      getGradientDirection: function getGradientDirection(ref) {
        switch (ref) {
          case "to left":
            return { x1: 0, y1: 0, x2: 1, y2: 0 };
            break;
          case "to bottom":
            return { x1: 0, y1: 0, x2: 0, y2: 1 };
            break;
          case "to right":
            return { x1: 1, y1: 0, x2: 0, y2: 0 };
            break;
          default:
            return { x1: 0, y1: 1, x2: 0, y2: 0 };
            break;
        }
      }
    },
    render: function render(h) {
      var this$1 = this;

      var children = [];
      // Fill path
      if (this.fill && this.paths && this.paths.fillPath) {
        children.push(
          h("path", {
            class: "trend-chart-fill",
            attrs: {
              d: this.paths.fillPath,
              fill: this.fillGradient
                ? ("url(#" + (this.fillGradientId) + ")")
                : this.fillColor,
              opacity: this.fillOpacity
            }
          })
        );
      }
      // Stroke path
      if (this.stroke && this.paths && this.paths.linePath) {
        children.push(
          h("path", {
            class: "trend-chart-fill",
            attrs: {
              d: this.paths.linePath,
              fill: "none",
              stroke: this.strokeGradient
                ? ("url(#" + (this.strokeGradientId) + ")")
                : this.strokeColor,
              "stroke-width": this.strokeWidth,
              "stroke-dasharray": this.strokeDasharray
            }
          })
        );
      }
      // Points
      if (this.showPoints) {
        children.push(
          h(
            "g",
            {
              class: "trend-chart-points"
            },
            this.points.map(function (point) { return h("circle", {
                class: "trend-chart-point",
                attrs: {
                  cx: point.x,
                  cy: point.y,
                  r: this$1.pointsRadius,
                  fill: this$1.pointsFill,
                  stroke: this$1.pointsStrokeColor,
                  "stroke-width": this$1.pointsStrokeWidth
                }
              }); }
            )
          )
        );
      }
      // Gradients
      if (this.strokeGradient || this.fillGradient) {
        var gradients = [];
        // Stroke Gradient
        if (this.strokeGradient) {
          gradients.push(
            h(
              "linearGradient",
              {
                attrs: Object.assign({}, {id: this.strokeGradientId},
                  this.getGradientDirection(this.strokeGradientDirection))
              },
              this.strokeGradient.map(function (color, i) {
                return h("stop", {
                  attrs: {
                    offset: i / this$1.strokeGradient.length,
                    "stop-color": color
                  }
                });
              })
            )
          );
        }
        // Fill Gradient
        if (this.fillGradient) {
          gradients.push(
            h(
              "linearGradient",
              {
                attrs: Object.assign({}, {id: this.fillGradientId},
                  this.getGradientDirection(this.fillGradientDirection))
              },
              this.fillGradient.map(function (color, i) {
                return h("stop", {
                  attrs: {
                    offset: i / this$1.fillGradient.length,
                    "stop-color": color
                  }
                });
              })
            )
          );
        }

        children.push(h("defs", gradients));
      }

      // Render component
      return h(
        "g",
        {
          class: this.className
        },
        children
      );
    }
  };

  var TrendChart = {
    name: "TrendChart",
    components: { TrendChartGrid: TrendChartGrid, TrendChartLabels: TrendChartLabels, TrendChartCurve: TrendChartCurve },
    props: {
      datasets: {
        required: true,
        type: Array
      },
      grid: {
        default: null,
        type: Object
      },
      labels: {
        default: null,
        type: Object
      },
      max: {
        type: Number
      },
      min: {
        type: Number
      },
      padding: {
        default: "5",
        type: String,
        validator: function validator(val) {
          return validatePadding(val);
        }
      }
    },
    data: function data() {
      return {
        width: null,
        height: null,
        labelsOverflowObject: { top: 0, right: 0, bottom: 0, left: 0 }
      };
    },
    computed: {
      paddingObject: function paddingObject() {
        if (!this.padding) { return getPadding("0"); }
        return getPadding(this.padding);
      },
      gridPaddingObject: function gridPaddingObject() {
        if (!this.grid || !this.grid.padding) { return getPadding("0"); }
        return getPadding(this.grid.padding);
      },
      boundary: function boundary() {
        var ref = this;
        var width = ref.width;
        var height = ref.height;
        var paddingObject = ref.paddingObject;
        var gridPaddingObject = ref.gridPaddingObject;
        var labelsOverflowObject = ref.labelsOverflowObject;
        var boundary = {
          minX:
            paddingObject.left +
            gridPaddingObject.left +
            labelsOverflowObject.left,
          minY:
            paddingObject.top + gridPaddingObject.top + labelsOverflowObject.top,
          maxX:
            width -
            paddingObject.right -
            gridPaddingObject.right -
            labelsOverflowObject.right,
          maxY:
            height -
            paddingObject.bottom -
            gridPaddingObject.bottom -
            labelsOverflowObject.bottom
        };
        return boundary;
      },
      params: function params() {
        var maxValue = -Infinity;
        var minValue = Infinity;
        var maxAmount = 0;
        this.datasets.forEach(function (dataset) {
          var dataArr = dataset.data.map(function (item) { return typeof item === "number" ? item : item.value; }
          );

          var max = Math.max.apply(Math, dataArr);
          if (max > maxValue) { maxValue = max; }

          var min = Math.min.apply(Math, dataArr);
          if (min < minValue) { minValue = min; }

          if (dataArr.length > maxAmount) { maxAmount = dataArr.length; }
        });
        if (this.max !== undefined && this.max > maxValue) { maxValue = this.max; }
        if (this.min !== undefined && this.min < minValue) { minValue = this.min; }
        return { maxValue: maxValue, minValue: minValue, maxAmount: maxAmount };
      }
    },
    methods: {
      setSize: function setSize() {
        var params = this.$refs["chart"].getBoundingClientRect();
        this.width = params.width;
        this.height = params.height;
      },
      fitLabels: function fitLabels() {
        var chart = this.$refs["chart"];
        var chartLabels = this.$refs["chart-labels"];
        if (
          chartLabels &&
          ((chartLabels.xLabels && chartLabels.xLabels.length) ||
            chartLabels.yLabelsAmount > 0)
        ) {
          var chartParams = chart.getBoundingClientRect();
          var chartLabelsParams = chartLabels.$el.getBoundingClientRect();

          var top =
            chartParams.top - chartLabelsParams.top + this.paddingObject.top;
          var right =
            chartLabelsParams.right -
            chartParams.right +
            this.paddingObject.right;
          var bottom =
            chartLabelsParams.bottom -
            chartParams.bottom +
            this.paddingObject.bottom;
          var left =
            this.paddingObject.left - chartLabelsParams.left + chartParams.left;

          this.labelsOverflowObject = {
            top: top > 0 ? top : 0,
            right: right > 0 ? right : 0,
            bottom: bottom > 0 ? bottom : 0,
            left: left > 0 ? left : 0
          };
        } else {
          this.labelsOverflowObject = { top: 0, right: 0, bottom: 0, left: 0 };
        }
      },
      init: function init() {
        var this$1 = this;

        this.setSize();
        this.$nextTick(function () {
          this$1.fitLabels();
        });
      },
      onWindowResize: function onWindowResize() {
        this.setSize();
      }
    },
    mounted: function mounted() {
      this.init();
      window.addEventListener("resize", this.onWindowResize);
    },
    destroyed: function destroyed() {
      window.removeEventListener("resize", this.onWindowResize);
    },
    render: function render(h) {
      var children = [];

      // Grid
      if (this.grid) {
        children.push(
          h(TrendChartGrid, {
            class: "trend-chart-grid",
            attrs: Object.assign({}, this.grid)
          })
        );
      }

      // Labels
      if (this.labels) {
        children.push(
          h(TrendChartLabels, {
            class: "trend-chart-labels",
            ref: "chart-labels",
            attrs: Object.assign({}, this.labels)
          })
        );
      }

      // Curves
      this.datasets.map(function (dataset) {
        children.push(
          h(TrendChartCurve, {
            class: "trend-chart-curve",
            attrs: Object.assign({}, dataset)
          })
        );
      });

      // Render component
      return h(
        "svg",
        {
          class: "trend-chart",
          ref: "chart",
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "100%",
            height: "100%"
          }
        },
        children
      );
    }
  };

  TrendChart.install = function(Vue) {
    Vue.component(TrendChart.name, TrendChart);
  };

  if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(TrendChart);
  }

  return TrendChart;

}));
