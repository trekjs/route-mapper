"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = _core.$for.getIterator(arr), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : _core.Array.from(arr);
};

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

var _hasOwn = Object.prototype.hasOwnProperty;
var _core = _interopRequire(require("core-js/library"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _interopRequire(require("lodash-node/modern/lang/isObject"));

var buildArgs = require("./utils").buildArgs;
var compact = require("./utils").compact;
var newObject = require("./utils").newObject;
var normalizePath = require("./utils").normalizePath;
var flatten = require("./utils").flatten;
var hasOwn = require("./utils").hasOwn;
var mergeScope = _interopRequire(require("./merge_scope"));

var URL_OPTIONS = ["protocol", "subdomain", "domain", "host", "port"];

var Scoping = (function () {
  function Scoping() {}

  _prototypeProperties(Scoping, null, {
    scope: {
      value: function scope() {
        var _this = this;
        var args = [];

        for (var _key = 0; _key < arguments.length; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, _toArray(args));

        var _buildArgs$apply2 = _slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];
        var scope = newObject();

        paths = compact(paths);
        if (paths.length) {
          options.path = paths.join("/");
        }
        var _options = options;
        if (!_hasOwn.call(_options, "constraints")) _options.constraints = newObject();


        if (!this.isNestedScope()) {
          if (hasOwn(options, "path")) {
            var _options2 = options;
            if (!_hasOwn.call(_options2, "shallow_path")) _options2.shallow_path = options.path;
          }
          if (hasOwn(options, "as")) {
            var _options3 = options;
            if (!_hasOwn.call(_options3, "shallow_prefix")) _options3.shallow_prefix = options.as;
          }
        }

        if (isObject(options.constraints)) {
          var defaults = newObject();
          for (var _iterator = _core.$for.getIterator(_core.Object.keys(options.constraints)), _step; !(_step = _iterator.next()).done;) {
            var k = _step.value;
            if (URL_OPTIONS.includes(k)) {
              defaults[k] = options.constraints[k];
            }
          }

          options.defaults = _core.Object.assign(defaults, options.defaults || newObject());
        } else {
          //block = options.constraints;
          options.constraints = newObject();
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

        // begin, new
        this.context = this.context.create(scope);

        if (isFunction(cb)) {
          cb.call(this);
        }

        // end, reroll
        this.context = this.context.parent;

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    controller: {
      value: function controller(controller, options, cb) {
        var _this2 = this;
        var options = arguments[1] === undefined ? newObject() : arguments[1];
        return (function () {
          if (isFunction(options)) {
            cb = options;
            options = newObject();
          }
          options.controller = controller;
          return _this2.scope(options, cb);
        })();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    constraints: {
      value: function constraints(constraints, cb) {
        var _this3 = this;
        var constraints = arguments[0] === undefined ? newObject() : arguments[0];
        return (function () {
          return _this3.scope(Object.create({ constraints: constraints }), cb);
        })();
      },
      writable: true,
      enumerable: true,
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
        var args = [];

        for (var _key2 = 0; _key2 < arguments.length; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return namespace.apply(this, args);
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    defaults: {
      value: function defaults(defaults, cb) {
        var _this4 = this;
        var defaults = arguments[0] === undefined ? newObject() : arguments[0];
        return (function () {
          return _this4.scope(Object.create({ defaults: defaults }), cb);
        })();
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Scoping;
})();

var namespace = exports.namespace = function (path, options, cb) {
  var _this5 = this;
  var options = arguments[1] === undefined ? newObject() : arguments[1];
  return (function () {
    path = String(path);
    var defaults = Object.create({
      module: path,
      path: options.path || path,
      as: options.as || path,
      shallow_path: options.path || path,
      shallow_prefix: options.as || path
    });
    _core.Object.assign(defaults, options);
    return _this5.scope(defaults, cb);
  })();
};

exports["default"] = Scoping;
module.exports = _extends(exports["default"], exports);