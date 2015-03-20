"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var has = _interopRequire(require("lodash-node/modern/object/has"));

var isString = _interopRequire(require("lodash-node/modern/lang/isString"));

var _pluralize = require("pluralize");

var plural = _pluralize.plural;
var singular = _pluralize.singular;

var ACTIONS = require("actions").ACTIONS;

let Resource = (function () {
  function Resource(entities, options) {
    _classCallCheck(this, Resource);

    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || "id";
    this.options = options;
    this.shallow = false;
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
        if (!has(this, "_plural")) this._plural = plural(this.name);
        return this._plural;
        //return this._plural ? = plural(this.name);
      }
    },
    singular: {
      get: function () {
        if (!has(this, "_singular")) this._singular = singular(this.name);
        return this._singular;
        //return this._singular ? = singular(this.name);
      }
    },
    memberName: {
      get: function () {
        return this.singular;
      }
    },
    collectionName: {
      get: function () {
        if (!this.plural) {
          return "index";
        } else if (this.singular === this.plural) {
          return `${ this.plural }_index`;
        } else {
          return this.plural;
        }
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
        return this.param !== "id" ? this.param : this.singular + "_" + this.param;
        //return this.param !== 'id' ? this.param : this.singular + '_' + this.param;
        //return `${this.singular}_${this.param}`;
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