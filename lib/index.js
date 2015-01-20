"use strict";

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

var RouteMapper = _interopRequire(require("./route_set"));

//import UrlFor from './url_for';

var Mapper = exports.Mapper = Mapper;
//export let UrlFor = UrlFor;
var HTTP_METHODS = exports.HTTP_METHODS = ["get", "head", "post", "patch", "put", "delete", "options"];

exports["default"] = RouteMapper;
module.exports = _extends(exports["default"], exports);