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
        return this._map_method("get", arguments);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    post: {

      // post('bacon', { to: 'food#bacon' })
      value: function post() {
        return this._map_method("post", arguments);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    patch: {

      // patch('bacon', { to: 'food#bacon' })
      value: function patch() {
        return this._map_method("patch", arguments);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    put: {

      // put('bacon', { to: 'food#bacon' })
      value: function put() {
        return this._map_method("put", arguments);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    "delete": {

      // delete('bacon', { to: 'food#bacon' })
      value: function _delete() {
        return this._map_method("delete", arguments);
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