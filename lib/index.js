"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var Mapper = _babelHelpers.interopRequire(require("./mapper"));

var RouteMapper = _babelHelpers.interopRequire(require("./route_mapper"));

var HTTP_METHODS = require("./const").HTTP_METHODS;

//import UrlFor from './url_for';

exports.Mapper = Mapper;
exports.HTTP_METHODS = HTTP_METHODS;

//export let UrlFor = UrlFor;

exports["default"] = RouteMapper;
Object.defineProperty(exports, "__esModule", {
  value: true
});