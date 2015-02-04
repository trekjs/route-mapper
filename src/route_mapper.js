import noop from 'lodash-node/modern/utility/noop';
import isFunction from 'lodash-node/modern/lang/isFunction';
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
    this._routes.addRoute(mapping);
  }

}

export default RouteMapper;
