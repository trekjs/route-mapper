"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var assign = _to5Helpers.interopRequire(require("lodash-node/modern/object/assign"));

var DEFAULT_OPTIONS = require("./const").DEFAULT_OPTIONS;
var Base = (function () {
  function Base() {
    _to5Helpers.classCallCheck(this, Base);
  }

  _to5Helpers.prototypeProperties(Base, null, {
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
      value: function match(path, options, cb) {},
      writable: true,
      configurable: true
    },
    mount: {
      value: function mount(app, options, cb) {},
      writable: true,
      configurable: true
    }
  });

  return Base;
})();

var root = exports.root = function (options, cb) {
  options = assign({}, DEFAULT_OPTIONS, options);
  return this.match("/", options, cb);
};

exports["default"] = Base;
exports.__esModule = true;