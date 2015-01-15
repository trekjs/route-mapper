"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _core = _interopRequire(require("core-js/library"));

var hasOwn = require("./utils").hasOwn;


var OPTIONS = ["path", "shallow_path", "as", "shallow_prefix", "module", "controller", "action", "path_names", "constraints", "shallow", /*'blocks',*/"defaults", "options"];

var RESOURCE_SCOPES = ["resource", "resources"];
var RESOURCE_METHOD_SCOPES = ["collection", "member", "new"];

var Context = (function () {
  function Context(hash) {
    var parent = arguments[1] === undefined ? {} : arguments[1];
    var scopeLevel = arguments[2] === undefined ? null : arguments[2];
    this.hash = hash;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  _prototypeProperties(Context, null, {
    options: {
      get: function () {
        return OPTIONS;
      },
      enumerable: true,
      configurable: true
    },
    isNested: {
      value: function isNested() {
        return this.scopeLevel === "nested";
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    isResources: {
      value: function isResources() {
        return this.scopeLevel === "resources";
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    isResourceScope: {
      value: function isResourceScope() {
        return RESOURCE_SCOPES.includes(this.scopeLevel);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    isResourceMethodScope: {
      value: function isResourceMethodScope() {
        return RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    actionName: {
      value: function actionName(namePrefix, prefix, collectionName, memberName) {
        switch (this.scopeLevel) {
          case "nested":
            return [namePrefix, prefix];
          case "collection":
            return [prefix, namePrefix, collectionName];
          case "new":
            return [prefix, "new", namePrefix, memberName];
          case "member":
            return [prefix, namePrefix, memberName];
          case "root":
            return [namePrefix, collectionName, prefix];
          default:
            return [namePrefix, memberName, prefix];
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    get: {

      // maybe should use Proxy
      value: function get(key) {
        var value = arguments[1] === undefined ? null : arguments[1];
        if (hasOwn(this.hash, key)) {
          return this.hash[key];
        }
        if (hasOwn(this.parent, key)) {
          return this.parent[key];
        }
        if (this.parent instanceof Scope) {
          return this.parent.get(key, value);
        }
        return value;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    set: {
      value: function set(key, value) {
        this.hash[key] = value;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    create: {
      value: function create(hash) {
        return new Context(hash, this, this.scopeLevel);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    createLevel: {
      value: function createLevel(level) {
        return new Context(this, this, level);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Context;
})();

module.exports = Context;