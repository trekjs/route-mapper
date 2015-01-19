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

var buildArgs = require("./utils").buildArgs;
var HttpHelpers = (function () {
  function HttpHelpers() {}

  _prototypeProperties(HttpHelpers, null, {
    get: {

      // get('bacon', { to: 'food#bacon' })
      value: function get() {
        var args = [];

        for (var _key = 0; _key < arguments.length; _key++) {
          args[_key] = arguments[_key];
        }

        return this._map_method("get", args);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    post: {

      // post('bacon', { to: 'food#bacon' })
      value: function post() {
        var args = [];

        for (var _key2 = 0; _key2 < arguments.length; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this._map_method("post", args);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    patch: {

      // patch('bacon', { to: 'food#bacon' })
      value: function patch() {
        var args = [];

        for (var _key3 = 0; _key3 < arguments.length; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return this._map_method("patch", args);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    put: {

      // put('bacon', { to: 'food#bacon' })
      value: function put() {
        var args = [];

        for (var _key4 = 0; _key4 < arguments.length; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return this._map_method("put", args);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    "delete": {

      // delete('bacon', { to: 'food#bacon' })
      value: function _delete() {
        var args = [];

        for (var _key5 = 0; _key5 < arguments.length; _key5++) {
          args[_key5] = arguments[_key5];
        }

        return this._map_method("delete", args);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _map_method: {

      // private
      value: function MapMethod(method, args) {
        var _buildArgs$apply = buildArgs.apply(undefined, _toArray(args));

        var _buildArgs$apply2 = _slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];
        options.via = method;
        this.match(paths, options, cb);
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return HttpHelpers;
})();

module.exports = HttpHelpers;