'use strict';

/*!
 * route-mapper - SingletonResource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _actions = require('actions');

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Singleton Resource
 */
class SingletonResource extends _Resource2.default {

  /**
   * @constructor
   * @param {String} entity         - The singleton resource name
   * @param {Object} options        - Defaults to empby object
   */
  constructor(entity) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    super(entity, options);
    this.as = undefined;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  get defaultActions() {
    return _actions.SINGLETON_ACTIONS;
  }

  /**
   * @example
   *  resource.memberName
   *  // => photos
   */
  get plural() {
    return _pluralize2.default.plural(this.name);
  }

  /**
   * @example
   *  resource.memberName
   *  // => photo
   */
  get singular() {
    return this.name;
  }

  /**
   * @example
   *  resource.memberName
   *  // => photo
   */
  get memberName() {
    return this.singular;
  }

  /**
   * @example
   *  resource.collectionName
   *  // => photo
   */
  get collectionName() {
    return this.singular;
  }

  get memberScope() {
    return this.path;
  }

  get nestedScope() {
    return this.path;
  }

}
exports.default = SingletonResource;