"use strict";

var _get = function get(object, property, receiver) {
  var desc = _core.Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = _core.Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var _extends = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }

  return target;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var Mapper = _interopRequire(require("./mapper"));

var RouteSet = _interopRequire(require("./route_set"));

//import UrlFor from './url_for';

var Mapper = exports.Mapper = Mapper;
var RouteSet = exports.RouteSet = RouteSet;
//export let UrlFor = UrlFor;
var HTTP_METHODS = exports.HTTP_METHODS = ["get", "head", "post", "patch", "put", "delete", "options"];

var RouteMapper = (function (RouteSet) {
  function RouteMapper() {
    if (!(this instanceof RouteMapper)) {
      return new RouteMapper();
    }
    _get(_core.Object.getPrototypeOf(RouteMapper.prototype), "constructor", this).call(this);
  }

  _inherits(RouteMapper, RouteSet);

  return RouteMapper;
})(RouteSet);

exports["default"] = RouteMapper;
module.exports = _extends(exports["default"], exports);