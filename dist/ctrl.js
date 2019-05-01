"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunnelChartJsPanelCtrl = void 0;

var _sdk = require("app/plugins/sdk");

var _lodash = _interopRequireDefault(require("lodash"));

var _rendering = _interopRequireDefault(require("./rendering"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var panelDefaults = {
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

var FunnelChartJsPanelCtrl =
/*#__PURE__*/
function (_MetricsPanelCtrl) {
  _inherits(FunnelChartJsPanelCtrl, _MetricsPanelCtrl);

  function FunnelChartJsPanelCtrl($scope, $injector, $rootScope) {
    var _this;

    _classCallCheck(this, FunnelChartJsPanelCtrl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FunnelChartJsPanelCtrl).call(this, $scope, $injector));
    _this.$rootScope = $rootScope;
    _this.data = null;

    _lodash["default"].defaults(_this.panel, panelDefaults);

    _lodash["default"].defaults(_this.panel.legend, panelDefaults.legend);

    _this.events.on('render', _this.onRender.bind(_assertThisInitialized(_this)));

    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_assertThisInitialized(_this)));

    _this.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(FunnelChartJsPanelCtrl, [{
    key: "onRender",
    value: function onRender() {}
  }, {
    key: "onInitEditMode",
    value: function onInitEditMode() {
      var path = 'public/plugins/chc-funnel-panel/partials/';
      this.addEditorTab('Options', "".concat(path, "editor.html"), 2);
    }
  }, {
    key: "onDataError",
    value: function onDataError() {
      this.render();
    }
  }, {
    key: "onDataReceived",
    value: function onDataReceived(dataList) {
      if (dataList && dataList.length > 0) {
        var data = dataList[0];
        this.data = {
          isReal: true,
          type: data.type,
          columns: data.columns,
          rows: data.rows,
          columnTexts: data.columns.map(function (col) {
            return 'string' === typeof col ? col : col.text;
          })
        };
      } else {
        this.data = {
          isReal: false,
          type: 'table',
          columns: [{
            text: "Series"
          }, {
            text: "Value"
          }],
          rows: [['Green', 50], ['Blue', 5], ['Red', 30], ['Yellow', 30]]
        };
      }

      this.panel.seriesColors = _lodash["default"].slice(this.panel.seriesColorSuperset, 0, this.data.rows.length);
      this.render();
    }
  }, {
    key: "link",
    value: function link(scope, elem, attrs, ctrl) {
      (0, _rendering["default"])(scope, elem, attrs, ctrl);
    }
  }, {
    key: "onColorChange",
    value: function onColorChange(panelColorIndex, type) {
      var _this2 = this;

      return function (color) {
        //if (type == 'hover')
        //  this.panel.seriesHoverColors[panelColorIndex] = color;
        //else
        _this2.panel.seriesColors[panelColorIndex] = color;

        _this2.render();
      };
    }
  }, {
    key: "onColumnChange",
    value: function onColumnChange(type) {
      var _this3 = this;

      _lodash["default"].each(this.data.columns, function (obj, index) {
        var colName = _this3.panel.measureColumnName;

        if (type == 'series') {
          colName = _this3.panel.seriesColumnName;
        }

        if (obj.text.toLowerCase() == colName) {
          if (type == 'series') {
            _this3.panel.seriesColumnIndex = index;
          } else if (type == 'measure') {
            _this3.panel.measureColumnIndex = index;
          }
        }

        if (index == _this3.data.columns.length - 1) _this3.render();
      });
    }
  }]);

  return FunnelChartJsPanelCtrl;
}(_sdk.MetricsPanelCtrl);

exports.FunnelChartJsPanelCtrl = FunnelChartJsPanelCtrl;
FunnelChartJsPanelCtrl.templateUrl = 'partials/module.html';
//# sourceMappingURL=ctrl.js.map
