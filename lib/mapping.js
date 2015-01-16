"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var isString = _interopRequire(require("lodash-node/modern/lang/isString"));

var isRegExp = _interopRequire(require("lodash-node/modern/lang/isRegExp"));

var normalizePath = require("./utils").normalizePath;
var compact = require("./utils").compact;
var Mapping = (function () {
  function Mapping(context, set, path, defaults, as, options) {
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
      this.controller = toEndpoint[0] || this.default_controller;
      this.action = toEndpoint[1] || this.default_action;
    }
    this.controller = this.addControllerModule(this.controller || this.default_controller, context.get("module"));

    this.format = formatted;
    this.via = via;
    this.path = path;

    console.log(as, via, path, (this.controller || this.default_controller) + "#" + (this.action || this.default_action));
  }

  _prototypeProperties(Mapping, {
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
      enumerable: true,
      configurable: true
    }
  }, {
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
          return "" + path + ".:format";
        } else if (this.isOptionalFormat(path, format)) {
          return "" + path + ".:format?";
        } else {
          return path;
        }
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    isOptionalFormat: {
      value: function isOptionalFormat(path, format) {
        return format && !/:format$/.test(path) && !(path[path.length - 1] === "/");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addControllerModule: {
      value: function addControllerModule(controller, modyoule) {
        if (modyoule && !isRegExp(controller)) {
          if (/^\//.test(controller)) {
            return controller.substr(1);
          } else {
            return compact([modyoule, controller]).join("/");
          }
        }
        return controller;
      },
      writable: true,
      enumerable: true,
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