/*!
 * route-mapper - utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

/**
 * Split a string to an array.
 *
 * @example
 *  splitTo('controller#action')
 *  // => [ 'controller', 'action' ]
 *
 * @param {String} to
 * @return {Array} [ controller, action ]
 */
function splitTo() {
  let to = arguments[0] === undefined ? '' : arguments[0];

  if (/#/.test(to)) {
    return to.split('#');
  }
  return [];
}

/**
 * Normalize Path
 *
 * @param {String} path
 * @return {String}
 */
function normalizePath(path) {
  path = '/' + path;
  path = (0, _path.resolve)((0, _path.normalize)(path));
  path = path.replace(/(%[a-f0-9]{2})/g, function ($1) {
    return $1.toUpperCase();
  });
  if (path === '') path = '/';
  return path;
}

/**
 * Parse the arguments and return an special array.
 *
 * @example
 *  parseArgs(path)
 *  // => [[path], {}, undefined]
 *  parseArgs(path, cb)
 *  // => [[path], {}, cb]
 *  parseArgs(path, options)
 *  // => [[path], options, undefined]
 *  parseArgs(options)
 *  // => [[], options, undefined]
 *
 * @param {Array|ArrayLike} args
 * @return {Array} [ [path, path], {}, function ]
 */
function parseArgs() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  let l = args.length,
      last = args[l - 1],
      cb,
      options,
      paths;
  if (_lodash2['default'].isFunction(last)) {
    cb = last;
    args.pop();
    let res = parseArgs.apply(undefined, args);
    paths = res[0];
    options = res[1];
  } else if (_lodash2['default'].isObject(last) && !_lodash2['default'].isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else if (!last && l > 0) {
    args.pop();
    return parseArgs.apply(undefined, args);
  } else {
    paths = args;
  }
  return [_lodash2['default'].compact(_lodash2['default'].flatten(paths, true)), options || {}, cb];
}

exports['default'] = {
  splitTo: splitTo, normalizePath: normalizePath, parseArgs: parseArgs
};
module.exports = exports['default'];