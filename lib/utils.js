"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _core = require("6to5-runtime/core-js");

var isArray = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isArray"));

var isFunction = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isObject"));

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
    return buildArgs.apply(undefined, _to5Helpers.toArray(args));
  } else if (isFunction(last)) {
    cb = last;
    args.pop();
    var res = buildArgs.apply(undefined, _to5Helpers.toArray(args));
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


// mixin(Mapper.prototype, Base.prototype);
var mixin = exports.mixin = _core.Object.define || function (target, source) {
  _core.Object.getOwnPropertyNames(source).forEach(function (key) {
    Object.defineProperty(target, key, _core.Object.getOwnPropertyDescriptor(source, key));
  });
  return target;
};
exports.__esModule = true;