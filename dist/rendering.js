"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = link;

var _lodash = _interopRequireDefault(require("lodash"));

var FunnelChart = _interopRequireWildcard(require("./external/chart.funnel.bundled.min"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import * as ChartJS from './external/chart.bundle';
function link(scope, elem, attrs, ctrl) {
  elem = elem.find('.funnelchart-panel__chart');
  ctrl.events.on('render', function () {
    render(true);
  });

  function noDataPoints() {
    var html = '<div class="datapoints-warning"><span class="small">No data points</span></div>';
    elem.html(html);
  }

  function getLegendWidth() {
    if (ctrl.panel.legend.isShowing && (ctrl.panel.legend.position == 'left' || ctrl.panel.legend.position == 'right')) {
      return 40;
    }

    return 0;
  }

  function addChart() {
    var width = elem.width() - getLegendWidth();
    var height = ctrl.height - 20;
    var options = {
      type: 'funnel',
      data: {
        datasets: [{
          data: _lodash["default"].map(ctrl.data.rows, function (row) {
            return row[ctrl.panel.measureColumnIndex];
          }),
          backgroundColor: ctrl.panel.seriesColors,
          hoverBackgroundColor: ctrl.panel.seriesColors
        }],
        labels: _lodash["default"].map(ctrl.data.rows, function (row) {
          return row[ctrl.panel.seriesColumnIndex];
        })
      },
      options: {
        responsive: true,
        //keep: ctrl.panel.keep,
        gap: ctrl.panel.gap,
        sort: ctrl.panel.sort,
        legend: {
          display: ctrl.panel.legend.isShowing,
          position: ctrl.panel.legend.position,
          fullWidth: ctrl.panel.legend.isFullWidth,
          reverse: ctrl.panel.legend.isReverse
        }
      }
    };
    elem.html('');
    var canvas = jQuery('<canvas>').appendTo(elem),
        ctx = canvas[0].getContext('2d');
    ctx.canvas.height = height;
    ctx.canvas.width = width;
    var chart = new FunnelChart(ctx, options);
  }

  function render(incrementRenderCounter) {
    if (!ctrl.data) {
      return;
    }

    if (0 == ctrl.data.length) {
      noDataPoints();
    } else {
      addChart();
    }

    if (incrementRenderCounter) {
      ctrl.renderingCompleted();
    }
  }
}
//# sourceMappingURL=rendering.js.map
