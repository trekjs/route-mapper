"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var isArray = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isArray"));

var isFunction = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isObject"));

var compact = _babelHelpers.interopRequire(require("lodash-node/modern/array/compact"));

var flatten = _babelHelpers.interopRequire(require("lodash-node/modern/array/flatten"));

var normalize = require("path").normalize;

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
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var l = args.length,
      last = args[l - 1],
      cb = undefined,
      options = undefined,
      paths = undefined;
  if (!last && l > 0) {
    args.pop();
    return buildArgs.apply(undefined, args);
  } else if (isFunction(last)) {
    cb = last;
    args.pop();
    var res = buildArgs.apply(undefined, args);
    paths = res[0];
    options = res[1];
  } else if (isObject(last) && !isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else {
    paths = args;
  }
  return [flatten(paths, true), options || {}, cb];
};
Object.defineProperty(exports, "__esModule", {
  value: true
});