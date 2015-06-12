/*!
 * route-mapper - SingletonResource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _actions = require('actions');

var _Resource2 = require('./Resource');

var _Resource3 = _interopRequireDefault(_Resource2);

/**
 * Singleton Resource
 *
 * @class
 */

let SingletonResource = (function (_Resource) {

  /**
   * @constructor
   * @param {String} entity         - The singleton resource name
   * @param {Object} options        - Defaults to empby object
   */

  function SingletonResource(entity) {
    let options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, SingletonResource);

    _Resource.call(this, entity, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  _inherits(SingletonResource, _Resource);

  _createClass(SingletonResource, [{
    key: 'defaultActions',
    get: function () {
      return _actions.SINGLETON_ACTIONS;
    }
  }, {
    key: 'plural',

    /**
     * @example
     *  resource.memberName
     *  // => photos
     */
    get: function () {
      if (!_lodash2['default'].has(this, '_plural')) this._plural = _pluralize2['default'].plural(this.name);
      return this._plural;
    }
  }, {
    key: 'singular',

    /**
     * @example
     *  resource.memberName
     *  // => photo
     */
    get: function () {
      if (!_lodash2['default'].has(this, '_singular')) this._singular = this.name;
      return this._singular;
    }
  }, {
    key: 'memberName',

    /**
     * @example
     *  resource.memberName
     *  // => photo
     */
    get: function () {
      return this.singular;
    }
  }, {
    key: 'collectionName',

    /**
     * @example
     *  resource.collectionName
     *  // => photo
     */
    get: function () {
      return this.singular;
    }
  }, {
    key: 'memberScope',
    get: function () {
      return this.path;
    }
  }, {
    key: 'nestedScope',
    get: function () {
      return this.path;
    }
  }]);

  return SingletonResource;
})(_Resource3['default']);

exports['default'] = SingletonResource;
module.exports = exports['default'];