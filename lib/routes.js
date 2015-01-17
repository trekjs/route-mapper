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
    this.urlHelpers = {};
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
        var _this = this;
        this.routes.push(route);
        if (route.name && !this.namedRoutes[route.name]) {
          (function () {
            _this.namedRoutes[route.name] = route;
            var urlPath = function () {
              var args = [];

              for (var _key = 0; _key < arguments.length; _key++) {
                args[_key] = arguments[_key];
              }

              if (urlPath.params) {
                var _ret2 = (function () {
                  var path = urlPath.path;
                  args = args.slice(0, urlPath.params.length);
                  args.forEach(function (a, i) {
                    path = path.replace(urlPath.params[i], a);
                  });
                  return {
                    v: path
                  };
                })();

                if (typeof _ret2 === "object") return _ret2.v;
              }
              return urlPath.path;
            };
            urlPath.path = route.path;
            urlPath.params = urlPath.path.match(/:[a-zA-Z0-9_\*\?]+/g);
            _this.urlHelpers[route.name + "_path"] = urlPath;
          })();
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