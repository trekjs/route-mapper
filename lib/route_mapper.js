"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _core = require("6to5-runtime/core-js");

var noop = _to5Helpers.interopRequire(require("lodash-node/modern/utility/noop"));

var isRegExp = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isRegExp"));

var isFunction = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var escape = _to5Helpers.interopRequire(require("lodash-node/modern/string/escape"));

var pathToRegexp = _to5Helpers.interopRequire(require("path-to-regexp"));

var Mapper = _to5Helpers.interopRequire(require("./mapper"));

var Routes = _to5Helpers.interopRequire(require("./routes"));

var DEFAULT_RESOURCES_PATH_NAMES = require("./const").DEFAULT_RESOURCES_PATH_NAMES;
var RouteMapper = (function () {
  function RouteMapper() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    _to5Helpers.classCallCheck(this, RouteMapper);

    if (!(this instanceof RouteMapper)) {
      return new RouteMapper(options);
    }

    this._routes = new Routes();
    this.resourcesPathNames = DEFAULT_RESOURCES_PATH_NAMES;
  }

  _to5Helpers.prototypeProperties(RouteMapper, null, {
    routes: {
      get: function () {
        return this._routes.routes;
      },
      configurable: true
    },
    namedRoutes: {
      get: function () {
        return this._routes.namedRoutes;
      },
      configurable: true
    },
    pathHelpers: {
      get: function () {
        return this._routes.pathHelpers;
      },
      configurable: true
    },
    urlHelpers: {
      get: function () {
        return this._routes.urlHelpers;
      },
      configurable: true
    },
    clear: {
      value: function clear() {
        this._routes.clear();
      },
      writable: true,
      configurable: true
    },
    draw: {
      value: function draw() {
        var cb = arguments[0] === undefined ? noop : arguments[0];
        var mapper = new Mapper(this);
        if (isFunction(cb)) {
          cb.call(mapper, mapper);
        }
      },
      writable: true,
      configurable: true
    },
    addRoute: {
      value: function addRoute(mapping) {
        var name = mapping.name;

        if (name && !name.match(/^[_a-z]\w*$/i)) {
          throw new Error(`Invalid route name: '${ name }'`);
        }

        if (name && this.namedRoutes[name]) {
          throw new Error(`Invalid route name, already in use: '${ name }'`);
        }

        var requirements = mapping.requirements;
        var defaults = mapping.defaults;
        var anchor = mapping.anchor;
        var conditions = mapping.conditions;
        var path = conditions.pathInfo;
        var ast = conditions.parsedPathInfo;
        mapping.ast = this.buildPath(path, ast, requirements, anchor);

        //conditions = this.buildConditions(conditions, ast.keys);
        // let route = this._routes.addRoute(/*app, */ast, conditions, defaults, name);
        var route = this._routes.addRoute(mapping);
        return route;
      },
      writable: true,
      configurable: true
    },
    buildPath: {
      value: function buildPath(path, ast, requirements, anchor) {
        ast.keys.forEach(function (p) {
          var k = p.name;
          if (!new RegExp(":" + k + "\\(").exec(path)) {
            var v = requirements[k] || /[^\.\/\?]+/;
            path = path.replace(":" + k, ":" + k + "(" + (isRegExp(v) ? escape(v.source) : v) + ")");
          }
        });

        // rebuild
        ast = pathToRegexp(path);
        return ast;
      },
      writable: true,
      configurable: true
    },
    buildConditions: {
      value: function buildConditions(conditions, pathValues) {
        var verbs = conditions.requestMethod || [];
        if (verbs.length) {
          conditions.requestMethod = new RegExp("^" + verbs.join("|") + "$");
        }
        var keys = _core.Object.keys(conditions).filter(function (k) {
          return k === "action" || k === "controller" || k === "requiredDefaults" || pathValues.filter(function (pk) {
            return pk.name === k;
          }).length;
        });
        var o = {};
        keys.forEach(function (k) {
          o[k] = conditions[k];
        });
        return o;
      },
      writable: true,
      configurable: true
    }
  });

  return RouteMapper;
})();

module.exports = RouteMapper;