'use strict';

/*!
 * route-mapper - utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  let to = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

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
  path = path.replace(/(%[a-f0-9]{2})/g, $1 => $1.toUpperCase());
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

  const l = args.length;
  const last = args[l - 1];
  let cb, opts, paths;
  if (_lodash2.default.isFunction(last)) {
    cb = last;
    args.pop(); // don't remove this semicolon

    var _parseArgs = parseArgs(...args);

    var _parseArgs2 = _slicedToArray(_parseArgs, 2);

    paths = _parseArgs2[0];
    opts = _parseArgs2[1];
  } else if (_lodash2.default.isObject(last) && !_lodash2.default.isArray(last)) {
    opts = last;
    args.pop();
    paths = args;
  } else if (!last && l > 0) {
    args.pop();
    return parseArgs(...args);
  } else {
    paths = args;
  }
  return [_lodash2.default.compact(_lodash2.default.flatten(paths, true)), opts || {}, cb];
}

const mergeScope = {

  // parent/child
  path(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  // parent_child
  as(parent, child) {
    return parent ? `${ parent }_${ child }` : child;
  },

  // parent/child
  module(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  controller(parent, child) {
    return child;
  },

  action(parent, child) {
    return child;
  },

  pathNames(parent, child) {
    return this.options(parent, child);
  },

  options(parent, child) {
    parent = _lodash2.default.assign(parent || {});
    const excepts = this.overrideKeys(child);
    let key;
    for (key of excepts) {
      delete parent[key];
    }
    return _lodash2.default.assign(parent, child);
  },

  overrideKeys(child) {
    return child.only || child.except ? ['only', 'except'] : [];
  }

};

exports.default = {
  splitTo,
  parseArgs,
  mergeScope,
  normalizePath
};