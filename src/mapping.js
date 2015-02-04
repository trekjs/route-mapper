import isString from 'lodash-node/modern/lang/isString';
import isRegExp from 'lodash-node/modern/lang/isRegExp';
import compact from 'lodash-node/modern/array/compact';
import debug from 'debug';
import {normalizePath} from './utils';

var debug = debug('route-mapper:mapping');

class Mapping {

  static build(context, set, path, as, options) {
    let contextOptions = context.get('options');
    if (contextOptions) {
      options = Object.assign({}, contextOptions, options);
    }

    delete options.only;
    delete options.except;
    delete options.shallow_path;
    delete options.shallow_prefix;
    delete options.shallow;

    let defaults = Object.assign({}, (context.get('defaults') || {}), options.defaults || {});
    delete options.defaults;

    return new Mapping(context, set, path, defaults, as, options);
  }

  constructor(context, set, path, defaults, as, options) {
    this.requirements = {};
    this.conditions = {};
    this.defaults = defaults;
    this.set = set;

    this.to = options.to;
    this.default_controller = options.controller || context.get('controller');

    this.default_action = options.action || context.get('action');

    this.as = as;
    this.anchor = options.anchor;
    delete options.to;
    delete options.controller;
    delete options.action;
    delete options.anchor;

    let formatted = options.format;
    let via = options.via;
    if (isString(via)) {
      via = [via];
    }
    let optionsConstraints = options.constraints;
    delete options.format;
    delete options.via;
    delete options.constraints;

    path = this.normalizePath(path, formatted);

    if (this.to) {
      let toEndpoint = splitTo(this.to);
      this._controller = toEndpoint[0] || this.default_controller;
      this._action = toEndpoint[1] || this.default_action;
    }
    this._controller = this.addControllerModule(this.controller, context.get('module'));

    this.format = formatted;
    this.via = via;
    this.path = path;
    this.type = context.scopeLevel;

    debug('route: %s %s %s %s %s', this.type, this.as, this.via, this.path, this.controller + '#' + this.action);
  }

  get controller() {
    return this._controller || this.default_controller;
  }
  get action() {
    return this._action || this.default_action;
  }
  get name() {
    return this.as;
  }

  normalizePath(path, format) {
    path = normalizePath(path);
    if (format) {
      return `${path}.:format`
    } else if (this.isOptionalFormat(path, format)) {
      return `${path}.:format?`
    } else {
      return path;
    }
  }

  isOptionalFormat(path, format) {
    return format && !/:format$/.test(path) && !(path[path.length - 1] === '/');
  }

  addControllerModule(controller, modyoule) {
    if (modyoule && !isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else {
        if (/^\//.test(modyoule)) {
          modyoule = modyoule.substr(1);
        }
        return compact([modyoule, controller]).join('/');
      }
    }
    return controller;
  }

  toRoute() {}

}

var splitTo = (to) => {
  if (/#/.test(to)) {
    return to.split('#');
  }
  return [];
}

export default Mapping;
