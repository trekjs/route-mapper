/*!
 * route-mapper - RouteMapper
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _actions = require('actions');

var _actions2 = _interopRequireDefault(_actions);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _delegates = require('delegates');

var _delegates2 = _interopRequireDefault(_delegates);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _Scope = require('./Scope');

var _Scope2 = _interopRequireDefault(_Scope);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _SingletonResource = require('./SingletonResource');

var _SingletonResource2 = _interopRequireDefault(_SingletonResource);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

const debug = (0, _debug3['default'])('route-mapper');

const DEFAULT_RESOURCES_PATH_NAMES = {
  'new': 'new',
  'edit': 'edit'
};

const VALID_ON_OPTIONS = ['new', 'collection', 'member'];

const RESOURCE_OPTIONS = ['as', 'controller', 'path', 'only', 'except', 'param', 'concerns'];

const URL_OPTIONS = ['protocol', 'host', 'domain', 'subdomain', 'port', 'path'];

const DEFAULT_OPTIONS = {
  pathNames: DEFAULT_RESOURCES_PATH_NAMES
};

/**
 * RouteMapper
 *
 * @class
 * @public
 */

let RouteMapper = (function () {

  /**
   * @param {Object} options
   */

  function RouteMapper() {
    let options = arguments[0] === undefined ? Object.create(DEFAULT_OPTIONS) : arguments[0];

    _classCallCheck(this, RouteMapper);

    _lodash2['default'].defaults(options, DEFAULT_OPTIONS);
    this.$scope = new _Scope2['default']({
      pathNames: options.pathNames
    });
    this.namedRoutes = Object.create(null);
    this.nesting = [];
    this.routes = [];
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

  RouteMapper.prototype.scope = function scope() {
    var _this = this;

    var _utils$parseArgs$apply = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);

    let paths = _utils$parseArgs$apply[0];
    let options = _utils$parseArgs$apply[1];
    let cb = _utils$parseArgs$apply[2];

    let scope = {};

    if (paths.length) {
      options.path = paths.join('/');
    }
    if (!_lodash2['default'].has(options, 'constraints')) {
      options.constraints = {};
    }

    if (!this.isNestedScope) {
      if (_lodash2['default'].has(options, 'path') && !_lodash2['default'].has(options, 'shallowPath')) {
        options.shallowPath = options.path;
      }
      if (_lodash2['default'].has(options, 'as') && !_lodash2['default'].has(options, 'shallowPrefix')) {
        options.shallowPrefix = options.as;
      }
    }

    if (_lodash2['default'].isObject(options.constraints)) {
      let defaults = {};
      for (var _iterator = _lodash2['default'].keys(options.constraints), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        let k = _ref;

        if (URL_OPTIONS.includes(k)) {
          defaults[k] = options.constraints[k];
        }
      }
      options.defaults = _lodash2['default'].assign(defaults, options.defaults || {});
    } else {
      options.constraints = {};
    }

    this.$scope.options.forEach(function (option) {
      let value;
      if (option === 'options') {
        value = options;
      } else {
        value = options[option];
        delete options[option];
      }

      if (value) {
        scope[option] = _utils2['default'].mergeScope[option](_this.$scope.get(option), value);
      }
    });

    if (_lodash2['default'].isFunction(cb)) {
      // begin, new
      this.$scope = this.$scope.create(scope);

      cb.call(this);

      // end, reroll
      this.$scope = this.$scope.parent;
    }

    return this;
  };

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

  RouteMapper.prototype.controller = function controller(_controller, options, cb) {
    if (options === undefined) options = {};

    if (_lodash2['default'].isFunction(options)) {
      cb = options;
      options = {};
    }
    options.controller = _controller;
    return this.scope(options, cb);
  };

  RouteMapper.prototype.match = function match() {
    var _this2 = this;

    var _utils$parseArgs$apply2 = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);

    let paths = _utils$parseArgs$apply2[0];
    let options = _utils$parseArgs$apply2[1];
    let cb = _utils$parseArgs$apply2[2];

    let to = options.to;
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

    let controller = this.$scope.get('controller');
    let action = this.$scope.get('action');
    if (controller && action) {
      if (!_lodash2['default'].has(options, 'to')) {
        options.to = `${ controller }#${ action }`;
      }
    }

    paths.forEach(function (p) {
      let routeOptions = _lodash2['default'].assign(options);
      routeOptions.path = p;
      let pathWithoutFormat = p.replace(/\.:format\??$/, '');
      if (_this2.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
        if (!_lodash2['default'].has(options, 'to')) {
          routeOptions.to = pathWithoutFormat.replace(/^\//g, '').replace(/\/([^\/]*)$/, '#$1');
        }
        routeOptions.to = routeOptions.to.replace(/-/g, '_');
      }
      _this2.decomposedMatch(p, routeOptions);
    });

    return this;
  };

  RouteMapper.prototype.root = function root(path) {
    var _this3 = this;

    let options = arguments[1] === undefined ? {} : arguments[1];

    if (_lodash2['default'].isString(path)) {
      options.to = path;
    } else if (_lodash2['default'].isObject(path) && _lodash2['default'].isEmpty(options)) {
      options = path;
    } else {
      throw new Error('Must be called with a path and/or options');
    }

    if (this.isResources) {
      this.withScopeLevel('root', function () {
        _this3.scope(_this3.parentResource.path, function () {
          _root.call(_this3, options);
        });
      });
    } else {
      _root.call(this, options);
    }

    return this;

    function _root(options) {
      options = _lodash2['default'].assign({}, {
        as: 'root',
        verb: 'get'
      }, options);
      return this.match('/', options);
    }
  };

  // TODO

  RouteMapper.prototype.mount = function mount() {};

  RouteMapper.prototype._mapMethod = function _mapMethod(method, args) {
    var _utils$parseArgs$apply3 = _utils2['default'].parseArgs.apply(_utils2['default'], args);

    let paths = _utils$parseArgs$apply3[0];
    let options = _utils$parseArgs$apply3[1];
    let cb = _utils$parseArgs$apply3[2];

    options.verb = method;
    return this.match(paths, options, cb);
  };

  RouteMapper.prototype.resource = function resource() {
    var _this4 = this;

    var _utils$parseArgs$apply4 = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);

    let resources = _utils$parseArgs$apply4[0];
    let options = _utils$parseArgs$apply4[1];
    let cb = _utils$parseArgs$apply4[2];

    let kind = 'resource';

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(kind, new _SingletonResource2['default'](resources.pop(), options), function () {

      if (_lodash2['default'].isFunction(cb)) {
        cb.call(_this4);
      }

      if (options.concerns) {
        _this4.concerns(options.concerns);
      }

      let actions = _this4.parentResource.actions;

      if (actions.includes('create')) {
        _this4.collection(function () {
          _this4.post('create');
        });
      }

      if (actions.includes('new')) {
        _this4['new'](function () {
          _this4.get('new');
        });
      }

      _this4.setMemberMappingsForResource();
    });

    return this;
  };

  RouteMapper.prototype.resources = function resources() {
    var _this5 = this;

    var _utils$parseArgs$apply5 = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);

    let resources = _utils$parseArgs$apply5[0];
    let options = _utils$parseArgs$apply5[1];
    let cb = _utils$parseArgs$apply5[2];

    let kind = 'resources';

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(kind, new _Resource2['default'](resources.pop(), options), function () {

      if (_lodash2['default'].isFunction(cb)) {
        cb.call(_this5);
      }

      if (options.concerns) {
        _this5.concerns(options.concerns);
      }

      let actions = _this5.parentResource.actions;

      _this5.collection(function () {
        if (actions.includes('index')) {
          _this5.get('index');
        }
        if (actions.includes('create')) {
          _this5.post('create');
        }
      });

      if (actions.includes('new')) {
        _this5['new'](function () {
          _this5.get('new');
        });
      }

      _this5.setMemberMappingsForResource();
    });

    return this;
  };

  RouteMapper.prototype.collection = function collection(cb) {
    var _this6 = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use collection outside resource(s) scope`);
    }

    this.withScopeLevel('collection', function () {
      _this6.scope(_this6.parentResource.collectionScope, cb);
    });

    return this;
  };

  RouteMapper.prototype.member = function member(cb) {
    var _this7 = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use member outside resource(s) scope`);
    }

    this.withScopeLevel('member', function () {
      if (_this7.isShallow) {
        _this7.shallowScope(_this7.parentResource.memberScope, cb);
      } else {
        _this7.scope(_this7.parentResource.memberScope, cb);
      }
    });

    return this;
  };

  RouteMapper.prototype['new'] = function _new(cb) {
    var _this8 = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use new outside resource(s) scope`);
    }

    this.withScopeLevel('new', function () {
      _this8.scope(_this8.parentResource.newScope(_this8.actionPath('new')), cb);
    });

    return this;
  };

  RouteMapper.prototype.nested = function nested(cb) {
    var _this9 = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use nested outside resource(s) scope`);
    }

    this.withScopeLevel('nested', function () {
      if (_this9.isShallow && _this9.shallowNestingDepth >= 1) {
        _this9.shallowScope(_this9.parentResource.nestedScope, _this9.nestedOptions, cb);
      } else {
        _this9.scope(_this9.parentResource.nestedScope, _this9.nestedOptions, cb);
      }
    });

    return this;
  };

  RouteMapper.prototype.namespace = function namespace() {
    var _this10 = this;

    let args = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);
    if (this.isResourceScope) {
      this.nested(function () {
        _namespace.apply(_this10, args);
      });
    } else {
      _namespace.apply(this, args);
    }

    return this;

    function _namespace(path, options, cb) {
      if (options === undefined) options = {};

      path = String(path);
      let defaults = {
        module: path,
        path: options.path || path,
        as: options.as || path,
        shallowPath: options.path || path,
        shallowPrefix: options.as || path
      };
      _lodash2['default'].assign(defaults, options);
      return this.scope(defaults, cb);
    }
  };

  RouteMapper.prototype.constraints = function constraints(_constraints, cb) {
    if (_constraints === undefined) _constraints = {};

    return this.scope({
      constraints: _constraints
    }, cb);
  };

  RouteMapper.prototype.defaults = function defaults(_defaults, cb) {
    if (_defaults === undefined) _defaults = {};

    return this.scope({
      defaults: _defaults
    }, cb);
  };

  RouteMapper.prototype.shallow = function shallow(cb) {
    return this.scope({
      shallow: true
    }, cb);
  };

  RouteMapper.prototype.concern = function concern(name, callable, cb) {
    var _this11 = this;

    if (!_lodash2['default'].isFunction(callable)) {
      callable = function (options) {
        if (_lodash2['default'].isFunction(cb)) {
          cb.call(_this11, options);
        }
      };
    }
    this._concerns[name] = callable;
    return this;
  };

  RouteMapper.prototype.concerns = function concerns() {
    var _this12 = this;

    var _utils$parseArgs$apply6 = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);

    let names = _utils$parseArgs$apply6[0];
    let options = _utils$parseArgs$apply6[1];
    let cb = _utils$parseArgs$apply6[2];

    names.forEach(function (name) {
      let concern = _this12._concerns[name];
      if (_lodash2['default'].isFunction(concern)) {
        concern.call(_this12, options);
      } else {
        throw new Error(`No concern named ${ name } was found!`);
      }
    });
    return this;
  };

  RouteMapper.prototype.applyCommonBehaviorFor = function applyCommonBehaviorFor(method, resources, options, cb) {
    var _this13 = this;

    if (resources.length > 1) {
      resources.forEach(function (r) {
        _this13[method](r, options, cb);
      });
      return true;
    }

    if (options.shallow) {
      delete options.shallow;
      this.shallow(function () {
        _this13[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (this.isResourceScope) {
      this.nested(function () {
        _this13[method](resources.pop(), options, cb);
      });
      return true;
    }

    _lodash2['default'].keys(options).forEach(function (k) {
      if (_lodash2['default'].isRegExp(options[k])) {
        if (!options.constraints) options.constraints = {};
        options.constraints[k] = options[k];
        delete options[k];
      }
    });

    let scopeOptions = {};
    _lodash2['default'].keys(options).forEach(function (k) {
      if (!RESOURCE_OPTIONS.includes(k)) {
        scopeOptions[k] = options[k];
        delete options[k];
      }
    });

    if (_lodash2['default'].keys(scopeOptions).length) {
      this.scope(scopeOptions, function () {
        _this13[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (!this.isActionOptions(options)) {
      if (this.isScopeActionOptions) {
        _lodash2['default'].assign(options, this.scopeActionOptions());
      }
    }

    return false;
  };

  RouteMapper.prototype.resourceScope = function resourceScope(kind, resource, cb) {
    var _this14 = this;

    resource.shallow = this.$scope.get('shallow');
    this.$scope = this.$scope.create({
      scopeLevelResource: resource
    });
    this.nesting.push(resource);

    this.withScopeLevel(kind, function () {
      _this14.scope(_this14.parentResource.resourceScope, cb);
    });

    this.nesting.pop();
    this.$scope = this.$scope.parent;
  };

  RouteMapper.prototype.shallowScope = function shallowScope() {
    var _utils$parseArgs$apply7 = _utils2['default'].parseArgs.apply(_utils2['default'], arguments);

    let paths = _utils$parseArgs$apply7[0];
    let options = _utils$parseArgs$apply7[1];
    let cb = _utils$parseArgs$apply7[2];

    let scope = {
      as: this.$scope.get('shallowPrefix'),
      path: this.$scope.get('shallowPath')
    };
    this.$scope = this.$scope.create(scope);
    this.scope.apply(this, paths.concat([options, cb]));
    this.$scope = this.$scope.parent;
  };

  RouteMapper.prototype.withScopeLevel = function withScopeLevel(kind, cb) {
    if (_lodash2['default'].isFunction(cb)) {
      // begin, new
      this.$scope = this.$scope.createLevel(kind);

      cb.call(this);

      // end, reroll
      this.$scope = this.$scope.parent;
    }
  };

  RouteMapper.prototype.setMemberMappingsForResource = function setMemberMappingsForResource() {
    var _this15 = this;

    this.member(function () {
      let actions = _this15.parentResource.actions;
      if (actions.includes('edit')) {
        _this15.get('edit');
      }
      if (actions.includes('show')) {
        _this15.get('show');
      }
      if (actions.includes('update')) {
        _this15.patch('update');
        _this15.put('update');
      }
      if (actions.includes('destroy')) {
        _this15['delete']('destroy');
      }
    });
  };

  RouteMapper.prototype.decomposedMatch = function decomposedMatch(path, options) {
    var _this16 = this;

    let on = options.on;
    if (on) {
      delete options.on;
      this[on](function () {
        _this16.decomposedMatch(path, options);
      });
    } else {
      switch (this.$scope.scopeLevel) {
        case 'resources':
          this.nested(function () {
            _this16.decomposedMatch(path, options);
          });
          break;
        case 'resource':
          this.member(function () {
            _this16.decomposedMatch(path, options);
          });
          break;
        default:
          this.addRoute(path, options);
      }
    }
  };

  RouteMapper.prototype.addRoute = function addRoute(action, options) {
    let path = _utils2['default'].normalizePath(this.pathForAction(action, options.path));
    delete options.path;

    action = String(action);
    if (/^[\w\-\/]+$/.test(action)) {
      if (!action.includes('/') && !_lodash2['default'].has(options, 'action')) {
        options.action = action.replace(/-/g, '_');
      }
    } else {
      action = null;
    }

    options.as = _lodash2['default'].camelCase(this.nameForAction(options.as, action));

    let route = new _Route2['default'](this.$scope, path, options);

    debug(`route: ${ route.as } ${ route.verb } ${ route.path } ${ route.controller }#${ route.action }`);

    this.routes.push(route);
  };

  RouteMapper.prototype.pathForAction = function pathForAction(action, path) {
    if (path && this.isCanonicalAction(action)) {
      return this.$scope.get('path');
    } else {
      let scopePath = this.$scope.get('path');
      let actionPath = this.actionPath(action, path);
      return _lodash2['default'].compact([scopePath, actionPath]).join('/');
    }
  };

  RouteMapper.prototype.nameForAction = function nameForAction(as, action) {
    let prefix = this.prefixNameForAction(as, action);
    let namePrefix = this.$scope.get('as');
    let collectionName;
    let memberName;
    let parentResource = this.parentResource;
    if (parentResource) {
      if (!(as || action)) {
        return null;
      }
      collectionName = parentResource.collectionName;
      memberName = parentResource.memberName;
    }

    let actionName = this.$scope.actionName(namePrefix, prefix, collectionName, memberName);
    let candidate = _lodash2['default'].compact(actionName).join('_');

    if (candidate) {
      if (!as) {
        if (/^[_a-zA-Z]/.test(candidate) && !_lodash2['default'].has(this.namedRoutes, candidate)) {
          return candidate;
        }
      } else {
        return candidate;
      }
    }
  };

  RouteMapper.prototype.prefixNameForAction = function prefixNameForAction(as, action) {
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
  };

  RouteMapper.prototype.isActionOptions = function isActionOptions(options) {
    return options.only || options.except;
  };

  RouteMapper.prototype.isCanonicalAction = function isCanonicalAction(action) {
    return this.isResourceMethodScope && _actions2['default'].CANONICAL_ACTIONS.includes(action);
  };

  RouteMapper.prototype.isUsingMatchShorthand = function isUsingMatchShorthand(path, options) {
    return path && !(options.to || options.action) && /\/[\w\/]+$/.test(path);
  };

  RouteMapper.prototype.scopeActionOptions = function scopeActionOptions() {
    let options = this.$scope.get('options');
    let o = {};
    _lodash2['default'].keys(options).forEach(function (k) {
      if (k === 'only' || k === 'except') {
        o[k] = options[k];
      }
    });
    return o;
  };

  RouteMapper.prototype.actionPath = function actionPath(name, path) {
    return path || this.$scope.get('pathNames')[name] || name;
  };

  _createClass(RouteMapper, [{
    key: 'shallowNestingDepth',
    get: function () {
      return this.nesting.filter(function (r) {
        return r.isShallow;
      }).length;
    }
  }, {
    key: 'parentResource',
    get: function () {
      return this.$scope.get('scopeLevelResource');
    }
  }, {
    key: 'isShallow',
    get: function () {
      return this.parentResource instanceof _Resource2['default'] && this.$scope.get('shallow');
    }
  }, {
    key: 'isScopeActionOptions',
    get: function () {
      let options = this.$scope.get('options');
      return options && (options.only || options.except);
    }
  }, {
    key: 'nestedOptions',
    get: function () {
      let parentResource = this.parentResource;
      let options = {
        as: parentResource.memberName
      };
      if (this.isParamConstraint) {
        var _options$constraints;

        options.constraints = (_options$constraints = {}, _options$constraints[parentResource.nestedParam] = this.paramConstraint, _options$constraints);
      }
      return options;
    }
  }, {
    key: 'isParamConstraint',
    get: function () {
      let constraints = this.$scope.get('constraints');
      return constraints && constraints[this.parentResource.param];
    }
  }, {
    key: 'paramConstraint',
    get: function () {
      return this.$scope.get('constraints')[this.parentResource.param];
    }
  }]);

  return RouteMapper;
})();

// Extends Const Actions
_lodash2['default'].assign(RouteMapper, _actions2['default']);

// HTTP verbs
['get', 'options', 'post', 'put', 'patch', 'delete',
// alias delete
'del'].forEach(function (verb) {
  let method = verb;
  if (verb === 'del') verb = 'delete';
  RouteMapper.prototype[method] = function () {
    return this._mapMethod(verb, arguments);
  };
});

// Delegates
(0, _delegates2['default'])(RouteMapper.prototype, '$scope').getter('isResources').getter('isNestedScope').getter('isResourceScope').getter('isResourceMethodScope');

exports['default'] = RouteMapper;
module.exports = exports['default'];