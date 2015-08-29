/*!
 * route-mapper - Route
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

const debug = _debug3['default']('route-mapper:route');

/**
 * Route
 *
 * @class
 */

let Route = (function () {
  function Route($scope, path, options) {
    _classCallCheck(this, Route);

    _lodash2['default'].defaults(options, $scope.get('options'));

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

    let toEndpoint = _utils2['default'].splitTo(options.to);
    this._controller = toEndpoint[0] || this.defaultController;
    this._action = toEndpoint[1] || this.defaultAction;
    this._controller = this.addControllerModule(this._controller, $scope.get('module'));
  }

  Route.prototype.addControllerModule = function addControllerModule(controller, modyoule) {
    if (modyoule && !_lodash2['default'].isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else if (/^\//.test(modyoule)) {
        modyoule = modyoule.substr(1);
      }
      return _lodash2['default'].compact([modyoule, controller]).join('/');
    }
    return controller;
  };

  _createClass(Route, [{
    key: 'as',
    get: function get() {
      let _as = this.options.as || '';
      return this.camelCase ? _lodash2['default'].camelCase(_as) : _as;
    }
  }, {
    key: 'type',
    get: function get() {
      return this.$scope.scopeLevel;
    }
  }, {
    key: 'controller',
    get: function get() {
      return this._controller || this.defaultController || ':controller';
    }
  }, {
    key: 'action',
    get: function get() {
      return this._action || this.defaultAction || ':action';
    }
  }, {
    key: 'verb',
    get: function get() {
      return _lodash2['default'].isArray(this.options.verb) ? this.options.verb : [this.options.verb];
    }
  }]);

  return Route;
})();

exports['default'] = Route;
module.exports = exports['default'];