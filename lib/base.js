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

var newObject = require("./utils").newObject;


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
        return root.call(this, options, cb);
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
  var _this = this;
  var options = arguments[0] === undefined ? newObject() : arguments[0];
  return (function () {
    options = _core.Object.assign(newObject(), DEFAULT_OPTIONS, options);
    return _this.match("/", options, cb);
  })();
};

exports["default"] = Base;
module.exports = _extends(exports["default"], exports);