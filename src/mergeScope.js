/*!
 * route-mapper - mergeScope
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import assign from 'lodash-node/modern/object/assign';
import { normalizePath } from './utils';

export default {

  // parent/child
  path(parent, child) {
    return parent ? normalizePath(`${parent}/${child}`) : child;
  },

  // parent/child
  shallowPath(parent, child) {
    return parent ? normalizePath(`${parent}/${child}`) : child;
  },

  // parent_child
  as(parent, child) {
    return parent ? `${parent}_${child}` : child;
  },

  // parent_child
  shallowPrefix(parent, child) {
    return parent ? `${parent}_${child}` : child;
  },

  // parent/child
  module(parent, child) {
    return parent ? normalizePath(`${parent}/${child}`) : child;
  },

  controller(parent, child) {
    return child;
  },

  action(parent, child) {
    return child;
  },

  pathNames(parent, child) {
    return this.options(parent, child);
  },

  constraints(parent, child) {
    return this.options(parent, child);
  },

  defaults(parent, child) {
    return this.options(parent, child);
  },

  options(parent, child) {
    parent = assign(parent || {});
    let excepts = this.overrideKeys(child);
    for (let key of excepts) {
      delete parent[key];
    }
    return assign(parent, child);
  },

  shallow(parent, child) {
    return child ? true : false;
  },

  overrideKeys(child) {
    return (child.only || child.except) ? ['only', 'except'] : [];
  }

};
