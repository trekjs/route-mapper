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

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

/**
 * Route
 *
 * @class
 */

let Route = (function () {
  function Route($scope, path, options) {
    _classCallCheck(this, Route);

    this.build($scope, path, options);

    this.path = this.normalizePath(path, this.format);
    this.pathWithoutFormat = this.path.replace(/\.:format\??$/, '');

    let ast = _pathToRegexp2['default'](this.path);
    let pathParams = ast.keys;

    this.options = this.normalizeOptions(options, this.options.format, pathParams, ast, $scope.get('module'));
  }

  /**
   * @private
   */

  Route.prototype.build = function build($scope, path, options) {
    _lodash2['default'].defaults(options, $scope.get('options'));

    this.defaultController = options.controller || $scope.get('controller');
    this.defaultAction = options.action || $scope.get('action');

    this.defaults = _lodash2['default'].defaults(options.defaults || {}, $scope.get('defaults') || {});
    this.$scope = $scope;
    this.options = options;

    // cleanup options
    delete options.only;
    delete options.except;
    delete options.shallow_path;
    delete options.shallow_prefix;
    delete options.shallow;
    delete options.defaults;
    delete options.controller;
    delete options.action;
  };

  Route.prototype.normalizePath = function normalizePath(path, format) {
    path = _utils2['default'].normalizePath(path);
    return path;
    if (format === true) {
      return `${ path }.:format`;
    } else if (this.isOptionalFormat(path, format)) {
      return `${ path }.:format?`;
    } else {
      return path;
    }
  };

  Route.prototype.isOptionalFormat = function isOptionalFormat(path, format) {
    return format !== false && !/:format\??$/.test(path) && !(path[path.length - 1] === '/');
  };

  Route.prototype.normalizeOptions = function normalizeOptions(options, formatted, pathParams, pathAst, modyoule) {
    if (pathParams.filter(function (p) {
      return p.name === 'controller';
    }).length) {
      if (modyoule) {
        throw new Error(`'controller' segment is not allowed within a namespace block`);
      }
      // Add a default constraint for :controller path segments that matches namespaced
      // controllers with default routes like :controller/:action/:id(.:format), e.g:
      // GET /admin/products/show/1
      // => { controller: 'admin/products', action: 'show', id: '1' }
      if (!_lodash2['default'].has(options, 'controller')) {
        options.controller = /.+?/;
      }
    }

    let toEndpoint = _utils2['default'].splitTo(this.options.to);
    this._controller = toEndpoint[0] || this.defaultController;
    this._action = toEndpoint[1] || this.defaultAction;
    this._controller = this.addControllerModule(this._controller, modyoule);
    options = _lodash2['default'].assign(options, this.checkControllerAndAction(pathParams, this._controller, this._action));
    return options;
  };

  Route.prototype.checkControllerAndAction = function checkControllerAndAction(pathParams, controller, action) {
    let hash = this.checkPart('controller', controller, pathParams, {}, function (part) {
      if (_lodash2['default'].isRegExp(part)) return part;
      if (/^[a-z_0-9][a-z_0-9\/]*$/i.exec(part)) return part;
      throw new Error(`'${ part }' is not a supported controller name. This can lead to potential routing problems.`);
    });
    this.checkPart('action', action, pathParams, hash, function (part) {
      return part;
    });
    return hash;
  };

  Route.prototype.checkPart = function checkPart(name, part, pathParams, hash, cb) {
    if (part) {
      hash[name] = cb(part);
    } else {
      if (!pathParams.filter(function (p) {
        return p.name === name;
      }).length) {
        throw new Error(`Missing :${ name } key on routes definition, please check your routes.`);
      }
    }
    return hash;
  };

  Route.prototype.addControllerModule = function addControllerModule(controller, modyoule) {
    if (modyoule && !_lodash2['default'].isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else {
        if (/^\//.test(modyoule)) {
          modyoule = modyoule.substr(1);
        }
        return _lodash2['default'].compact([modyoule, controller]).join('/');
      }
    }
    return controller;
  };

  _createClass(Route, [{
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