"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var has = _interopRequire(require("lodash-node/modern/object/has"));

var SINGLETON_ACTIONS = require("actions").SINGLETON_ACTIONS;

var plural = require("pluralize").plural;

var Resource = _interopRequire(require("./resource"));

let SingletonResource = (function (_Resource) {
  function SingletonResource(entities, options) {
    _classCallCheck(this, SingletonResource);

    _Resource.call(this, entities, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  _inherits(SingletonResource, _Resource);

  _createClass(SingletonResource, {
    defaultActions: {
      get: function () {
        return SINGLETON_ACTIONS;
      }
    },
    plural: {
      get: function () {
        if (!has(this, "_plural")) this._plural = plural(this.name);
        return this._plural;
        //return  this._plural ?= plural(this.name);
      }
    },
    singular: {
      get: function () {
        if (!has(this, "_singular")) this._singular = this.name;
        return this._singular;
        //return this._singular ?= this.name;
      }
    },
    memberName: {
      get: function () {
        return this.singular;
      }
    },
    collectionName: {
      get: function () {
        return this.singular;
      }
    },
    memberScope: {
      get: function () {
        return this.path;
      }
    },
    nestedScope: {
      get: function () {
        return this.path;
      }
    }
  });

  return SingletonResource;
})(Resource);

module.exports = SingletonResource;