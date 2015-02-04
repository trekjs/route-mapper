"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var noop = _to5Helpers.interopRequire(require("lodash-node/modern/utility/noop"));

var isFunction = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

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
        this._routes.addRoute(mapping);
      },
      writable: true,
      configurable: true
    }
  });

  return RouteMapper;
})();

module.exports = RouteMapper;