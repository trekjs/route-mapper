"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var isFunction = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var buildArgs = require("./utils").buildArgs;

var Concerns = (function () {
  function Concerns() {
    _babelHelpers.classCallCheck(this, Concerns);
  }

  _babelHelpers.prototypeProperties(Concerns, null, {
    concern: {
      value: function concern(name, callable, cb) {
        var _this = this;

        if (!callable) {
          callable = function (options) {
            if (isFunction(cb)) {
              cb.call(_this, options);
            }
          };
        }
        this._concerns[name] = callable;
        return this;
      },
      writable: true,
      configurable: true
    },
    concerns: {
      value: function concerns() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, args);

        var _buildArgs$apply2 = _babelHelpers.slicedToArray(_buildArgs$apply, 3);

        var names = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];

        names.forEach(function (name) {
          var concern = _this._concerns[name];
          if (isFunction(concern)) {
            concern.call(_this, options);
          } else {
            throw new Error(`No concern named ${ name } was found!`);
          }
        });
        return this;
      },
      writable: true,
      configurable: true
    }
  });

  return Concerns;
})();

module.exports = Concerns;