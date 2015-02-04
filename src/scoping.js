import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import has from 'lodash-node/modern/object/has';
import create from 'lodash-node/modern/object/create';
import compact from 'lodash-node/modern/array/compact';
import {buildArgs} from './utils';
import {URL_OPTIONS} from './const';
import mergeScope from './merge_scope';

class Scoping {

  scope(...args) {
    let [paths, options, cb] = buildArgs(...args);
    let scope = create(null);

    paths = compact(paths);
    if (paths.length) {
      options.path = paths.join('/');
    }
    options.constraints ?= create(null);

    if (!this.isNestedScope()) {
      if(has(options, 'path')) {
        options.shallow_path ?= options.path;
      }
      if(has(options, 'as')) {
        options.shallow_prefix ?= options.as;
      }
    }

    if (isObject(options.constraints)) {
      let defaults = create(null);
      for (let k of Object.keys(options.constraints)) {
        if (URL_OPTIONS.includes(k)) {
          defaults[k] = options.constraints[k];
        }
      }
      options.defaults = Object.assign(defaults, options.defaults || create(null));
    } else {
      //block = options.constraints;
      options.constraints = create(null);
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

  controller(controller, options = create(null), cb) {
    if (isFunction(options)) {
      cb = options;
      options = create(null);
    }
    options.controller = controller;
    return this.scope(options, cb);
  }

  constraints(constraints = create(null), cb) {
    return this.scope(create({ constraints: constraints }), cb);
  }

  namespace(...args) {
    return namespace.apply(this, args);
  }

  defaults(defaults = create(null), cb) {
    return this.scope(create({ defaults: defaults }), cb);
  }
}

export var namespace = function(path, options = create(null), cb) {
  path = String(path);
  let defaults = create({
    module:         path,
    path:           options.path || path,
    as:             options.as || path,
    shallow_path:   options.path || path,
    shallow_prefix: options.as || path
  });
  Object.assign(defaults, options);
  return this.scope(defaults, cb);
}

export default Scoping;
