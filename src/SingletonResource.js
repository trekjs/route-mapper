/*!
 * route-mapper - lib/SingletonResource
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

  constructor(entities, options) {
    super(entities, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  get defaultActions() {
    return SINGLETON_ACTIONS;
  }

  get plural() {
    if (!has(this, '_plural')) this._plural = pluralize.plural(this.name);
    return this._plural;
  }

  get singular() {
    if (!has(this, '_singular')) this._singular = this.name;
    return this._singular;
  }

  get memberName() {
    return this.singular;
  }

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
