import assign from 'lodash-node/modern/object/assign';
import {normalizePath} from './utils';

export default {

  // parent/child
  path(parent, child) {
    //return normalizePath([parent, child].join('/'));
    return parent ? normalizePath(`${parent}/${child}`) : child;
  },

  // parent/child
  shallow_path(parent, child) {
    return parent ? normalizePath(`${parent}/${child}`) : child;
  },

  // parent_child
  as(parent, child) {
    return parent ? `${parent}_${child}` : child;
  },

  // parent_child
  shallow_prefix(parent, child) {
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

  path_names(parent, child) {
    return this.options(parent, child);
  },

  constraints(parent, child) {
    return this.options(parent, child);
  },

  defaults(parent, child) {
    return this.options(parent, child);
  },

  //blocks(parent, child) { },

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
