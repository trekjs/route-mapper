/*!
 * route-mapper - Scope
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Options keywords.
 *
 * @const
 * @static
 * @public
 */
const OPTIONS = ['path', 'as', 'module', 'controller', 'action', 'pathNames', 'options'];

exports.OPTIONS = OPTIONS;
const RESOURCE_SCOPES = ['resource', 'resources'];

const RESOURCE_METHOD_SCOPES = ['collection', 'member', 'new'];

/**
 * Scope
 */

let Scope = (function () {

  /**
   * @param {Object} current    - The current scope
   * @param {Object} parent     - The parent scope
   * @param {String} scopeLevel - The scope level
   */

  function Scope(current) {
    let parent = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    let scopeLevel = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

    _classCallCheck(this, Scope);

    this.current = current;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  Scope.prototype.actionName = function actionName(namePrefix, prefix, collectionName, memberName) {
    switch (this.scopeLevel) {
      case 'nested':
        return [namePrefix, prefix];
      case 'collection':
        return [prefix, namePrefix, collectionName];
      case 'new':
        return [prefix, 'new', namePrefix, memberName];
      case 'member':
        return [prefix, namePrefix, memberName];
      case 'root':
        return [namePrefix, collectionName, prefix];
      default:
        return [namePrefix, memberName, prefix];
    }
  };

  Scope.prototype.get = function get(key, value) {
    if (_lodash2['default'].has(this.current, key)) return this.current[key];
    if (_lodash2['default'].has(this.parent, key)) return this.parent[key];
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

  _createClass(Scope, [{
    key: 'options',
    get: function get() {
      return OPTIONS;
    }
  }, {
    key: 'isNested',
    get: function get() {
      return this.scopeLevel === 'nested';
    }
  }, {
    key: 'isResources',
    get: function get() {
      return this.scopeLevel === 'resources';
    }
  }, {
    key: 'isResourceScope',
    get: function get() {
      return RESOURCE_SCOPES.includes(this.scopeLevel);
    }
  }, {
    key: 'isResourceMethodScope',
    get: function get() {
      return RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
    }
  }]);

  return Scope;
})();

exports['default'] = Scope;