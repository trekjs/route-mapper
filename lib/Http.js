'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _methods = require('methods');

var _methods2 = _interopRequireDefault(_methods);

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

  _createClass(Http, null, [{
    key: 'METHODS',
    get: function get() {
      return _methods2['default'];
    }
  }]);

  return Http;
})();

_methods2['default'].forEach(function (m) {
  let v = m.replace('-', '');
  let name = v === 'delete' ? 'del' : v;
  Http.prototype[v] = eval(`(function ${ name }() {
    return this._mapMethod('${ m }', arguments);
  })`);
});

exports['default'] = Http;
module.exports = exports['default'];