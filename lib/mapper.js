"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Base = _babelHelpers.interopRequire(require("./base"));

var HttpHelpers = _babelHelpers.interopRequire(require("./http_helpers"));

var Scoping = _babelHelpers.interopRequire(require("./scoping"));

var Concerns = _babelHelpers.interopRequire(require("./concerns"));

var Resources = _babelHelpers.interopRequire(require("./resources"));

var Scope = _babelHelpers.interopRequire(require("./scope"));

var Mapper = function Mapper(set) {
  _babelHelpers.classCallCheck(this, Mapper);

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