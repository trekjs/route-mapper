'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash-node');

var _import2 = _interopRequireWildcard(_import);

var _normalize$resolve = require('path');

/*!
 * route-mapper - utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

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
  path = _normalize$resolve.resolve(_normalize$resolve.normalize(path));
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
function parseArgs(args) {
  args = [].concat(args);
  let l = args.length,
      last = args[l - 1],
      cb,
      options,
      paths;
  if (_import2['default'].isFunction(last)) {
    cb = last;
    args.pop();
    let res = parseArgs(args);
    paths = res[0];
    options = res[1];
  } else if (_import2['default'].isObject(last) && !_import2['default'].isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else if (!last && l > 0) {
    args.pop();
    return parseArgs(args);
  } else {
    paths = args;
  }
  return [_import2['default'].compact(_import2['default'].flatten(paths, true)), options || {}, cb];
}

exports['default'] = { splitTo: splitTo, normalizePath: normalizePath, parseArgs: parseArgs };
module.exports = exports['default'];