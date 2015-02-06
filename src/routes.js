import has from 'lodash-node/modern/object/has';
import Route from './route';

class Routes {

  constructor() {
    this.routes = [];
    this.namedRoutes = {};

    this.pathHelpers = {};
    //this.urlHelpers = new WeakMap();
  }

  get length() {
    return this.routes.length;
  }

  get size() {
    return this.length;
  }

  each(cb) {
    this.routes.forEach(cb);
  }

  clear() {
    this.routes.length = 0;
    this.namedRoutes = {};
    this.pathHelpers = {};
    //this.urlHelpers.clear();
  }

  // mapping
  addRoute(route) {
    let name = route.name;
    //let route = new Route(route);
    this.routes.push(route);
    if (name && !has(this.namedRoutes, name)) {
      let pathName = `${name}_path`;
      this.pathHelpers[pathName] = this._generatePath(name, route);
      //this.urlHelpers.add(urlName);
      this.namedRoutes[name] = route;
    }
    return route;
  }

  _generatePath(name, route) {
    let genPath = (...args) => {
      let path = genPath.path;
      let params = genPath.ast.keys;
      if (params && params.length) {
        args = args.slice(0, params.length);
        args.forEach((a, i) => {
          //path = path.replace(new RegExp(':' + params[i].name + ''), a || '');
          path = path.replace(/:[a-zA-Z0-9_\*\?]+/, a || '');
        });
        return path;
      }
      return genPath.path;
    };
    genPath.path = route.path;
    genPath.ast = route.ast;
    return genPath;
  }

}

export default Routes;
