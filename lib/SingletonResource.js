'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _has = require('lodash-node/modern/object/has');

var _has2 = _interopRequireWildcard(_has);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireWildcard(_pluralize);

var _SINGLETON_ACTIONS = require('actions');

var _Resource2 = require('./Resource');

var _Resource3 = _interopRequireWildcard(_Resource2);

/*!
 * route-mapper - SingletonResource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

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
   * @param {Boolean} [camelCase]   - Defaults to true
   */

  function SingletonResource(entity) {
    let options = arguments[1] === undefined ? Object.create(null) : arguments[1];
    let camelCase = arguments[2] === undefined ? true : arguments[2];

    _classCallCheck(this, SingletonResource);

    _Resource.call(this, entity, options, camelCase);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  _inherits(SingletonResource, _Resource);

  _createClass(SingletonResource, [{
    key: 'defaultActions',
    get: function () {
      return _SINGLETON_ACTIONS.SINGLETON_ACTIONS;
    }
  }, {
    key: 'plural',

    /**
     * @example
     *  resource.memberName
     *  // => photos
     */
    get: function () {
      if (!_has2['default'](this, '_plural')) this._plural = _pluralize2['default'].plural(this.name);
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
      if (!_has2['default'](this, '_singular')) this._singular = this.name;
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