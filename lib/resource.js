"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _hasOwn = Object.prototype.hasOwnProperty;
var _core = _interopRequire(require("core-js/library"));

var isString = _interopRequire(require("lodash-node/modern/lang/isString"));

var ACTIONS = require("actions").ACTIONS;
var plural = require("pluralize").plural;
var singular = require("pluralize").singular;
var Resource = (function () {
  function Resource(entities, options) {
    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || "id";
    this.options = options;
    this.shallow = false;
  }

  _prototypeProperties(Resource, null, {
    defaultActions: {
      get: function () {
        return ACTIONS;
      },
      enumerable: true,
      configurable: true
    },
    actions: {
      get: function () {
        var only = this.options.only;
        var except = this.options.except;
        if (isString(only)) only = [only];
        if (isString(except)) except = [except];
        if (only && only.length) return only;else if (except && except.length) {
          return this.defaultActions.filter(function (a) {
            return except.indexOf(a) < 0;
          });
        }
        return this.defaultActions;
      },
      enumerable: true,
      configurable: true
    },
    name: {
      get: function () {
        return this.as || this._name;
      },
      enumerable: true,
      configurable: true
    },
    plural: {
      get: function () {
        var _ref;
        return (_ref = this, !_hasOwn.call(_ref, "_plural") && (_ref._plural = this.name), _ref._plural);
      },
      enumerable: true,
      configurable: true
    },
    singular: {
      get: function () {
        var _ref2;
        return (_ref2 = this, !_hasOwn.call(_ref2, "_singular") && (_ref2._singular = singular(this.name)), _ref2._singular);
      },
      enumerable: true,
      configurable: true
    },
    memberName: {
      get: function () {
        return this.singular;
      },
      enumerable: true,
      configurable: true
    },
    collectionName: {
      get: function () {
        return this.singular === this.plural ? "" + this.plural + "_index" : this.plural;
      },
      enumerable: true,
      configurable: true
    },
    resourceScope: {
      get: function () {
        return { controller: this.controller };
      },
      enumerable: true,
      configurable: true
    },
    collectionScope: {
      get: function () {
        return this.path;
      },
      enumerable: true,
      configurable: true
    },
    memberScope: {
      get: function () {
        return "" + this.path + "/:" + this.param;
      },
      enumerable: true,
      configurable: true
    },
    shallowScope: {
      get: function () {
        return this.memberScope;
      },
      enumerable: true,
      configurable: true
    },
    nestedParam: {
      get: function () {
        //return (this.param && this.param !== 'id') ? this.param : this.singular + '_' + this.param;
        return "" + this.singular + "_" + this.param;
      },
      enumerable: true,
      configurable: true
    },
    nestedScope: {
      get: function () {
        return "" + this.path + "/:" + this.nestedParam;
      },
      enumerable: true,
      configurable: true
    },
    newScope: {
      value: function newScope(newPath) {
        return "" + this.path + "/" + newPath;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    isShallow: {
      value: function isShallow() {
        return this.shallow;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Resource;
})();

module.exports = Resource;