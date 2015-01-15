import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import {buildArgs, compact, normalizePath, flatten, hasOwn} from './utils';
import mergeScope from './merge_scope';

const URL_OPTIONS = ['protocol', 'subdomain', 'domain', 'host', 'port'];

class Scoping {

  scope(...args) {
    let [paths, options, cb] = buildArgs(...args);
    let scope = {};

    paths = compact(paths);
    if (paths.length) {
      options.path = paths.join('/');
    }
    options.constraints ?= {};

    if (!this.isNestedScope()) {
      if(hasOwn(options, 'path')) {
        options.shallow_path ?= options.path;
      }
      if(hasOwn(options, 'as')) {
        options.shallow_prefix ?= options.as;
      }
    }

    if (isObject(options.constraints)) {
      let defaults = {};
      for (let k of Object.keys(options.constraints)) {
        if (URL_OPTIONS.includes(k)) {
          defaults[k] = options.constraints[k];
        }
      }
      options.defaults = Object.assign(defaults, options.defaults || {});
    } else {
      //block = options.constraints;
      options.constraints = {};
    }

    this.context.options.forEach((option) => {
      let value;
      if (option === 'options') {
        value = options;
      } else {
        value = options[option];
        delete options[option];
      }

      if (value) {
        scope[option] = mergeScope[option](this.context.get(option), value);
      }
    });

    // begin, new
    this.context = this.context.create(scope);

    if (isFunction(cb)) {
      cb.call(this);
    }

    // end, reroll
    this.context = this.context.parent;

    return this;
  }

  controller(controller, options = {}, cb) {
    if (isFunction(options)) {
      cb = options;
      options = {};
    }
    options.controller = controller;
    return this.scope(options, cb);
  }

  namespace(...args) {
    return namespace.apply(this, args);
  }

  defaults(defaults = {}, cb) {
    return this.scope({ defaults: defaults }, cb);
  }
}

export var namespace = function(path, options = {}, cb) {
  path = String(path);
  let defaults = {
    module:         path,
    path:           options.path || path,
    as:             options.as || path,
    shallow_path:   options.path || path,
    shallow_prefix: options.as || path
  };
  Object.assign(defaults, options);
  return this.scope(defaults, cb);
}

export default Scoping;
