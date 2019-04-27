import _ from 'lodash';

export default function link(scope, elem, attrs, ctrl) {
  var data;
  var panel = ctrl.panel;
  elem = elem.find('.funnelchart-panel__chart');

  ctrl.events.on('render', function () {
      render(true);
  });

  function noDataPoints() {
    var html = '<div class="datapoints-warning"><span class="small">No data points</span></div>';
    elem.html(html);
  }

  function addChart() {
  }

  function render(incrementRenderCounter) {
    if (!ctrl.data) { return; }

    data = ctrl.data;

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
