'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

let Http = (function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  Http.prototype._mapMethod = function _mapMethod(method, args) {
    var _parseArgs = _utils.parseArgs.apply(undefined, args);

    let paths = _parseArgs[0];
    let opts = _parseArgs[1];
    let cb = _parseArgs[2];

    opts.verb = method;
    return this.match(paths, opts, cb);
  };

  return Http;
})();

['get', 'post', 'put', 'patch', 'delete'].forEach(function (m) {
  Http.prototype[m] = function () {
    return this._mapMethod(m, arguments);
  };
});

exports['default'] = Http;
module.exports = exports['default'];