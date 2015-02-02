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

var proto = Mapper.prototype;

Object.define(proto, Base.prototype);
Object.define(proto, HttpHelpers.prototype);
Object.define(proto, Scoping.prototype);
Object.define(proto, Concerns.prototype);
Object.define(proto, Resources.prototype);

export default Mapper;
