"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var DEFAULT_RESOURCES_PATH_NAMES = exports.DEFAULT_RESOURCES_PATH_NAMES = {
  "new": "new",
  edit: "edit"
};

var HTTP_METHODS = exports.HTTP_METHODS = ["get", "head", "post", "patch", "put", "delete", "options", "trace"];

var URL_OPTIONS = exports.URL_OPTIONS = ["scheme", "host", "port", "domain", "subdomain"];