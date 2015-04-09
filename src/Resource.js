/*!
 * route-mapper - Resource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import has from 'lodash-node/modern/object/has';
import isString from 'lodash-node/modern/lang/isString';
import camelCase from 'lodash-node/modern/string/camelCase';
import pluralize from 'pluralize';
import { ACTIONS } from 'actions';

/**
 * Resource
 *
 * @class
 */
class Resource {

  /**
   * @constructor
   * @param {String} entities       - The resource name
   * @param {Object} options        - Defaults to empby object
   * @param {Boolean} [camelCase]   - Defaults to true
   */
  constructor(entities, options = Object.create(null), camelCase = true) {
    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || 'id';
    this.shallow = false;
    this.options = options;
    this.camelCase = camelCase;
  }

  get defaultActions() {
    return ACTIONS;
  }

  get actions() {
    let only = this.options.only;
    let except = this.options.except;
    if (isString(only)) only = [only];
    if (isString(except)) except = [except];
    if (only && only.length) {
      return only;
    } else if (except && except.length) {
      return this.defaultActions.filter((a) => except.indexOf(a) < 0);
    }
    return this.defaultActions;
  }

  get name() {
    return isString(this.as) ? this.as : this._name;
  }

  /**
   * @example
   *  resource.plural
   *  // => photos
   */
  get plural() {
    if (!has(this, '_plural')) this._plural = pluralize.plural(this.name);
    return this._plural;
  }

  /**
   * @example
   *  resource.singular
   *  // => photo
   */
  get singular() {
    if (!has(this, '_singular')) this._singular = pluralize.singular(this.name);
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
   *  // => index
   *  // => photoIndex
   *  // => photo_index
   *  // => photo
   */
  get collectionName() {
    let name = '';
    if (!this.plural) {
      name = 'index';
    } else if (this.singular === this.plural) {
      name = `${this.plural}_index`;
    } else {
      name = this.plural;
    }
    return this.camelCase ? camelCase(name) : name;
  }

  get resourceScope() {
    return {
      controller: this.controller
    };
  }

  get collectionScope() {
    return this.path;
  }

  /**
   * @example
   *  resource.memberScope
   *  // => photos/:id
   *  // => photos/:photoId/users/id
   *  // => photos/:photo_id/users/id
   */
  get memberScope() {
    return `${this.path}/:${this.param}`;
  }

  get shallowScope() {
    return this.memberScope;
  }

  /**
   * @example
   *  resource.nestedParam
   *  // => id
   *  // => photoId
   *  // => photo_id
   */
  get nestedParam() {
    let param = this.param !== 'id' ? this.param : this.singular + '_' + this.param;
    return this.camelCase ? camelCase(param) : param;
  }

  /**
   * @example
   *  resource.nestedScope
   *  // => photos/:id
   *  // => photos/:photoId/users/:id
   *  // => photos/:photo_id/users/:id
   */
  get nestedScope() {
    return `${this.path}/:${this.nestedParam}`;
  }

  get isShallow() {
    return this.shallow;
  }

  /**
   * @example
   *  resource.newScope('edit')
   *  // => photos/edit
   */
  newScope(newPath) {
    return `${this.path}/${newPath}`;
  }

}

export default Resource;
