"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var Route = _interopRequire(require("./route"));

var newObject = require("./utils").newObject;
var hasOwn = require("./utils").hasOwn;
var Routes = (function () {
  function Routes() {
    this.routes = [];
    this.namedRoutes = newObject();

    this.pathHelpers = newObject();
    //this.urlHelpers = new WeakMap();
  }

  _prototypeProperties(Routes, null, {
    length: {
      get: function () {
        return this.routes.length;
      },
      enumerable: true,
      configurable: true
    },
    size: {
      get: function () {
        return this.length;
      },
      enumerable: true,
      configurable: true
    },
    each: {
      value: function each(cb) {
        this.routes.forEach(cb);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    clear: {
      value: function clear() {
        this.routes.length = 0;
        this.namedRoutes = newObject();
        this.pathHelpers = newObject();
        //this.urlHelpers.clear();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addRoute: {
      value: function addRoute(mapping) {
        var name = mapping.name;
        var route = mapping;
        //let route = new Route(mapping);
        this.routes.push(route);
        if (name && !hasOwn(this.namedRoutes, name)) {
          var pathName = "" + name + "_path";
          this.pathHelpers[pathName] = this._generatePath(name, route);
          //this.urlHelpers.add(urlName);
          this.namedRoutes[name] = route;
        }
        return route;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _generatePath: {
      value: function GeneratePath(name, route) {
        var genPath = function () {
          var args = [];

          for (var _key = 0; _key < arguments.length; _key++) {
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
      enumerable: true,
      configurable: true
    }
  });

  return Routes;
})();

module.exports = Routes;