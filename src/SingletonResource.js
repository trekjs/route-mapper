/*!
 * route-mapper - SingletonResource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import has from 'lodash-node/modern/object/has';
import pluralize from 'pluralize';
import { SINGLETON_ACTIONS } from 'actions';
import Resource from './Resource';

/**
 * Singleton Resource
 *
 * @class
 */
class SingletonResource extends Resource {

  /**
   * @constructor
   * @param {String} entity         - The singleton resource name
   * @param {Object} options        - Defaults to empby object
   * @param {Boolean} [camelCase]   - Defaults to true
   */
  constructor(entity, options = Object.create(null), camelCase = true) {
    super(entity, options, camelCase);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  get defaultActions() {
    return SINGLETON_ACTIONS;
  }

  /**
   * @example
   *  resource.memberName
   *  // => photos
   */
  get plural() {
    if (!has(this, '_plural')) this._plural = pluralize.plural(this.name);
    return this._plural;
  }

  /**
   * @example
   *  resource.memberName
   *  // => photo
   */
  get singular() {
    if (!has(this, '_singular')) this._singular = this.name;
    return this._singular;
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

export default SingletonResource;
