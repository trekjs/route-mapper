"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;

var has = _interopRequire(require("lodash-node/modern/object/has"));

/**
 * Options keywords.
 *
 * @const
 * @static
 * @public
 */
const OPTIONS = ["path", "shallowPath", "as", "shallowPrefix", "module", "controller", "action", "pathNames", "shallow", "constraints", "defaults", "options"];

exports.OPTIONS = OPTIONS;
/**
 * Resource Scopes.
 *
 * @const
 * @static
 * @public
 */
const RESOURCE_SCOPES = ["resource", "resources"];

exports.RESOURCE_SCOPES = RESOURCE_SCOPES;
/**
 * Resource Method Scopes.
 *
 * @const
 * @static
 * @public
 */
const RESOURCE_METHOD_SCOPES = ["collection", "member", "new"];

exports.RESOURCE_METHOD_SCOPES = RESOURCE_METHOD_SCOPES;
/**
 * @class Scope
 * @public
 */

let Scope = (function () {
  function Scope(current) {
    let parent = arguments[1] === undefined ? {} : arguments[1];
    let scopeLevel = arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, Scope);

    this.current = current;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  Scope.prototype.actionName = function actionName(namePrefix, prefix, collectionName, memberName) {
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
  };

  Scope.prototype.get = function get(key, value) {
    if (has(this.current, key)) return this.current[key];
    if (has(this.parent, key)) return this.parent[key];
    if (this.parent instanceof Scope) return this.parent.get(key, value);
    return value;
  };

  Scope.prototype.set = function set(key, value) {
    this.current[key] = value;
  };

  Scope.prototype.create = function create(current) {
    return new Scope(current, this, this.scopeLevel);
  };

  Scope.prototype.createLevel = function createLevel(level) {
    return new Scope(this, this, level);
  };

  _createClass(Scope, {
    options: {
      get: function () {
        return OPTIONS;
      }
    },
    isNested: {
      get: function () {
        return this.scopeLevel === "nested";
      }
    },
    isResources: {
      get: function () {
        return this.scopeLevel === "resources";
      }
    },
    isResourceScope: {
      get: function () {
        return RESOURCE_SCOPES.includes(this.scopeLevel);
      }
    },
    isResourceMethodScope: {
      get: function () {
        return RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
      }
    }
  });

  return Scope;
})();

exports["default"] = Scope;