import isNumber from 'lodash-node/modern/lang/isNumber';
import isString from 'lodash-node/modern/lang/isString';
import isRegExp from 'lodash-node/modern/lang/isRegExp';
import isObject from 'lodash-node/modern/lang/isObject';
import compact from 'lodash-node/modern/array/compact';
import assign from 'lodash-node/modern/object/assign';
import originalDebug from 'debug';
import pathToRegexp from 'path-to-regexp';
import {normalizePath as _normalizePath} from './utils';
import {URL_OPTIONS} from './const';

var debug = originalDebug('route-mapper:mapping');

class Mapping {

  static build(context, set, path, as, options) {
    let contextOptions = context.get('options');
    if (contextOptions) {
      options = assign({}, contextOptions, options);
    }

    delete options.only;
    delete options.except;
    delete options.shallow_path;
    delete options.shallow_prefix;
    delete options.shallow;

    let defaults = assign({}, (context.get('defaults') || {}), options.defaults || {});
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

    this.format = formatted;
    this.via = via;
    this.pathWithForamt = path;
    this.path = path.replace(/\.:format\??$/, '');
    this.type = context.scopeLevel;

    let ast = pathToRegexp(path);
    let pathParams = ast.keys;

    options = this.normalizeOptions(options, formatted, pathParams, ast, context.get('module'));

    let contextConstraints = context.get('constraints');
    if (contextConstraints) {
      this.splitConstraints(ast.keys, contextConstraints);
    }

    let constraints = this.constraints(options, pathParams);

    this.splitConstraints(pathParams, constraints);

    if (isObject(optionsConstraints)) {
      this.splitConstraints(pathParams, optionsConstraints);
      for (let k of Object.keys(optionsConstraints)) {
        let v = optionsConstraints[k];
        if (URL_OPTIONS.includes(k) && (isString(v) || isNumber(v))) {
          this.defaults[k] ?= v;
        }
      }
    }

    this.normalizeFormat(formatted);

    this.conditions.pathInfo = path;
    this.conditions.parsedPathInfo = ast;

    this.addRequestMethod(this.via, this.conditions);
    this.normalizeDefaults(options);

    debug('route: %s %s %s %s %s', this.type, this.as, this.via, this.pathWithForamt, this.controller + '#' + this.action);
  }

  get controller() {
    return this._controller || this.default_controller || ':controller';
  }
  get action() {
    return this._action || this.default_action || ':action';
  }
  get name() {
    return this.as;
  }

  splitConstraints(pathParams, constraints) {
    Object.keys(constraints).forEach(k => {
      let v = constraints[k];
      if (pathParams.filter(p => {
        return p.name === k;
      }).length || k === 'controller') {
        this.requirements[k] = v;
      } else {
        this.conditions[k] = v;
      }
    });
  }

  constraints(options, pathParams) {
    let constraints = {};
    let requiredDefaults = [];
    Object.keys(options).forEach(k => {
      let v = options[k];
      if (isRegExp(v)) {
        constraints[k] = v;
      } else {
        if (!pathParams.filter(p => { return p.name === k }).length) {
          requiredDefaults.push(k);
        }
      }
    });
    this.conditions.requiredDefaults = requiredDefaults;
    return constraints;
  }

  normalizeOptions(options, formatted, pathParams, pathAst, modyoule) {
    if (pathParams.filter(p => { return p.name === 'controller' }).length) {
      if (modyoule) {
        throw new Error(`'controller' segment is not allowed within a namespace block`);
      }
      options.controller ?= /.+?/;
    }

    if (this.to) {
      let toEndpoint = splitTo(this.to);
      this._controller = toEndpoint[0] || this.default_controller;
      this._action = toEndpoint[1] || this.default_action;
      this._controller = this.addControllerModule(this.controller, modyoule);
      options = assign(options, this.checkControllerAndAction(pathParams, this.controller, this.action));
    }
    return options;
  }

  addRequestMethod(via, conditions) {
    if (via[0] === 'all') return;
    if (!via.length) {
      throw new Error(
        `You should not use the \`match\` method in your router without specifying an HTTP method.\n \
        If you want to expose your action to both GET and POST, add \`via: ['get', 'post']\` option.\n \
        If you want to expose your action to GET, use \`get\` in the router:\n \
          Instead of: match "controller#action"\n \
          Do: get "controller#action`
      );
    }
    conditions.requestMethod = via.map(m => { return m.replace(/_/g, '-') });
  }

  normalizeFormat(formatted) {
    if (formatted === true) {
      this.requirements.format ?= /.+/;
    } else if (isRegExp(formatted)) {
      this.requirements.format = formatted;
      this.defaults.format = null;
    } else if (isString(formatted)) {
      this.requirements.format = new RegExp(formatted);
      this.defaults.format = formatted;
    }
  }

  normalizePath(path, format) {
    path = _normalizePath(path);
    if (format === true) {
      return `${path}.:format`
    } else if (this.isOptionalFormat(path, format)) {
      return `${path}.:format?`
    } else {
      return path;
    }
  }

  isOptionalFormat(path, format) {
    return format !== false && !/:format\??$/.test(path) && !(path[path.length - 1] === '/');
  }

  normalizeDefaults(options) {
    Object.keys(options).forEach(k => {
      let v = options[k];
      if (!isRegExp(v)) {
        this.defaults[k] = v;
      }
    });
  }

  checkControllerAndAction(pathParams, controller, action) {
    let hash = this.checkPart('controller', controller, pathParams, {}, (part) => {
      if (isRegExp(part)) return part;
      if (/^[a-z_0-9][a-z_0-9\/]*$/i.exec(part)) return part;
      throw new Error(`'${part}' is not a supported controller name. This can lead to potential routing problems.`);
    });
    this.checkPart('action', action, pathParams, hash, (part) => {
      return part;
    });
    return hash;
  }

  checkPart(name, part, pathParams, hash, cb) {
    if (part) {
      hash[name] = cb(part);
    } else {
      if (!pathParams.filter(p => { return p.name === name }).length) {
        throw new Error(`Missing :${name} key on routes definition, please check your routes.`);
      }
    }
    return hash;
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

  toRoute() {
    return [/*app, */this.conditions, this.requirements, this.defaults, this.as, this.anchor];
  }

}

var splitTo = (to) => {
  if (/#/.test(to)) {
    return to.split('#');
  }
  return [];
}

export default Mapping;
