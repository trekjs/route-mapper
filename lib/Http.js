'use strict';

/*!
 * route-mapper - Http
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _methods = require('methods');

var _methods2 = _interopRequireDefault(_methods);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Http {

  _mapMethod(method, args) {
    var _utils$parseArgs = _utils2.default.parseArgs(...args);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    const paths = _utils$parseArgs2[0];
    const opts = _utils$parseArgs2[1];
    const cb = _utils$parseArgs2[2];

    opts.verb = method;
    return this.match(paths, opts, cb);
  }

  static get METHODS() {
    return _methods2.default;
  }

}

exports.default = Http;
_methods2.default.forEach(m => {
  const v = m.replace('-', '');
  Object.defineProperty(Http.prototype, v, {
    value: eval(`(function $${ v }() {
                return this._mapMethod('${ m }', arguments) })`)
  });
});