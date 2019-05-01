import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import rendering from './rendering';

const panelDefaults = {
  seriesColumnIndex: -1,
  measureColumnIndex: -1,
  seriesColumnName: null,
  measureColumnName: null,
  seriesColorSuperset: ['#299c46', '#5794F2', '#F2495C', '#FADE2A', '#FF9830', '#B877D9'],
  seriesColors: [],
  //seriesHoverColors: [],
  keep: 'auto',
  gap: 2,
  sort: 'desc',
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
  }

  onRender() {
  }

  onInitEditMode() {
    let path = 'public/plugins/chc-funnel-panel/partials/';
    this.addEditorTab('Options', `${path}editor.html`, 2);
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

    this.panel.seriesColors = _.slice(this.panel.seriesColorSuperset, 0, this.data.rows.length);

    this.render();
  }

  link(scope, elem, attrs, ctrl) {
    rendering(scope, elem, attrs, ctrl);
  }

  onColorChange(panelColorIndex, type) {
    return color => {
      //if (type == 'hover')
      //  this.panel.seriesHoverColors[panelColorIndex] = color;
      //else
        this.panel.seriesColors[panelColorIndex] = color;
      this.render();
    };
  }

  onColumnChange(type) {

    _.each(this.data.columns, (obj, index) => {
      var colName = this.panel.measureColumnName;
      if (type == 'series') {
        colName = this.panel.seriesColumnName;
      }

      if (obj.text.toLowerCase() == colName){
        if (type == 'series') {
          this.panel.seriesColumnIndex = index;
        }else if (type == 'measure'){
          this.panel.measureColumnIndex = index;
        }
      }

      if (index == this.data.columns.length - 1)
        this.render();
    });
  }
}

FunnelChartJsPanelCtrl.templateUrl = 'partials/module.html';
