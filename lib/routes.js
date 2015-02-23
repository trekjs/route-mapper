"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var has = _babelHelpers.interopRequire(require("lodash-node/modern/object/has"));

var Route = _babelHelpers.interopRequire(require("./route"));

var Routes = (function () {
  function Routes() {
    _babelHelpers.classCallCheck(this, Routes);

    this.routes = [];
    this.namedRoutes = {};

    this.pathHelpers = {};
    //this.urlHelpers = new WeakMap();
  }

  _babelHelpers.prototypeProperties(Routes, null, {
    length: {
      get: function () {
        return this.routes.length;
      },
      configurable: true
    },
    size: {
      get: function () {
        return this.length;
      },
      configurable: true
    },
    each: {
      value: function each(cb) {
        this.routes.forEach(cb);
      },
      writable: true,
      configurable: true
    },
    clear: {
      value: function clear() {
        this.routes.length = 0;
        this.namedRoutes = {};
        this.pathHelpers = {};
        //this.urlHelpers.clear();
      },
      writable: true,
      configurable: true
    },
    addRoute: {

      // mapping

      value: function addRoute(route) {
        var name = route.name;
        //let route = new Route(route);
        this.routes.push(route);
        if (name && !has(this.namedRoutes, name)) {
          var pathName = `${ name }_path`;
          this.pathHelpers[pathName] = this._generatePath(name, route);
          //this.urlHelpers.add(urlName);
          this.namedRoutes[name] = route;
        }
        return route;
      },
      writable: true,
      configurable: true
    },
    _generatePath: {
      value: function _generatePath(name, route) {
        var genPath = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var path = genPath.path;
          var params = genPath.ast.keys;
          if (params && params.length) {
            args = args.slice(0, params.length);
            args.forEach(function (a, i) {
              //path = path.replace(new RegExp(':' + params[i].name + ''), a || '');
              path = path.replace(/:[a-zA-Z0-9_\*\?]+/, a || "");
            });
            return path;
          }
          return genPath.path;
        };
        genPath.path = route.path;
        genPath.ast = route.ast;
        return genPath;
      },
      writable: true,
      configurable: true
    }
  });

  return Routes;
})();

module.exports = Routes;