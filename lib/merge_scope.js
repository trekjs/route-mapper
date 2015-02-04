"use strict";

var _core = require("6to5-runtime/core-js");

var _to5Helpers = require("6to5-runtime/helpers");

var create = _to5Helpers.interopRequire(require("lodash-node/modern/object/create"));

var normalizePath = require("./utils").normalizePath;
module.exports = {

  // parent/child
  path: function path(parent, child) {
    //return normalizePath([parent, child].join('/'));
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  // parent/child
  shallow_path: function shallow_path(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  // parent_child
  as: function as(parent, child) {
    return parent ? `${ parent }_${ child }` : child;
  },

  // parent_child
  shallow_prefix: function shallow_prefix(parent, child) {
    return parent ? `${ parent }_${ child }` : child;
  },

  // parent/child
  module: function module(parent, child) {
    return parent ? normalizePath(`${ parent }/${ child }`) : child;
  },

  controller: function controller(parent, child) {
    return child;
  },

  action: function action(parent, child) {
    return child;
  },

  path_names: function path_names(parent, child) {
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
    parent = _core.Object.assign(parent || create(null));
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