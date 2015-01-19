"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : _core.Array.from(arr);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var isArray = _interopRequire(require("lodash-node/modern/lang/isArray"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _interopRequire(require("lodash-node/modern/lang/isObject"));

var normalize = require("path").normalize;


var _hasOwn = Object.prototype.hasOwnProperty;

var hasOwn = exports.hasOwn = function (o, k) {
  return _hasOwn.call(o, k);
};

var normalizePath = exports.normalizePath = function (path) {
  path = "/" + path;
  path = normalize(path);
  path = path.replace(/(%[a-f0-9]{2})/g, function ($1) {
    return $1.toUpperCase();
  });
  if (path === "") path = "/";
  return path;
};

// [path, path, path, options, cb] => [paths, options, cb]
// [path, cb] => [paths, {}, cb]
// [path, options] => [paths, options, undefined]
// [options] => [[], options, undefined]
// [cb] => [[], {}, cb]
// [path] => [paths, {}, undefined]
// [] => [[], {}, undefined]
var buildArgs = exports.buildArgs = function () {
  var args = [];

  for (var _key = 0; _key < arguments.length; _key++) {
    args[_key] = arguments[_key];
  }

  var l = args.length,
      last = args[l - 1],
      cb = undefined,
      options = undefined,
      paths = undefined;
  if (!last && l > 0) {
    args.pop();
    return buildArgs.apply(undefined, _toArray(args));
  } else if (isFunction(last)) {
    cb = last;
    args.pop();
    var res = buildArgs.apply(undefined, _toArray(args));
    paths = res[0];
    options = res[1];
  } else if (isObject(last) && !isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else {
    paths = args;
  }
  return [flatten(paths), options || newObject(), cb];
};


// [1, 2, 3, [4, 5, 6]] => [1, 2, 3, 4, 5, 6]
var flatten = exports.flatten = function (list) {
  return list.reduce(function (a, b) {
    return a.concat(isArray(b) ? flatten(b) : b);
  }, []);
};

// [null, undefined, false, ''] => []
var compact = exports.compact = function (list) {
  return list.filter(function (e) {
    return !(e === null || e === false || e === "" || e === void 0);
  });
};

// [1, null, false] => true
// [null] => false
// [undefined] => false
// [false] => false
// ['', ''] => false
// [0] => true
var any = exports.any = function (list) {
  return compact(list).length > 0;
};

// Object.create(null)
var newObject = exports.newObject = function () {
  return Object.create(null);
};