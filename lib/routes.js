"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var has = _to5Helpers.interopRequire(require("lodash-node/modern/object/has"));

var Route = _to5Helpers.interopRequire(require("./route"));

var Routes = (function () {
  function Routes() {
    _to5Helpers.classCallCheck(this, Routes);

    this.routes = [];
    this.namedRoutes = {};

    this.pathHelpers = {};
    //this.urlHelpers = new WeakMap();
  }

  _to5Helpers.prototypeProperties(Routes, null, {
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
      value: function addRoute(mapping) {
        var name = mapping.name;
        var route = mapping;
        //let route = new Route(mapping);
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

          if (genPath.params) {
            var _ret = (function () {
              var path = genPath.path;
              args = args.slice(0, genPath.params.length);
              args.forEach(function (a, i) {
                path = path.replace(genPath.params[i], a);
              });
              return {
                v: path
              };
            })();

            if (typeof _ret === "object") return _ret.v;
          }
          return genPath.path;
        };
        genPath.path = route.path;
        genPath.params = genPath.path.match(/:[a-zA-Z0-9_\*\?]+/g);
        return genPath;
      },
      writable: true,
      configurable: true
    }
  });

  return Routes;
})();

module.exports = Routes;