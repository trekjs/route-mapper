"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var Base = _interopRequire(require("./base"));

var HttpHelpers = _interopRequire(require("./http_helpers"));

var Scoping = _interopRequire(require("./scoping"));

var Concerns = _interopRequire(require("./concerns"));

var Resources = _interopRequire(require("./resources"));

var Scope = _interopRequire(require("./scope"));

var Mapper = function Mapper(set) {
  this.set = set;
  // scope context
  this.context = new Scope({
    path_names: this.set.resourcesPathNames
  });
  this._concerns = {};
  this.nesting = [];
};

var proto = Mapper.prototype;

_core.Object.assign(proto, Base.prototype);
_core.Object.assign(proto, HttpHelpers.prototype);
_core.Object.assign(proto, Scoping.prototype);
_core.Object.assign(proto, Concerns.prototype);
_core.Object.assign(proto, Resources.prototype);

module.exports = Mapper;