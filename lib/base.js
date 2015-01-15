"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }

  return target;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var DEFAULT_OPTIONS = { as: "root", via: "get" };

var Base = (function () {
  function Base() {}

  _prototypeProperties(Base, null, {
    root: {

      // root('pages#main')
      // root({ to: 'pages#main' })
      value: (function (_root) {
        var _rootWrapper = function root() {
          return _root.apply(this, arguments);
        };

        _rootWrapper.toString = function () {
          return _root.toString();
        };

        return _rootWrapper;
      })(function (options, cb) {
        root.call(this, options, cb);
        return this;
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    match: {

      // Options
      //
      // controller
      // action
      // param
      // path
      // module
      // as
      // via
      // to
      // on
      // constraints
      // defaults
      // anchor
      // format
      value: function match(path, options, cb) {
        var options = arguments[1] === undefined ? null : arguments[1];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    mount: {
      value: function mount(app, options, cb) {
        var options = arguments[1] === undefined ? null : arguments[1];
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Base;
})();

var root = exports.root = function (options, cb) {
  var options = arguments[0] === undefined ? {} : arguments[0];
  options = _core.Object.assign({}, DEFAULT_OPTIONS, options);
  this.match("/", options, cb);
};

exports["default"] = Base;
module.exports = _extends(exports["default"], exports);