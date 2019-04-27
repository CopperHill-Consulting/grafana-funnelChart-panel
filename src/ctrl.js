import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import rendering from './rendering';

const panelDefaults = {
  seriesColumnName: null,
  measureColumnName: null,
  seriesColors: ['#299c46'],
  seriesHoverColors: ['#299c46'],
  keep: 'auto',
  gap: 2,
  legend: {
    isShowing: true,
    position: 'top',
    isFullWidth: false,
    isReverse: false
  }
};

export class FunnelChartJsPanelCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector, $rootScope) {
    super($scope, $injector);

    this.$rootScope = $rootScope;
    this.data = null;

    _.defaults(this.panel, panelDefaults);
    _.defaults(this.panel.legend, panelDefaults.legend);

    this.events.on('render', this.onRender.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));

    console.log(this);
  }

  onRender() {

  }

  onInitEditMode() {
    let path = 'public/plugins/chc-funnel-panel/partials/';
    this.addEditorTab('Options', `${path}editor.html`, 2);
    this.addEditorTab('Colors', `${path}series-colors.html`, 3);
  }

  onDataError() {
    this.render();
  }

  onDataReceived(dataList) {
    if (dataList && dataList.length > 0) {
      let data = dataList[0];
      this.data = {
        isReal: true,
        type: data.type,
        columns: data.columns,
        rows: data.rows,
        columnTexts: data.columns.map(col => 'string' === typeof col ? col : col.text)
      };
    }
    else {
      this.data = {
        isReal: false,
        type: 'table',
        columns: [{text: "Series"}, {text: "Value"}],
        rows: [
          [ 'Green', 50 ],
          [ 'Blue', 5 ],
          [ 'Red', 30 ],
          [ 'Yellow', 30 ]
        ]
      };
    }

    this.render();
  }

  link(scope, elem, attrs, ctrl) {
    rendering(scope, elem, attrs, ctrl);
  }

  onColorChange(panelColorIndex, type) {
    return color => {
      if (type == 'hover')
        this.panel.seriesHoverColors[panelColorIndex] = color;
      else
        this.panel.seriesColors[panelColorIndex] = color;
      this.render();
    };
  }
}

FunnelChartJsPanelCtrl.templateUrl = 'partials/module.html';
