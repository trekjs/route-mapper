'use strict';

/*!
 * route-mapper - Resource
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const OPTIONS = {
  camelCase: true,
  param: 'id'
};

/**
 * Resource
 */
class Resource {

  /**
   * @constructor
   * @param {String} entities       - The resource name
   * @param {Object} options        - Defaults to empby object
   */
  constructor(entities) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    options = _lodash2.default.partialRight(_lodash2.default.assign, function (v, o, k) {
      return _lodash2.default.has(options, k) ? v : o;
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
    return _actions.ACTIONS;
  }

  get actions() {
    const only = this.options.only;
    const except = this.options.except;
    if (_lodash2.default.isString(only)) only = [only];
    if (_lodash2.default.isString(except)) except = [except];
    if (only && only.length) {
      return _lodash2.default.intersection(this.defaultActions, only);
    } else if (except && except.length) {
      return _lodash2.default.without(this.defaultActions, ...except);
    }
    return this.defaultActions.slice(0);
  }

  get name() {
    const as = this.as || this._name;
    return this.camelCase ? _lodash2.default.camelCase(as) : as;
  }

  /**
   * @example
   *  resource.plural
   *  // => photos
   */
  get plural() {
    return _pluralize2.default.plural(this.name);
  }

  /**
   * @example
   *  resource.singular
   *  // => photo
   */
  get singular() {
    return _pluralize2.default.singular(this.name);
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
      name = `${ this.plural }_index`;
    } else {
      name = this.plural;
    }
    return this.camelCase ? _lodash2.default.camelCase(name) : name;
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
    return `${ this.path }/:${ this.param }`;
  }

  /**
   * @example
   *  resource.nestedParam
   *  // => id
   *  // => photoId
   *  // => photo_id
   */
  get nestedParam() {
    const param = this.param !== 'id' ? this.param : this.singular + '_' + this.param;
    return this.camelCase ? _lodash2.default.camelCase(param) : param;
  }

  /**
   * @example
   *  resource.nestedScope
   *  // => photos/:id
   *  // => photos/:photoId/users/:id
   *  // => photos/:photo_id/users/:id
   */
  get nestedScope() {
    return `${ this.path }/:${ this.nestedParam }`;
  }

  /**
   * @example
   *  resource.newScope('edit')
   *  // => photos/edit
   */
  newScope(newPath) {
    return `${ this.path }/${ newPath }`;
  }

}
exports.default = Resource;