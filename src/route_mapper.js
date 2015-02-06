import noop from 'lodash-node/modern/utility/noop';
import isRegExp from 'lodash-node/modern/lang/isRegExp';
import isFunction from 'lodash-node/modern/lang/isFunction';
import escape from 'lodash-node/modern/string/escape';
import pathToRegexp from 'path-to-regexp';
import Mapper from './mapper';
import Routes from './routes';
import {DEFAULT_RESOURCES_PATH_NAMES} from './const';

class RouteMapper {

  constructor(options = {}) {
    if (!(this instanceof RouteMapper)) {
      return new RouteMapper(options);
    }

    this._routes = new Routes();
    this.resourcesPathNames = DEFAULT_RESOURCES_PATH_NAMES;
  }

  get routes() {
    return this._routes.routes;
  }

  get namedRoutes() {
    return this._routes.namedRoutes;
  }

  get pathHelpers() {
    return this._routes.pathHelpers;
  }

  get urlHelpers() {
    return this._routes.urlHelpers;
  }

  clear() {
    this._routes.clear();
  }

  draw(cb = noop) {
    let mapper = new Mapper(this);
    if (isFunction(cb)) {
      cb.call(mapper, mapper);
    }
  }

  addRoute(mapping) {
    let name = mapping.name;

    if (name && !name.match(/^[_a-z]\w*$/i)) {
      throw new Error(`Invalid route name: '${name}'`);
    }

    if (name && this.namedRoutes[name]) {
      throw new Error(`Invalid route name, already in use: '${name}'`);
    }

    let requirements = mapping.requirements;
    let defaults = mapping.defaults;
    let anchor = mapping.anchor;
    let conditions = mapping.conditions;
    let path = conditions.pathInfo;
    let ast = conditions.parsedPathInfo;
    mapping.ast = this.buildPath(path, ast, requirements, anchor);

    //conditions = this.buildConditions(conditions, ast.keys);
    // let route = this._routes.addRoute(/*app, */ast, conditions, defaults, name);
    let route = this._routes.addRoute(mapping);
    return route;
  }

  buildPath(path, ast, requirements, anchor) {
    ast.keys.forEach(p => {
      let k = p.name;
      if (!new RegExp(':' + k + '\\(').exec(path)) {
        let v = requirements[k] || /[^\.\/\?]+/;
        path = path.replace(':' + k, ':' + k + '(' + (isRegExp(v) ? escape(v.source) : v) + ')');
      }
    });

    // rebuild
    ast = pathToRegexp(path);
    return ast;
  }

  buildConditions(conditions, pathValues) {
    let verbs = conditions.requestMethod || [];
    if (verbs.length) {
      conditions.requestMethod = new RegExp('^' + verbs.join('|') + '$');
    }
    let keys = Object.keys(conditions).filter(k => {
      return k === 'action' || k === 'controller' || k === 'requiredDefaults'
        || pathValues.filter(pk => {
          return pk.name === k;
        }).length;
    });
    let o = {};
    keys.forEach(k => {
      o[k] = conditions[k];
    });
    return o;
  }

}

export default RouteMapper;
