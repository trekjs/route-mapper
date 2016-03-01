'use strict';

/*!
 * route-mapper - RouteMapper
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _actions = require('actions');

var _actions2 = _interopRequireDefault(_actions);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _Http = require('./Http');

var _Http2 = _interopRequireDefault(_Http);

var _Scope = require('./Scope');

var _Scope2 = _interopRequireDefault(_Scope);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _SingletonResource = require('./SingletonResource');

var _SingletonResource2 = _interopRequireDefault(_SingletonResource);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)('route-mapper');

const VALID_ON_OPTIONS = ['new', 'collection', 'member'];

const RESOURCE_OPTIONS = ['as', 'controller', 'path', 'only', 'except', 'param', 'concerns'];

const DEFAULT_OPTIONS = {
  pathNames: {
    'new': 'new',
    'edit': 'edit'
  }
};

/**
 * RouteMapper
 */
class RouteMapper extends _Http2.default {

  /**
   * @param {Object} options
   */
  constructor() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _lodash2.default.defaults(options, DEFAULT_OPTIONS);
    super();
    this.$scope = new _Scope2.default({
      pathNames: options.pathNames
    });
    this.nesting = [];
    this.routes = [];
    this.camelCase = true;
    this.helpers = Object.create(null);
    this._concerns = Object.create(null);
  }

  /**
   * Scopes a set of routes to the given default options.
   *
   * @example
   *  scope({ path: ':account_id', as: 'acount' }, () => {
   *    resources('posts')
   *  })
   *  // => /accounts/:account_id/photos
   *
   *  scope({ module: 'admin' }, () => {
   *    resources('posts')
   *  })
   *  // => /posts  admin/posts
   *
   *  scope({ path: '/admin' }, () => {
   *    resources('posts')
   *  })
   *  // => /admin/posts
   *
   *  scope({ as: 'sekret' }, () => {
   *    resources('posts')
   *  })
   *
   * @method scope
   *
   * @return {RouteMapper} this
   */
  scope() {
    var _utils$parseArgs = _utils2.default.parseArgs(...arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    const paths = _utils$parseArgs2[0];
    const options = _utils$parseArgs2[1];
    const cb = _utils$parseArgs2[2];

    const scopeOptions = Object.create(null);

    if (paths.length) {
      options.path = paths.join('/');
    }

    this.$scope.options.forEach(option => {
      let value;
      if (option === 'options') {
        value = options;
      } else {
        value = options[option];
        delete options[option];
      }

      if (value) {
        const f = _utils2.default.mergeScope[option].bind(_utils2.default.mergeScope);
        scopeOptions[option] = f(this.$scope.get(option), value);
      }
    });

    if (_lodash2.default.isFunction(cb)) {
      this.$scope = this.$scope.create(scopeOptions);
      cb.call(this);
      this.$scope = this.$scope.parent;
    }

    return this;
  }

  /**
   * Scopes routes to a specific controller.
   *
   * @example
   *  controller('food', () => {
   *    match('bacon', { action: 'bacon' })
   *  })
   *
   * @method controller
   *
   * @return {RouteMapper} this
   */
  controller(controller) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    let cb = arguments[2];

    if (_lodash2.default.isFunction(options)) {
      cb = options;
      options = {};
    }
    options.controller = controller;
    return this.scope(options, cb);
  }

  match() {
    var _utils$parseArgs3 = _utils2.default.parseArgs(...arguments);

    var _utils$parseArgs4 = _slicedToArray(_utils$parseArgs3, 3);

    const paths = _utils$parseArgs4[0];
    const options = _utils$parseArgs4[1];
    const cb = _utils$parseArgs4[2];


    const to = options.to;
    if (to) {
      if (!/#/.test(to)) {
        options.controller = to;
      }
    }

    if (paths.length === 0 && options.path) {
      paths = [options.path];
    }

    if (options.on && !VALID_ON_OPTIONS.includes(options.on)) {
      throw new Error(`Unknown scope ${ options.on } given to 'on'`);
    }

    const controller = this.$scope.get('controller');
    const action = this.$scope.get('action');
    if (controller && action && !_lodash2.default.has(options, 'to')) {
      options.to = `${ controller }#${ action }`;
    }

    paths.forEach(p => {
      const routeOptions = _lodash2.default.assign(options);
      routeOptions.path = p;
      const pathWithoutFormat = p.replace(/\.:format\??$/, '');
      if (this.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
        if (!_lodash2.default.has(options, 'to')) {
          routeOptions.to = pathWithoutFormat.replace(/^\//g, '').replace(/\/([^\/]*)$/, '#$1');
        }
        routeOptions.to = routeOptions.to.replace(/-/g, '_');
      }
      this.decomposedMatch(p, routeOptions);
    });

    return this;
  }

  root(path) {
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (_lodash2.default.isString(path)) {
      options.to = path;
    } else if (_lodash2.default.isObject(path) && _lodash2.default.isEmpty(options)) {
      options = path;
    } else {
      throw new Error('Must be called with a path and/or options');
    }

    if (this.$scope.isResources) {
      this.withScopeLevel('root', () => {
        this.scope(this.parentResource.path, () => {
          _root.call(this, options);
        });
      });
    } else {
      _root.call(this, options);
    }

    return this;

    function _root(options) {
      options = _lodash2.default.assign({}, {
        as: 'root',
        verb: 'get'
      }, options);
      return this.match('/', options);
    }
  }

  // TODO
  mount() {}

  resource() {
    var _utils$parseArgs5 = _utils2.default.parseArgs(...arguments);

    var _utils$parseArgs6 = _slicedToArray(_utils$parseArgs5, 3);

    const resourcesArray = _utils$parseArgs6[0];
    const options = _utils$parseArgs6[1];
    const cb = _utils$parseArgs6[2];

    const kind = 'resource';

    if (this.applyCommonBehaviorFor(kind, resourcesArray, options, cb)) {
      return this;
    }

    // set style
    options.camelCase = this.camelCase;

    this.resourceScope(kind, new _SingletonResource2.default(resourcesArray.pop(), options), () => {

      if (_lodash2.default.isFunction(cb)) {
        cb.call(this);
      }

      if (options.concerns) {
        this.concerns(options.concerns);
      }

      const actions = this.parentResource.actions;

      if (actions.includes('create')) {
        this.collection(() => {
          this.post('create');
        });
      }

      if (actions.includes('new')) {
        this.new(() => {
          this.get('new');
        });
      }

      this.setMemberMappingsForResource();
    });

    return this;
  }

  resources() {
    var _utils$parseArgs7 = _utils2.default.parseArgs(...arguments);

    var _utils$parseArgs8 = _slicedToArray(_utils$parseArgs7, 3);

    const resourcesArray = _utils$parseArgs8[0];
    const options = _utils$parseArgs8[1];
    const cb = _utils$parseArgs8[2];

    const kind = 'resources';

    if (this.applyCommonBehaviorFor(kind, resourcesArray, options, cb)) {
      return this;
    }

    // set style
    options.camelCase = this.camelCase;

    this.resourceScope(kind, new _Resource2.default(resourcesArray.pop(), options), () => {

      if (_lodash2.default.isFunction(cb)) {
        cb.call(this);
      }

      if (options.concerns) {
        this.concerns(options.concerns);
      }

      const actions = this.parentResource.actions;

      this.collection(() => {
        if (actions.includes('index')) {
          this.get('index');
        }
        if (actions.includes('create')) {
          this.post('create');
        }
      });

      if (actions.includes('new')) {
        this.new(() => {
          this.get('new');
        });
      }

      this.setMemberMappingsForResource();
    });

    return this;
  }

  collection(cb) {
    if (!this.$scope.isResourceScope) {
      throw new Error(`Can't use collection outside resource(s) scope`);
    }

    this.withScopeLevel('collection', () => {
      this.scope(this.parentResource.collectionScope, cb);
    });

    return this;
  }

  member(cb) {
    if (!this.$scope.isResourceScope) {
      throw new Error(`Can't use member outside resource(s) scope`);
    }

    this.withScopeLevel('member', () => {
      this.scope(this.parentResource.memberScope, cb);
    });

    return this;
  }

  ['new'](cb) {
    if (!this.$scope.isResourceScope) {
      throw new Error(`Can't use new outside resource(s) scope`);
    }

    this.withScopeLevel('new', () => {
      this.scope(this.parentResource.newScope(this.actionPath('new')), cb);
    });

    return this;
  }

  nested(cb) {
    if (!this.$scope.isResourceScope) {
      throw new Error(`Can't use nested outside resource(s) scope`);
    }

    this.withScopeLevel('nested', () => {
      this.scope(this.parentResource.nestedScope, this.nestedOptions, cb);
    });

    return this;
  }

  namespace() {
    const args = _utils2.default.parseArgs(...arguments);
    if (this.$scope.isResourceScope) {
      this.nested(() => {
        _namespace.apply(this, args);
      });
    } else {
      _namespace.apply(this, args);
    }

    return this;

    function _namespace(path) {
      let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      let cb = arguments[2];

      path = String(path);
      const defaults = {
        module: path,
        path: options.path || path,
        as: options.as || path
      };
      _lodash2.default.assign(defaults, options);
      return this.scope(defaults, cb);
    }
  }

  concern(name, callable, cb) {
    if (!_lodash2.default.isFunction(callable)) {
      callable = options => {
        if (_lodash2.default.isFunction(cb)) {
          cb.call(this, options);
        }
      };
    }
    this._concerns[name] = callable;
    return this;
  }

  concerns() {
    var _utils$parseArgs9 = _utils2.default.parseArgs(...arguments);

    var _utils$parseArgs10 = _slicedToArray(_utils$parseArgs9, 3);

    const names = _utils$parseArgs10[0];
    const options = _utils$parseArgs10[1];
    const cb = _utils$parseArgs10[2];

    names.forEach(name => {
      const concern = this._concerns[name];
      if (_lodash2.default.isFunction(concern)) {
        concern.call(this, options);
      } else {
        throw new Error(`No concern named ${ name } was found!`);
      }
    });
    return this;
  }

  applyCommonBehaviorFor(method, resources, options, cb) {
    if (resources.length > 1) {
      resources.forEach(r => {
        this[method](r, options, cb);
      });
      return true;
    }

    if (this.$scope.isResourceScope) {
      this.nested(() => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    const scopeOptions = {};
    _lodash2.default.keys(options).forEach(k => {
      if (!RESOURCE_OPTIONS.includes(k)) {
        scopeOptions[k] = options[k];
        delete options[k];
      }
    });

    if (_lodash2.default.keys(scopeOptions).length) {
      this.scope(scopeOptions, () => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (!this.isActionOptions(options)) {
      if (this.isScopeActionOptions) {
        _lodash2.default.assign(options, this.scopeActionOptions());
      }
    }

    return false;
  }

  resourceScope(kind, resource, cb) {
    this.$scope = this.$scope.create({
      scopeLevelResource: resource
    });
    this.nesting.push(resource);

    this.withScopeLevel(kind, () => {
      this.scope(this.parentResource.resourceScope, cb);
    });

    this.nesting.pop();
    this.$scope = this.$scope.parent;
  }

  withScopeLevel(kind, cb) {
    // begin, new
    this.$scope = this.$scope.createLevel(kind);

    if (_lodash2.default.isFunction(cb)) cb.call(this);

    // end, reroll
    this.$scope = this.$scope.parent;
  }

  setMemberMappingsForResource() {
    this.member(() => {
      const actions = this.parentResource.actions;
      if (actions.includes('edit')) {
        this.get('edit');
      }
      if (actions.includes('show')) {
        this.get('show');
      }
      if (actions.includes('update')) {
        this.patch('update');
        this.put('update');
      }
      if (actions.includes('destroy')) {
        this.delete('destroy');
      }
    });
  }

  decomposedMatch(path, options) {
    const on = options.on;
    if (on) {
      delete options.on;
      this[on](() => {
        this.decomposedMatch(path, options);
      });
    } else {
      switch (this.$scope.scopeLevel) {
        case 'resources':
          this.nested(() => {
            this.decomposedMatch(path, options);
          });
          break;
        case 'resource':
          this.member(() => {
            this.decomposedMatch(path, options);
          });
          break;
        default:
          this.addRoute(path, options);
      }
    }
  }

  addRoute(action, options) {
    const path = _utils2.default.normalizePath(this.pathForAction(action, options.path));
    delete options.path;

    action = String(action);
    if (/^[\w\-\/]+$/.test(action)) {
      if (!action.includes('/') && !_lodash2.default.has(options, 'action')) {
        options.action = action.replace(/-/g, '_');
      }
    } else {
      action = null;
    }

    options.camelCase = this.camelCase;
    options.as = this.nameForAction(options.as, action);

    const route = new _Route2.default(this.$scope, path, options);

    debug(route.as, route.verb, route.path, `${ route.controller }#${ route.action }`);

    if (!_lodash2.default.has(this.helpers, route.as)) {
      this.helpers[route.as] = route.pathHelp.bind(route);
    }
    this.routes.push(route);
  }

  pathForAction(action, path) {
    if (path && this.isCanonicalAction(action)) {
      return this.$scope.get('path');
    } else {
      const scopePath = this.$scope.get('path');
      const actionPath = this.actionPath(action, path);
      return _lodash2.default.compact([scopePath, actionPath]).join('/');
    }
  }

  nameForAction(as, action) {
    const prefix = this.prefixNameForAction(as, action);
    const namePrefix = this.$scope.get('as');
    let collectionName;
    let memberName;
    const parentResource = this.parentResource;
    if (parentResource) {
      if (!(as || action)) {
        return null;
      }
      collectionName = parentResource.collectionName;
      memberName = parentResource.memberName;
    }

    const actionName = this.$scope.actionName(namePrefix, prefix, collectionName, memberName);
    const candidate = _lodash2.default.compact(actionName).join('_');

    if (candidate) {
      if (!as) {
        if (/^[_a-zA-Z]/.test(candidate) && !_lodash2.default.has(this.helpers, candidate)) {
          return candidate;
        }
      } else {
        return candidate;
      }
    }
  }

  prefixNameForAction(as, action) {
    let prefix;
    if (as) {
      prefix = as;
    } else if (!this.isCanonicalAction(action)) {
      prefix = action;
    }

    if (prefix && prefix !== '/') {
      return prefix.replace(/-/g, '_');
    }

    return prefix;
  }

  get parentResource() {
    return this.$scope.get('scopeLevelResource');
  }

  get isScopeActionOptions() {
    const options = this.$scope.get('options');
    return options && (options.only || options.except);
  }

  get nestedOptions() {
    const parentResource = this.parentResource;
    const options = {
      as: parentResource.memberName
    };
    return options;
  }

  isActionOptions(options) {
    return options.only || options.except;
  }

  isCanonicalAction(action) {
    return this.$scope.isResourceMethodScope && _actions2.default.CANONICAL_ACTIONS.includes(action);
  }

  isUsingMatchShorthand(path, options) {
    return path && !(options.to || options.action) && /\/[\w\/]+$/.test(path);
  }

  scopeActionOptions() {
    const options = this.$scope.get('options');
    const o = {};
    _lodash2.default.keys(options).forEach(k => {
      if (k === 'only' || k === 'except') {
        o[k] = options[k];
      }
    });
    return o;
  }

  actionPath(name, path) {
    return path || this.$scope.get('pathNames')[name] || name;
  }

  draw(filename) {
    const result = babel.transformFileSync(filename, {
      ast: false
    });

    const g = Object.create(null);
    g.routeMapper = this;
    _vm2.default.runInNewContext(result.code, g);
  }

}
exports.default = RouteMapper;