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

var DEFAULT_RESOURCES_PATH_NAMES = require("./const").DEFAULT_RESOURCES_PATH_NAMES;
var RouteMapper = (function () {
  function RouteMapper() {
    var _this = this;
    var options = arguments[0] === undefined ? Object(null) : arguments[0];
    return (function () {
      if (!(_this instanceof RouteMapper)) {
        return new RouteMapper(options);
      }
      _this._routes = new Routes();
      _this.resourcesPathNames = DEFAULT_RESOURCES_PATH_NAMES;
    })();
  }

  _prototypeProperties(RouteMapper, null, {
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
    urlHelpers: {
      get: function () {
        return this._routes.urlHelpers;
      },
      enumerable: true,
      configurable: true
    },
    draw: {
      value: function draw() {
        var _this2 = this;
        var cb = arguments[0] === undefined ? noop : arguments[0];
        return (function () {
          var mapper = new Mapper(_this2);
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

  return RouteMapper;
})();

module.exports = RouteMapper;