"use strict";

var _core = require("6to5-runtime/core-js");

var _to5Helpers = require("6to5-runtime/helpers");

var Base = _to5Helpers.interopRequire(require("./base"));

var HttpHelpers = _to5Helpers.interopRequire(require("./http_helpers"));

var Scoping = _to5Helpers.interopRequire(require("./scoping"));

var Concerns = _to5Helpers.interopRequire(require("./concerns"));

var Resources = _to5Helpers.interopRequire(require("./resources"));

var Scope = _to5Helpers.interopRequire(require("./scope"));

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

_core.Object.define(proto, Base.prototype);
_core.Object.define(proto, HttpHelpers.prototype);
_core.Object.define(proto, Scoping.prototype);
_core.Object.define(proto, Concerns.prototype);
_core.Object.define(proto, Resources.prototype);

module.exports = Mapper;