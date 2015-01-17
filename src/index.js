import Mapper from './mapper';
import RouteSet from './route_set';
//import UrlFor from './url_for';

export let Mapper = Mapper;
export let RouteSet = RouteSet;
//export let UrlFor = UrlFor;
export let HTTP_METHODS = ['get', 'head', 'post', 'patch', 'put', 'delete', 'options'];

class RouteMapper extends RouteSet {

  constructor() {
    if (!(this instanceof RouteMapper)) {
      return new RouteMapper();
    }
    super();
  }
}

export default RouteMapper;