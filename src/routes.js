class Routes {

  constructor() {
    this.routes = [];
    this.namedRoutes = {};
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
    if (!this.namedRoutes[route.as + route.via]) {
      this.namedRoutes[route.as + route.via] = route;
    }
  }

}

export default Routes;
