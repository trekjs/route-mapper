"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var isString = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isString"));

var ACTIONS = require("actions").ACTIONS;
var _pluralize = require("pluralize");

var plural = _pluralize.plural;
var singular = _pluralize.singular;
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

  _to5Helpers.prototypeProperties(Resource, null, {
    defaultActions: {
      get: function () {
        return ACTIONS;
      },
      configurable: true
    },
    actions: {
      get: function () {
        var only = this.options.only;
        var except = this.options.except;
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
      },
      configurable: true
    },
    name: {
      get: function () {
        //return this.as || this._name;
        return isString(this.as) ? this.as : this._name;
      },
      configurable: true
    },
    plural: {
      get: function () {
        var _ref;
        return (_ref = this, !_to5Helpers.hasOwn.call(_ref, "_plural") && (_ref._plural = this.name), _ref._plural);
      },
      configurable: true
    },
    singular: {
      get: function () {
        var _ref;
        return (_ref = this, !_to5Helpers.hasOwn.call(_ref, "_singular") && (_ref._singular = singular(this.name)), _ref._singular);
      },
      configurable: true
    },
    memberName: {
      get: function () {
        return this.singular;
      },
      configurable: true
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
        //return this.plural this.singular === this.plural ? `${this.plural}_index` : this.plural;
      },
      configurable: true
    },
    resourceScope: {
      get: function () {
        return { controller: this.controller };
      },
      configurable: true
    },
    collectionScope: {
      get: function () {
        return this.path;
      },
      configurable: true
    },
    memberScope: {
      get: function () {
        return `${ this.path }/:${ this.param }`;
      },
      configurable: true
    },
    shallowScope: {
      get: function () {
        return this.memberScope;
      },
      configurable: true
    },
    nestedParam: {
      get: function () {
        //return (this.param && this.param !== 'id') ? this.param : this.singular + '_' + this.param;
        return `${ this.singular }_${ this.param }`;
      },
      configurable: true
    },
    nestedScope: {
      get: function () {
        return `${ this.path }/:${ this.nestedParam }`;
      },
      configurable: true
    },
    newScope: {
      value: function newScope(newPath) {
        return `${ this.path }/${ newPath }`;
      },
      writable: true,
      configurable: true
    },
    isShallow: {
      value: function isShallow() {
        return this.shallow;
      },
      writable: true,
      configurable: true
    }
  });

  return Resource;
})();

module.exports = Resource;