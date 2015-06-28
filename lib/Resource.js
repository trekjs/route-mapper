/*!
 * route-mapper - Resource
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

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _actions = require('actions');

const OPTIONS = {
  camelCase: true,
  param: 'id'
};

/**
 * Resource
 *
 * @class
 */

let Resource = (function () {

  /**
   * @constructor
   * @param {String} entities       - The resource name
   * @param {Object} options        - Defaults to empby object
   */

  function Resource(entities) {
    let options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Resource);

    options = _lodash2['default'].partialRight(_lodash2['default'].assign, function (v, o, k) {
      return _lodash2['default'].has(options, k) ? v : o;
    })(options, OPTIONS);
    this._name = String(entities);
    this.options = options;
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param;
    this.camelCase = options.camelCase;
  }

  /**
   * @example
   *  resource.newScope('edit')
   *  // => photos/edit
   */

  Resource.prototype.newScope = function newScope(newPath) {
    return `${ this.path }/${ newPath }`;
  };

  _createClass(Resource, [{
    key: 'defaultActions',
    get: function get() {
      return _actions.ACTIONS;
    }
  }, {
    key: 'actions',
    get: function get() {
      let only = this.options.only;
      let except = this.options.except;
      if (_lodash2['default'].isString(only)) only = [only];
      if (_lodash2['default'].isString(except)) except = [except];
      if (only && only.length) {
        return _lodash2['default'].intersection(this.defaultActions, only);
      } else if (except && except.length) {
        return _lodash2['default'].without.apply(_lodash2['default'], [this.defaultActions].concat(except));
      }
      return this.defaultActions.slice(0);
    }
  }, {
    key: 'name',
    get: function get() {
      return this.as || this._name;
    }
  }, {
    key: 'plural',

    /**
     * @example
     *  resource.plural
     *  // => photos
     */
    get: function get() {
      return _pluralize2['default'].plural(this.name);
    }
  }, {
    key: 'singular',

    /**
     * @example
     *  resource.singular
     *  // => photo
     */
    get: function get() {
      return _pluralize2['default'].singular(this.name);
    }
  }, {
    key: 'memberName',

    /**
     * @example
     *  resource.memberName
     *  // => photo
     */
    get: function get() {
      return this.singular;
    }
  }, {
    key: 'collectionName',

    /**
     * @example
     *  resource.collectionName
     *  // => index
     *  // => photoIndex
     *  // => photo_index
     *  // => photo
     */
    get: function get() {
      let name = '';
      if (!this.plural) {
        name = 'index';
      } else if (this.singular === this.plural) {
        name = `${ this.plural }_index`;
      } else {
        name = this.plural;
      }
      return this.camelCase ? _lodash2['default'].camelCase(name) : name;
    }
  }, {
    key: 'resourceScope',
    get: function get() {
      return {
        controller: this.controller
      };
    }
  }, {
    key: 'collectionScope',
    get: function get() {
      return this.path;
    }
  }, {
    key: 'memberScope',

    /**
     * @example
     *  resource.memberScope
     *  // => photos/:id
     *  // => photos/:photoId/users/id
     *  // => photos/:photo_id/users/id
     */
    get: function get() {
      return `${ this.path }/:${ this.param }`;
    }
  }, {
    key: 'nestedParam',

    /**
     * @example
     *  resource.nestedParam
     *  // => id
     *  // => photoId
     *  // => photo_id
     */
    get: function get() {
      let param = this.param !== 'id' ? this.param : this.singular + '_' + this.param;
      return this.camelCase ? _lodash2['default'].camelCase(param) : param;
    }
  }, {
    key: 'nestedScope',

    /**
     * @example
     *  resource.nestedScope
     *  // => photos/:id
     *  // => photos/:photoId/users/:id
     *  // => photos/:photo_id/users/:id
     */
    get: function get() {
      return `${ this.path }/:${ this.nestedParam }`;
    }
  }]);

  return Resource;
})();

exports['default'] = Resource;
module.exports = exports['default'];