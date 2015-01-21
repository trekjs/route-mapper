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

var HTTP_METHODS = require("./const").HTTP_METHODS;
//import UrlFor from './url_for';

exports.Mapper = Mapper;
exports.HTTP_METHODS = HTTP_METHODS;
exports["default"] = RouteMapper;
//export let UrlFor = UrlFor;

module.exports = _extends(exports["default"], exports);