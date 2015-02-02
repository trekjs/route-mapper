"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var Mapper = _to5Helpers.interopRequire(require("./mapper"));

var RouteMapper = _to5Helpers.interopRequire(require("./route_mapper"));

var HTTP_METHODS = require("./const").HTTP_METHODS;
//import UrlFor from './url_for';

exports.Mapper = Mapper;
exports.HTTP_METHODS = HTTP_METHODS;
//export let UrlFor = UrlFor;

exports["default"] = RouteMapper;
exports.__esModule = true;