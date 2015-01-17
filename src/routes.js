class Routes {

  constructor() {
    this.routes = [];
    this.namedRoutes = {};
    this.urlHelpers = {};
  }

  get length() {
    return this.routes.length;
  }

  each(cb) {
    this.routes.forEach(cb);
  }

  clear() {
    this.routes.length = 0;
    this.namedRoutes = {};
  }

  addRoute(route) {
    this.routes.push(route);
    if (route.name && !this.namedRoutes[route.name]) {
      this.namedRoutes[route.name] = route;
      let urlPath = (...args) => {
        if (urlPath.params) {
          let path = urlPath.path;
          args = args.slice(0, urlPath.params.length);
          args.forEach((a, i) => {
            path = path.replace(urlPath.params[i], a);
          });
          return path;
        }
        return urlPath.path;
      };
      urlPath.path = route.path;
      urlPath.params = urlPath.path.match(/:[a-zA-Z0-9_\*\?]+/g);
      this.urlHelpers[route.name + '_path'] =  urlPath;
    }
  }

}

export default Routes;
