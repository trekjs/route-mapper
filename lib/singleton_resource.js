"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = _core.Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = _core.Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _hasOwn = Object.prototype.hasOwnProperty;
var _core = _interopRequire(require("core-js/library"));

var SINGLETON_ACTIONS = require("actions").SINGLETON_ACTIONS;
var plural = require("pluralize").plural;
var Resource = _interopRequire(require("./resource"));

var SingletonResource = (function (Resource) {
  function SingletonResource(entities, options) {
    _get(_core.Object.getPrototypeOf(SingletonResource.prototype), "constructor", this).call(this, entities, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  _inherits(SingletonResource, Resource);

  _prototypeProperties(SingletonResource, null, {
    defaultActions: {
      get: function () {
        return SINGLETON_ACTIONS;
      },
      enumerable: true,
      configurable: true
    },
    plural: {
      get: function () {
        var _ref;
        return (_ref = this, !_hasOwn.call(_ref, "_plural") && (_ref._plural = plural(this.name)), _ref._plural);
      },
      enumerable: true,
      configurable: true
    },
    singular: {
      get: function () {
        var _ref2;
        return (_ref2 = this, !_hasOwn.call(_ref2, "_singular") && (_ref2._singular = this.name), _ref2._singular);
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
        return this.singular;
      },
      enumerable: true,
      configurable: true
    },
    memberScope: {
      get: function () {
        return this.path;
      },
      enumerable: true,
      configurable: true
    },
    nestedScope: {
      get: function () {
        return this.path;
      },
      enumerable: true,
      configurable: true
    }
  });

  return SingletonResource;
})(Resource);

module.exports = SingletonResource;