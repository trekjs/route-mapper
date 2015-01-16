import Mapper from './mapper';
import RouteSet from './route_set';

export let Mapper = Mapper;
export let RouteSet = RouteSet;
export let HTTP_METHODS = ['get', 'head', 'post', 'patch', 'put', 'delete', 'options'];

class RouteMapper {

  constructor() {
    if (!(this instanceof RouteMapper)) {
      return new RouteMapper();
    }
  }

}

export default RouteMapper;