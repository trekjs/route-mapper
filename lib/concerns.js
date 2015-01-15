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

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var buildArgs = require("./utils").buildArgs;
var Concerns = (function () {
  function Concerns() {}

  _prototypeProperties(Concerns, null, {
    concern: {
      value: function concern(name, callable, cb) {
        var callable = arguments[1] === undefined ? null : arguments[1];
        if (!callable) {
          callable = function (options) {
            if (isFunction(cb)) {
              cb.call(this, options);
            }
          };
        }
        this._concerns[name] = callable;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    concerns: {
      value: function concerns() {
        var _this = this;
        var args = [];

        for (var _key = 0; _key < arguments.length; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, _toArray(args));

        var _buildArgs$apply2 = _slicedToArray(_buildArgs$apply, 3);

        var names = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];
        names.forEach(function (name) {
          var concern = _this._concerns[name];
          if (isFunction(concern)) {
            concern.call(_this, options);
          } else {
            throw "No concern named " + name + " was found!";
          }
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Concerns;
})();

module.exports = Concerns;