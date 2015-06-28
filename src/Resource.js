/*!
 * route-mapper - Resource
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import _ from 'lodash';
import pluralize from 'pluralize';
import { ACTIONS } from 'actions';

const OPTIONS = {
  camelCase: true,
  param: 'id'
};

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
   */
  constructor(entities, options = {}) {
    options = _.partialRight(_.assign, function(v, o, k) {
      return _.has(options, k) ? v : o;
    })(options, OPTIONS);
    this._name = String(entities);
    this.options = options;
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param;
    this.camelCase = options.camelCase;
  }

  get defaultActions() {
    return ACTIONS;
  }

  get actions() {
    let only = this.options.only;
    let except = this.options.except;
    if (_.isString(only)) only = [only];
    if (_.isString(except)) except = [except];
    if (only && only.length) {
      return _.intersection(this.defaultActions, only);
    } else if (except && except.length) {
      return _.without(this.defaultActions, ...except);
    }
    return this.defaultActions.slice(0);
  }

  get name() {
    return this.as || this._name;
  }

  /**
   * @example
   *  resource.plural
   *  // => photos
   */
  get plural() {
    return pluralize.plural(this.name);
  }

  /**
   * @example
   *  resource.singular
   *  // => photo
   */
  get singular() {
    return pluralize.singular(this.name);
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
    return this.camelCase ? _.camelCase(name) : name;
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

  /**
   * @example
   *  resource.nestedParam
   *  // => id
   *  // => photoId
   *  // => photo_id
   */
  get nestedParam() {
    let param = this.param !== 'id' ? this.param : this.singular + '_' + this.param;
    return this.camelCase ? _.camelCase(param) : param;
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
