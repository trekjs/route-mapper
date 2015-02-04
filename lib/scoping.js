"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _core = require("6to5-runtime/core-js");

exports.namespace = namespace;
var isFunction = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isObject"));

var has = _to5Helpers.interopRequire(require("lodash-node/modern/object/has"));

var compact = _to5Helpers.interopRequire(require("lodash-node/modern/array/compact"));

var assign = _to5Helpers.interopRequire(require("lodash-node/modern/object/assign"));

var buildArgs = require("./utils").buildArgs;
var URL_OPTIONS = require("./const").URL_OPTIONS;
var mergeScope = _to5Helpers.interopRequire(require("./merge_scope"));

var Scoping = (function () {
  function Scoping() {
    _to5Helpers.classCallCheck(this, Scoping);
  }

  _to5Helpers.prototypeProperties(Scoping, null, {
    scope: {
      value: function scope() {
        var _this = this;
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, args);

        var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];
        var scope = {};

        paths = compact(paths);
        if (paths.length) {
          options.path = paths.join("/");
        }
        if (!_to5Helpers.hasOwn.call(options, "constraints")) options.constraints = {};


        if (!this.isNestedScope()) {
          if (has(options, "path")) {
            if (!_to5Helpers.hasOwn.call(options, "shallow_path")) options.shallow_path = options.path;
          }
          if (has(options, "as")) {
            if (!_to5Helpers.hasOwn.call(options, "shallow_prefix")) options.shallow_prefix = options.as;
          }
        }

        if (isObject(options.constraints)) {
          var defaults = {};
          for (var _iterator = _core.$for.getIterator(_core.Object.keys(options.constraints)), _step; !(_step = _iterator.next()).done;) {
            var k = _step.value;
            if (URL_OPTIONS.includes(k)) {
              defaults[k] = options.constraints[k];
            }
          }

          options.defaults = assign(defaults, options.defaults || {});
        } else {
          //block = options.constraints;
          options.constraints = {};
        }

        this.context.options.forEach(function (option) {
          var value = undefined;
          if (option === "options") {
            value = options;
          } else {
            value = options[option];
            delete options[option];
          }

          if (value) {
            scope[option] = mergeScope[option](_this.context.get(option), value);
          }
        });

        if (isFunction(cb)) {
          // begin, new
          this.context = this.context.create(scope);

          cb.call(this);

          // end, reroll
          this.context = this.context.parent;
        }

        return this;
      },
      writable: true,
      configurable: true
    },
    controller: {
      value: function controller(controller, _x, cb) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        if (isFunction(options)) {
          cb = options;
          options = {};
        }
        options.controller = controller;
        return this.scope(options, cb);
      },
      writable: true,
      configurable: true
    },
    constraints: {
      value: function constraints(_x, cb) {
        var constraints = arguments[0] === undefined ? {} : arguments[0];
        return this.scope({ constraints: constraints }, cb);
      },
      writable: true,
      configurable: true
    },
    namespace: {
      value: (function (_namespace) {
        var _namespaceWrapper = function namespace() {
          return _namespace.apply(this, arguments);
        };

        _namespaceWrapper.toString = function () {
          return _namespace.toString();
        };

        return _namespaceWrapper;
      })(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return namespace.apply(this, args);
      }),
      writable: true,
      configurable: true
    },
    defaults: {
      value: function defaults(_x, cb) {
        var defaults = arguments[0] === undefined ? {} : arguments[0];
        return this.scope({ defaults: defaults }, cb);
      },
      writable: true,
      configurable: true
    }
  });

  return Scoping;
})();

function namespace(path, _x, cb) {
  var options = arguments[1] === undefined ? {} : arguments[1];
  path = String(path);
  var defaults = {
    module: path,
    path: options.path || path,
    as: options.as || path,
    shallow_path: options.path || path,
    shallow_prefix: options.as || path
  };
  assign(defaults, options);
  return this.scope(defaults, cb);
}

exports["default"] = Scoping;
exports.__esModule = true;