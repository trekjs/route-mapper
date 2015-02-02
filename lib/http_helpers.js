"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var buildArgs = require("./utils").buildArgs;
var HttpHelpers = (function () {
  function HttpHelpers() {}

  _to5Helpers.prototypeProperties(HttpHelpers, null, {
    get: {

      // get('bacon', { to: 'food#bacon' })
      value: function get() {
        return this._map_method("get", arguments);
      },
      writable: true,
      configurable: true
    },
    post: {

      // post('bacon', { to: 'food#bacon' })
      value: function post() {
        return this._map_method("post", arguments);
      },
      writable: true,
      configurable: true
    },
    patch: {

      // patch('bacon', { to: 'food#bacon' })
      value: function patch() {
        return this._map_method("patch", arguments);
      },
      writable: true,
      configurable: true
    },
    put: {

      // put('bacon', { to: 'food#bacon' })
      value: function put() {
        return this._map_method("put", arguments);
      },
      writable: true,
      configurable: true
    },
    "delete": {

      // delete('bacon', { to: 'food#bacon' })
      value: function _delete() {
        return this._map_method("delete", arguments);
      },
      writable: true,
      configurable: true
    },
    _map_method: {

      // private
      value: function _map_method(method, args) {
        var _buildArgs$apply = buildArgs.apply(undefined, _to5Helpers.toArray(args));

        var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];
        options.via = method;
        this.match(paths, options, cb);
        return this;
      },
      writable: true,
      configurable: true
    }
  });

  return HttpHelpers;
})();

module.exports = HttpHelpers;