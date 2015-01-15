import Base from './base';
import HttpHelpers from './http_helpers';
import Scoping from './scoping';
import Concerns from './concerns';
import Resources from './resources';
import Scope from './scope';

class Mapper {
  constructor(set) {
    this.set = set;
    // scope context
    this.context = new Scope({
      path_names: this.set.resourcesPathNames
    });
    this._concerns = {};
    this.nesting = [];
  }
}

let proto = Mapper.prototype;

Object.assign(proto, Base.prototype);
Object.assign(proto, HttpHelpers.prototype);
Object.assign(proto, Scoping.prototype);
Object.assign(proto, Concerns.prototype);
Object.assign(proto, Resources.prototype);

export default Mapper;
