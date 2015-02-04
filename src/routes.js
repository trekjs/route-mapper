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

  addRoute(mapping) {
    let name = mapping.name;
    let route = mapping;
    //let route = new Route(mapping);
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
      if (genPath.params) {
        let path = genPath.path;
        args = args.slice(0, genPath.params.length);
        args.forEach((a, i) => {
          path = path.replace(genPath.params[i], a);
        });
        return path;
      }
      return genPath.path;
    };
    genPath.path = route.path;
    genPath.params = genPath.path.match(/:[a-zA-Z0-9_\*\?]+/g);
    return genPath;
  }

}

export default Routes;
