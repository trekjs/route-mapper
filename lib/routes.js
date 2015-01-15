"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var Routes = (function () {
  function Routes() {
    this.routes = [];
    this.namedRoutes = {};
  }

  _prototypeProperties(Routes, null, {
    length: {
      get: function () {
        return this.routes.length;
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
        this.namedRoutes = {};
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addRoute: {
      value: function addRoute(route) {
        this.routes.push(route);
        if (!this.namedRoutes[route.as + route.via]) {
          this.namedRoutes[route.as + route.via] = route;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Routes;
})();

module.exports = Routes;