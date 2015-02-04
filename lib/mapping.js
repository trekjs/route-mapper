"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _core = require("6to5-runtime/core-js");

var isString = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isString"));

var isRegExp = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isRegExp"));

var compact = _to5Helpers.interopRequire(require("lodash-node/modern/array/compact"));

var debug = _to5Helpers.interopRequire(require("debug"));

var normalizePath = require("./utils").normalizePath;


var debug = debug("route-mapper:mapping");

var Mapping = (function () {
  function Mapping(context, set, path, defaults, as, options) {
    _to5Helpers.classCallCheck(this, Mapping);

    this.requirements = {};
    this.conditions = {};
    this.defaults = defaults;
    this.set = set;

    this.to = options.to;
    this.default_controller = options.controller || context.get("controller");

    this.default_action = options.action || context.get("action");

    this.as = as;
    this.anchor = options.anchor;
    delete options.to;
    delete options.controller;
    delete options.action;
    delete options.anchor;

    var formatted = options.format;
    var via = options.via;
    if (isString(via)) {
      via = [via];
    }
    var optionsConstraints = options.constraints;
    delete options.format;
    delete options.via;
    delete options.constraints;

    path = this.normalizePath(path, formatted);

    if (this.to) {
      var toEndpoint = splitTo(this.to);
      this._controller = toEndpoint[0] || this.default_controller;
      this._action = toEndpoint[1] || this.default_action;
    }
    this._controller = this.addControllerModule(this.controller, context.get("module"));

    this.format = formatted;
    this.via = via;
    this.path = path;
    this.type = context.scopeLevel;

    debug("route: %s %s %s %s %s", this.type, this.as, this.via, this.path, this.controller + "#" + this.action);
  }

  _to5Helpers.prototypeProperties(Mapping, {
    build: {
      value: function build(context, set, path, as, options) {
        var contextOptions = context.get("options");
        if (contextOptions) {
          options = _core.Object.assign({}, contextOptions, options);
        }

        delete options.only;
        delete options.except;
        delete options.shallow_path;
        delete options.shallow_prefix;
        delete options.shallow;

        var defaults = _core.Object.assign({}, context.get("defaults") || {}, options.defaults || {});
        delete options.defaults;

        return new Mapping(context, set, path, defaults, as, options);
      },
      writable: true,
      configurable: true
    }
  }, {
    controller: {
      get: function () {
        return this._controller || this.default_controller;
      },
      configurable: true
    },
    action: {
      get: function () {
        return this._action || this.default_action;
      },
      configurable: true
    },
    name: {
      get: function () {
        return this.as;
      },
      configurable: true
    },
    normalizePath: {
      value: (function (_normalizePath) {
        var _normalizePathWrapper = function normalizePath() {
          return _normalizePath.apply(this, arguments);
        };

        _normalizePathWrapper.toString = function () {
          return _normalizePath.toString();
        };

        return _normalizePathWrapper;
      })(function (path, format) {
        path = normalizePath(path);
        if (format) {
          return `${ path }.:format`;
        } else if (this.isOptionalFormat(path, format)) {
          return `${ path }.:format?`;
        } else {
          return path;
        }
      }),
      writable: true,
      configurable: true
    },
    isOptionalFormat: {
      value: function isOptionalFormat(path, format) {
        return format && !/:format$/.test(path) && !(path[path.length - 1] === "/");
      },
      writable: true,
      configurable: true
    },
    addControllerModule: {
      value: function addControllerModule(controller, modyoule) {
        if (modyoule && !isRegExp(controller)) {
          if (/^\//.test(controller)) {
            return controller.substr(1);
          } else {
            if (/^\//.test(modyoule)) {
              modyoule = modyoule.substr(1);
            }
            return compact([modyoule, controller]).join("/");
          }
        }
        return controller;
      },
      writable: true,
      configurable: true
    },
    toRoute: {
      value: function toRoute() {},
      writable: true,
      configurable: true
    }
  });

  return Mapping;
})();

var splitTo = function (to) {
  if (/#/.test(to)) {
    return to.split("#");
  }
  return [];
};

module.exports = Mapping;