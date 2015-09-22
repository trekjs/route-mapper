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
  path = _path.resolve(_path.normalize(path));
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
      opts,
      paths;
  if (_lodash2['default'].isFunction(last)) {
    cb = last;
    args.pop(); // don't remove this semicolon

    var _parseArgs = parseArgs.apply(undefined, args);

    paths = _parseArgs[0];
    opts = _parseArgs[1];
  } else if (_lodash2['default'].isObject(last) && !_lodash2['default'].isArray(last)) {
    opts = last;
    args.pop();
    paths = args;
  } else if (!last && l > 0) {
    args.pop();
    return parseArgs.apply(undefined, args);
  } else {
    paths = args;
  }
  return [_lodash2['default'].compact(_lodash2['default'].flatten(paths, true)), opts || {}, cb];
}

const mergeScope = {

  // parent/child
  path: function path(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  // parent_child
  as: function as(parent, child) {
    return parent ? `${ parent }_${ child }` : child;
  },

  // parent/child
  module: function module(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  controller: function controller(parent, child) {
    return child;
  },

  action: function action(parent, child) {
    return child;
  },

  pathNames: function pathNames(parent, child) {
    return this.options(parent, child);
  },

  options: function options(parent, child) {
    parent = _lodash2['default'].assign(parent || {});
    let excepts = this.overrideKeys(child);
    for (var _iterator = excepts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      let key = _ref;

      delete parent[key];
    }
    return _lodash2['default'].assign(parent, child);
  },

  overrideKeys: function overrideKeys(child) {
    return child.only || child.except ? ['only', 'except'] : [];
  }

};

exports['default'] = {
  splitTo: splitTo,
  parseArgs: parseArgs,
  mergeScope: mergeScope,
  normalizePath: normalizePath
};
module.exports = exports['default'];