"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var isFunction = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var buildArgs = require("./utils").buildArgs;
var Concerns = (function () {
  function Concerns() {}

  _to5Helpers.prototypeProperties(Concerns, null, {
    concern: {
      value: function concern(name, _x, cb) {
        var _this = this;
        var callable = arguments[1] === undefined ? null : arguments[1];
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

        var _buildArgs$apply = buildArgs.apply(undefined, _to5Helpers.toArray(args));

        var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

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