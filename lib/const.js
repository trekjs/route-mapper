"use strict";

var DEFAULT_OPTIONS = exports.DEFAULT_OPTIONS = {
  as: "root",
  via: "get"
};

var DEFAULT_RESOURCES_PATH_NAMES = exports.DEFAULT_RESOURCES_PATH_NAMES = {
  "new": "new",
  edit: "edit"
};

var HTTP_METHODS = exports.HTTP_METHODS = ["get", "head", "post", "patch", "put", "delete", "options", "trace"];

var URL_OPTIONS = exports.URL_OPTIONS = ["scheme", "host", "port", "domain", "subdomain"];

var RESERVED_OPTIONS = exports.RESERVED_OPTIONS = ["host", "protocol", "port", "subdomain", "domain", "tld_length", "trailing_slash", "anchor", "params", "only_path", "script_name", "original_script_name"];

var VALID_ON_OPTIONS = exports.VALID_ON_OPTIONS = ["new", "collection", "member"];

var RESOURCE_OPTIONS = exports.RESOURCE_OPTIONS = ["as", "controller", "path", "only", "except", "param", "concerns"];

var CANONICAL_ACTIONS = exports.CANONICAL_ACTIONS = ["index", "create", "new", "show", "update", "destroy"];
Object.defineProperty(exports, "__esModule", {
  value: true
});