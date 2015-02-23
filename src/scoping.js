import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import has from 'lodash-node/modern/object/has';
import compact from 'lodash-node/modern/array/compact';
import assign from 'lodash-node/modern/object/assign';
import {buildArgs} from './utils';
import {URL_OPTIONS} from './const';
import mergeScope from './merge_scope';

class Scoping {

  scope(...args) {
    let [paths, options, cb] = buildArgs.apply(undefined, args);
    let scope = {};

    paths = compact(paths);
    if (paths.length) {
      options.path = paths.join('/');
    }
    options.constraints ?= {};

    if (!this.isNestedScope()) {
      if(has(options, 'path')) {
        options.shallow_path ?= options.path;
      }
      if(has(options, 'as')) {
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
      options.defaults = assign(defaults, options.defaults || {});
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

    if (isFunction(cb)) {
      // begin, new
      this.context = this.context.create(scope);

      cb.call(this);

      // end, reroll
      this.context = this.context.parent;
    }

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

  constraints(constraints = {}, cb) {
    return this.scope({ constraints: constraints }, cb);
  }

  namespace(...args) {
    return _namespace.apply(this, args);
  }

  defaults(defaults = {}, cb) {
    return this.scope({ defaults: defaults }, cb);
  }
}

export function _namespace (path, options = {}, cb) {
  path = String(path);
  let defaults = {
    module:         path,
    path:           options.path || path,
    as:             options.as || path,
    shallow_path:   options.path || path,
    shallow_prefix: options.as || path
  };
  assign(defaults, options);
  return this.scope(defaults, cb);
}

export default Scoping;
