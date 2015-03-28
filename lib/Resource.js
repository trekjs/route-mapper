/*!
 * route-mapper - lib/Resource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var has = _interopRequire(require("lodash-node/modern/object/has"));

var isString = _interopRequire(require("lodash-node/modern/lang/isString"));

var camelCase = _interopRequire(require("lodash-node/modern/string/camelCase"));

var pluralize = _interopRequire(require("pluralize"));

var ACTIONS = require("actions").ACTIONS;

/**
 * Resource
 *
 * @class
 */

let Resource = (function () {

  /**
   * @constructor
   * @param {String} entities       - The resource name
   * @param {Object} options        - Defaults to empby object
   * @param {Boolean} [camelCase]   - Defaults to true
   */

  function Resource(entities) {
    let options = arguments[1] === undefined ? Object.create(null) : arguments[1];
    let camelCase = arguments[2] === undefined ? true : arguments[2];

    _classCallCheck(this, Resource);

    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || "id";
    this.shallow = false;
    this.options = options;
    this.camelCase = camelCase;
  }

  Resource.prototype.newScope = function newScope(newPath) {
    return `${ this.path }/${ newPath }`;
  };

  _createClass(Resource, {
    defaultActions: {
      get: function () {
        return ACTIONS;
      }
    },
    actions: {
      get: function () {
        let only = this.options.only;
        let except = this.options.except;
        if (isString(only)) only = [only];
        if (isString(except)) except = [except];
        if (only && only.length) {
          return only;
        } else if (except && except.length) {
          return this.defaultActions.filter(function (a) {
            return except.indexOf(a) < 0;
          });
        }
        return this.defaultActions;
      }
    },
    name: {
      get: function () {
        return isString(this.as) ? this.as : this._name;
      }
    },
    plural: {
      get: function () {
        if (!has(this, "_plural")) this._plural = pluralize.plural(this.name);
        return this._plural;
      }
    },
    singular: {
      get: function () {
        if (!has(this, "_singular")) this._singular = pluralize.singular(this.name);
        return this._singular;
      }
    },
    memberName: {
      get: function () {
        return this.singular;
      }
    },
    collectionName: {
      get: function () {
        let name = "";
        if (!this.plural) {
          name = "index";
        } else if (this.singular === this.plural) {
          name = `${ this.plural }_index`;
        } else {
          name = this.plural;
        }
        return this.camelCase ? camelCase(name) : name;
      }
    },
    resourceScope: {
      get: function () {
        return {
          controller: this.controller
        };
      }
    },
    collectionScope: {
      get: function () {
        return this.path;
      }
    },
    memberScope: {
      get: function () {
        return `${ this.path }/:${ this.param }`;
      }
    },
    shallowScope: {
      get: function () {
        return this.memberScope;
      }
    },
    nestedParam: {
      get: function () {
        let param = this.param !== "id" ? this.param : this.singular + "_" + this.param;
        return this.camelCase ? camelCase(param) : param;
      }
    },
    nestedScope: {
      get: function () {
        return `${ this.path }/:${ this.nestedParam }`;
      }
    },
    isShallow: {
      get: function () {
        return this.shallow;
      }
    }
  });

  return Resource;
})();

module.exports = Resource;