/*!
 * route-mapper - lib/utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _ = _interopRequire(require("lodash-node"));

var _path = require("path");

var normalize = _path.normalize;
var resolve = _path.resolve;

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
  let to = arguments[0] === undefined ? "" : arguments[0];

  if (/#/.test(to)) {
    return to.split("#");
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
  path = "/" + path;
  path = resolve(normalize(path));
  path = path.replace(/(%[a-f0-9]{2})/g, function ($1) {
    return $1.toUpperCase();
  });
  if (path === "") path = "/";
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
  args = [].concat(_toConsumableArray(args));
  let l = args.length,
      last = args[l - 1],
      cb,
      options,
      paths;
  if (_.isFunction(last)) {
    cb = last;
    args.pop();
    let res = parseArgs(args);
    paths = res[0];
    options = res[1];
  } else if (_.isObject(last) && !_.isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else if (!last && l > 0) {
    args.pop();
    return parseArgs(args);
  } else {
    paths = args;
  }
  return [_.compact(_.flatten(paths, true)), options || {}, cb];
}

module.exports = { splitTo: splitTo, normalizePath: normalizePath, parseArgs: parseArgs };