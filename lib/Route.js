'use strict';

/*!
 * route-mapper - Route
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _qs = require('qs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Route
 */
class Route {

  constructor($scope, path, options) {
    _lodash2.default.defaults(options, $scope.get('options'));

    this.defaultController = options.controller || $scope.get('controller');
    this.defaultAction = options.action || $scope.get('action');
    this.$scope = $scope;
    this.path = path;
    this.options = options;
    this.camelCase = options.camelCase;

    // cleanup options
    delete options.only;
    delete options.except;
    delete options.action;

    const toEndpoint = _utils2.default.splitTo(options.to);
    this._controller = toEndpoint[0] || this.defaultController;
    this._action = toEndpoint[1] || this.defaultAction;
    this._controller = this.addControllerModule(this._controller, $scope.get('module'));
  }

  get as() {
    const _as = this.options.as || '';
    return this.camelCase ? _lodash2.default.camelCase(_as) : _as;
  }

  get type() {
    return this.$scope.scopeLevel;
  }

  get controller() {
    return this._controller || this.defaultController || ':controller';
  }

  get action() {
    return this._action || this.defaultAction || ':action';
  }

  get verb() {
    return Array.isArray(this.options.verb) ? this.options.verb : [this.options.verb];
  }

  addControllerModule(controller, modyoule) {
    if (modyoule && !_lodash2.default.isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else if (/^\//.test(modyoule)) {
        modyoule = modyoule.substr(1);
      }
      return _lodash2.default.compact([modyoule, controller]).join('/');
    }
    return controller;
  }

  pathHelp() {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    const matches = this.path.match(/:[a-z]+[0-9a-zA-Z_]+/g) || [];
    const args = matches.map((m, i) => params[i]).map(p => _lodash2.default.isObject(p) && !_lodash2.default.isEmpty(p) ? undefined : p).filter(p => !_lodash2.default.isUndefined(p));
    const hash = params.slice(args.length).shift();
    const path = matches.reduce((a, b, i) => a.replace(b, args[i]), this.path);
    return hash ? [path, (0, _qs.stringify)(hash)].join('?') : path;
  }

}
exports.default = Route;