/*!
 * route-mapper - lib/Route
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = _interopRequire(require("lodash-node"));

var delegate = _interopRequire(require("delegates"));

var pathToRegexp = _interopRequire(require("path-to-regexp"));

var utils = _interopRequire(require("./utils"));

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
    this.pathWithoutFormat = this.path.replace(/\.:format\??$/, "");

    let ast = pathToRegexp(this.path);
    let pathParams = ast.keys;

    this.options = this.normalizeOptions(options, this.format, pathParams, ast, $scope.get("module"));
  }

  /**
   * @private
   */

  Route.prototype.build = function build($scope, path, options) {
    _.defaults(options, $scope.get("options"));

    this.defaultController = options.controller || $scope.get("controller");
    this.defaultAction = options.action || $scope.get("action");

    // this.defaults = _.defaults(options.defaults || {}, $scope.get('defaults') || {});
    this.$scope = $scope;
    this.options = options;

    // cleanup options
    delete options.only;
    delete options.except;
    delete options.shallow_path;
    delete options.shallow_prefix;
    delete options.shallow;
    // delete options.defaults;
    delete options.controller;
    delete options.action;
  };

  Route.prototype.normalizePath = function normalizePath(path, format) {
    path = utils.normalizePath(path);
    if (format === true) {
      return `${ path }.:format`;
    } else if (this.isOptionalFormat(path, format)) {
      return `${ path }.:format?`;
    } else {
      return path;
    }
  };

  Route.prototype.isOptionalFormat = function isOptionalFormat(path, format) {
    return format !== false && !/:format\??$/.test(path) && !(path[path.length - 1] === "/");
  };

  Route.prototype.normalizeOptions = function normalizeOptions(options, formatted, pathParams, pathAst, modyoule) {
    if (pathParams.filter(function (p) {
      return p.name === "controller";
    }).length) {
      if (modyoule) {
        throw new Error(`'controller' segment is not allowed within a namespace block`);
      }
      // Add a default constraint for :controller path segments that matches namespaced
      // controllers with default routes like :controller/:action/:id(.:format), e.g:
      // GET /admin/products/show/1
      // => { controller: 'admin/products', action: 'show', id: '1' }
      if (!_.has(options, "controller")) {
        options.controller = /.+?/;
      }
    }

    let toEndpoint = utils.splitTo(this.to);
    this._controller = toEndpoint[0] || this.defaultController;
    this._action = toEndpoint[1] || this.defaultAction;
    this._controller = this.addControllerModule(this._controller, modyoule);
    options = _.assign(options, this.checkControllerAndAction(pathParams, this._controller, this._action));
    return options;
  };

  Route.prototype.checkControllerAndAction = function checkControllerAndAction(pathParams, controller, action) {
    let hash = this.checkPart("controller", controller, pathParams, {}, function (part) {
      if (_.isRegExp(part)) return part;
      if (/^[a-z_0-9][a-z_0-9\/]*$/i.exec(part)) return part;
      throw new Error(`'${ part }' is not a supported controller name. This can lead to potential routing problems.`);
    });
    this.checkPart("action", action, pathParams, hash, function (part) {
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
    if (modyoule && !_.isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else {
        if (/^\//.test(modyoule)) {
          modyoule = modyoule.substr(1);
        }
        return _.compact([modyoule, controller]).join("/");
      }
    }
    return controller;
  };

  _createClass(Route, {
    type: {
      get: function () {
        return this.$scope.scopeLevel;
      }
    },
    controller: {
      get: function () {
        return this._controller || this.defaultController || ":controller";
      }
    },
    action: {
      get: function () {
        return this._action || this.defaultAction || ":action";
      }
    },
    verb: {
      get: function () {
        return _.isArray(this.options.verb) ? this.options.verb : [this.options.verb];
      }
    }
  });

  return Route;
})();

// Delegates
delegate(Route.prototype, "options").getter("format").getter("as").getter("to");

module.exports = Route;