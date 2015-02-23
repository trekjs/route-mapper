"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

exports._namespace = _namespace;

var isFunction = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isObject"));

var has = _babelHelpers.interopRequire(require("lodash-node/modern/object/has"));

var compact = _babelHelpers.interopRequire(require("lodash-node/modern/array/compact"));

var assign = _babelHelpers.interopRequire(require("lodash-node/modern/object/assign"));

var buildArgs = require("./utils").buildArgs;

var URL_OPTIONS = require("./const").URL_OPTIONS;

var mergeScope = _babelHelpers.interopRequire(require("./merge_scope"));

var Scoping = (function () {
  function Scoping() {
    _babelHelpers.classCallCheck(this, Scoping);
  }

  _babelHelpers.prototypeProperties(Scoping, null, {
    scope: {
      value: function scope() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, args);

        var _buildArgs$apply2 = _babelHelpers.slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];

        var scope = {};

        paths = compact(paths);
        if (paths.length) {
          options.path = paths.join("/");
        }
        var _options = options;
        if (!_babelHelpers.hasOwn.call(_options, "constraints")) _options.constraints = {};

        if (!this.isNestedScope()) {
          if (has(options, "path")) {
            var _options2 = options;
            if (!_babelHelpers.hasOwn.call(_options2, "shallow_path")) _options2.shallow_path = options.path;
          }
          if (has(options, "as")) {
            var _options3 = options;
            if (!_babelHelpers.hasOwn.call(_options3, "shallow_prefix")) _options3.shallow_prefix = options.as;
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
      value: (function (_controller) {
        var _controllerWrapper = function controller() {
          return _controller.apply(this, arguments);
        };

        _controllerWrapper.toString = function () {
          return _controller.toString();
        };

        return _controllerWrapper;
      })(function (controller, _x, cb) {
        var options = arguments[1] === undefined ? {} : arguments[1];

        if (isFunction(options)) {
          cb = options;
          options = {};
        }
        options.controller = controller;
        return this.scope(options, cb);
      }),
      writable: true,
      configurable: true
    },
    constraints: {
      value: (function (_constraints) {
        var _constraintsWrapper = function constraints() {
          return _constraints.apply(this, arguments);
        };

        _constraintsWrapper.toString = function () {
          return _constraints.toString();
        };

        return _constraintsWrapper;
      })(function (_x, cb) {
        var constraints = arguments[0] === undefined ? {} : arguments[0];

        return this.scope({ constraints: constraints }, cb);
      }),
      writable: true,
      configurable: true
    },
    namespace: {
      value: function namespace() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _namespace.apply(this, args);
      },
      writable: true,
      configurable: true
    },
    defaults: {
      value: (function (_defaults) {
        var _defaultsWrapper = function defaults() {
          return _defaults.apply(this, arguments);
        };

        _defaultsWrapper.toString = function () {
          return _defaults.toString();
        };

        return _defaultsWrapper;
      })(function (_x, cb) {
        var defaults = arguments[0] === undefined ? {} : arguments[0];

        return this.scope({ defaults: defaults }, cb);
      }),
      writable: true,
      configurable: true
    }
  });

  return Scoping;
})();

function _namespace(path, _x, cb) {
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
Object.defineProperty(exports, "__esModule", {
  value: true
});