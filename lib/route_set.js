"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var noop = _interopRequire(require("lodash-node/modern/utility/noop"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var Mapper = _interopRequire(require("./mapper"));

var Routes = _interopRequire(require("./routes"));

var RouteSet = (function () {
  function RouteSet() {
    this._routes = new Routes();
    this.resourcesPathNames = RouteSet.DEFAULT_RESOURCES_PATH_NAMES;
  }

  _prototypeProperties(RouteSet, {
    DEFAULT_RESOURCES_PATH_NAMES: {
      get: function () {
        return {
          "new": "new",
          edit: "edit"
        };
      },
      enumerable: true,
      configurable: true
    }
  }, {
    routes: {
      get: function () {
        return this._routes.routes;
      },
      enumerable: true,
      configurable: true
    },
    namedRoutes: {
      get: function () {
        return this._routes.namedRoutes;
      },
      enumerable: true,
      configurable: true
    },
    draw: {
      value: function draw() {
        var _this = this;
        var cb = arguments[0] === undefined ? noop : arguments[0];
        return (function () {
          var mapper = new Mapper(_this);
          if (isFunction(cb)) {
            cb.call(mapper, mapper);
          }
        })();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addRoute: {
      value: function addRoute(mapping) {
        this._routes.addRoute(mapping);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return RouteSet;
})();

module.exports = RouteSet;