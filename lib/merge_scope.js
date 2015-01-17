"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var normalizePath = require("./utils").normalizePath;
var compact = require("./utils").compact;
module.exports = {

  // parent/child
  path: function path(parent, child) {
    //return normalizePath([parent, child].join('/'));
    return parent ? normalizePath("" + parent + "/" + child) : child;
  },

  // parent/child
  shallow_path: function shallowPath(parent, child) {
    return parent ? normalizePath("" + parent + "/" + child) : child;
  },

  // parent_child
  as: function as(parent, child) {
    return parent ? "" + parent + "_" + child : child;
  },

  // parent_child
  shallow_prefix: function shallowPrefix(parent, child) {
    return parent ? "" + parent + "_" + child : child;
  },

  // parent/child
  module: function module(parent, child) {
    return parent ? normalizePath("" + parent + "/" + child) : child;
  },

  controller: function controller(parent, child) {
    return child;
  },

  action: function action(parent, child) {
    return child;
  },

  path_names: function pathNames(parent, child) {
    return this.options(parent, child);
  },

  constraints: function constraints(parent, child) {
    return this.options(parent, child);
  },

  defaults: function defaults(parent, child) {
    return this.options(parent, child);
  },

  //blocks(parent, child) { },

  options: function options(parent, child) {
    parent = _core.Object.assign(parent || {});
    var excepts = this.overrideKeys(child);
    for (var _iterator = _core.$for.getIterator(excepts), _step; !(_step = _iterator.next()).done;) {
      var key = _step.value;
      delete parent[key];
    }

    return _core.Object.assign(parent, child);
  },

  shallow: function shallow(parent, child) {
    return child ? true : false;
  },

  overrideKeys: function overrideKeys(child) {
    return child.only || child.except ? ["only", "except"] : [];
  }

};