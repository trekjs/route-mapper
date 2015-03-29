/*!
 * route-mapper - lib/RouteMapper
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import Actions from 'actions';
import _debug from 'debug';
import delegate from 'delegates';
import _ from 'lodash-node';
import utils from './utils';
import mergeScope from './mergeScope';
import Scope from './Scope';
import Resource from './Resource';
import SingletonResource from './SingletonResource';
import Route from './Route';

const debug = _debug('route-mapper');

const DEFAULT_RESOURCES_PATH_NAMES = {
  'new': 'new',
  'edit': 'edit'
};

const VALID_ON_OPTIONS = [
  'new',
  'collection',
  'member'
];

const RESOURCE_OPTIONS = [
  'as',
  'controller',
  'path',
  'only',
  'except',
  'param',
  'concerns'
];

/*
const URL_OPTIONS = [
  'protocol',
  'host',
  'domain',
  'subdomain',
  'port',
  'path'
];
*/

const DEFAULT_OPTIONS = {
  pathNames: DEFAULT_RESOURCES_PATH_NAMES,
  camelCase: true
};

/**
 * RouteMapper
 *
 * @class
 * @public
 */
class RouteMapper {

  /**
   * @param {Object} options
   */
  constructor(options = Object.create(DEFAULT_OPTIONS)) {
    _.defaults(options, DEFAULT_OPTIONS);
    let { camelCase, pathNames } = options;
    this.camelCase = camelCase;
    this.$scope = new Scope({
      pathNames: pathNames
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
  scope() {
    let [paths, options, cb] = utils.parseArgs(arguments);
    let scope = {};

    if (paths.length) {
      options.path = paths.join('/');
    }
    if (!_.has(options, 'constraints')) {
      options.constraints = {};
    }

    if (!this.isNestedScope) {
      if (_.has(options, 'path') && !_.has(options, 'shallowPath')) {
        options.shallowPath = options.path;
      }
      if (_.has(options, 'as') && !_.has(options, 'shallowPrefix')) {
        options.shallowPrefix = options.as;
      }
    }

    if (_.isObject(options.constraints)) {
      let defaults = {};
      for (let k of _.keys(options.constraints)) {
        if (URL_OPTIONS.includes(k)) {
          defaults[k] = options.constraints[k];
        }
      }
      options.defaults = _.assign(defaults, options.defaults || {});
    } else {
      options.constraints = {};
    }

    this.$scope.options.forEach((option) => {
      let value;
      if (option === 'options') {
        value = options;
      } else {
        value = options[option];
        delete options[option];
      }

      if (value) {
        scope[option] = mergeScope[option](this.$scope.get(option), value);
      }
    });

    if (_.isFunction(cb)) {
      // begin, new
      this.$scope = this.$scope.create(scope);

      cb.call(this);

      // end, reroll
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
  controller(controller, options = {}, cb) {
    if (_.isFunction(options)) {
      cb = options;
      options = {};
    }
    options.controller = controller;
    return this.scope(options, cb);
  }

  match() {
    let [paths, options, cb] = utils.parseArgs(arguments);

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
      throw new Error(`Unknown scope ${options.on} given to 'on'`);
    }

    let controller = this.$scope.get('controller');
    let action = this.$scope.get('action');
    if (controller && action) {
      if (!_.has(options, 'to')) {
        options.to = `${controller}#${action}`;
      }
    }

    paths.forEach((p) => {
      let routeOptions = _.assign(options);
      routeOptions.path = p;
      let pathWithoutFormat = p.replace(/\.:format\??$/, '');
      if (this.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
        if (!_.has(options, 'to')) {
          routeOptions.to = pathWithoutFormat.replace(/^\//g, '').replace(/\/([^\/]*)$/, '#$1');
        }
        routeOptions.to = routeOptions.to.replace(/-/g, '_');
      }
      this.decomposedMatch(p, routeOptions);
    });

    return this;
  }

  root(path, options = {}) {
    if (_.isString(path)) {
      options.to = path;
    } else if (_.isObject(path) && _.isEmpty(options)) {
      options = path;
    } else {
      throw new Error('Must be called with a path and/or options');
    }

    if (this.isResources) {
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
      options = _.assign({}, {
        as: 'root',
        verb: 'get'
      }, options);
      return this.match('/', options);
    }
  }

  // TODO
  mount() {}

  _mapMethod(method, args) {
    let [paths, options, cb] = utils.parseArgs(args);
    options.verb = method;
    return this.match(paths, options, cb);
  }

  resource() {
    let [resources, options, cb] = utils.parseArgs(arguments);
    let kind = 'resource';

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(
      kind,
      new SingletonResource(resources.pop(), options, this.camelCase), () => {

        if (_.isFunction(cb)) {
          cb.call(this);
        }

        if (options.concerns) {
          this.concerns(options.concerns);
        }

        let actions = this.parentResource.actions;

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
    let [resources, options, cb] = utils.parseArgs(arguments);
    let kind = 'resources';

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(
      kind,
      new Resource(resources.pop(), options, this.camelCase), () => {

        if (_.isFunction(cb)) {
          cb.call(this);
        }

        if (options.concerns) {
          this.concerns(options.concerns);
        }

        let actions = this.parentResource.actions;

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
    if (!this.isResourceScope) {
      throw new Error(`Can't use collection outside resource(s) scope`);
    }

    this.withScopeLevel('collection', () => {
      this.scope(this.parentResource.collectionScope, cb);
    });

    return this;
  }

  member(cb) {
    if (!this.isResourceScope) {
      throw new Error(`Can't use member outside resource(s) scope`);
    }

    this.withScopeLevel('member', () => {
      if (this.isShallow) {
        this.shallowScope(this.parentResource.memberScope, cb);
      } else {
        this.scope(this.parentResource.memberScope, cb);
      }
    });

    return this;
  }

  ['new'](cb) {
    if (!this.isResourceScope) {
      throw new Error(`Can't use new outside resource(s) scope`);
    }

    this.withScopeLevel('new', () => {
      this.scope(this.parentResource.newScope(this.actionPath('new')), cb);
    });

    return this;
  }

  nested(cb) {
    if (!this.isResourceScope) {
      throw new Error(`Can't use nested outside resource(s) scope`);
    }

    this.withScopeLevel('nested', () => {
      if (this.isShallow && this.shallowNestingDepth >= 1) {
        this.shallowScope(this.parentResource.nestedScope, this.nestedOptions, cb);
      } else {
        this.scope(this.parentResource.nestedScope, this.nestedOptions, cb);
      }
    });

    return this;
  }

  namespace() {
    let args = utils.parseArgs(arguments);
    if (this.isResourceScope) {
      this.nested(() => {
        _namespace.apply(this, args);
      });
    } else {
      _namespace.apply(this, args);
    }

    return this;

    function _namespace(path, options = {}, cb) {
      path = String(path);
      let defaults = {
        module: path,
        path: options.path || path,
        as: options.as || path,
        shallowPath: options.path || path,
        shallowPrefix: options.as || path
      };
      _.assign(defaults, options);
      return this.scope(defaults, cb);
    }
  }

  constraints(constraints = {}, cb) {
    return this.scope({ constraints: constraints }, cb);
  }

  defaults(defaults = {}, cb) {
    return this.scope({ defaults: defaults }, cb);
  }

  shallow(cb) {
    return this.scope({ shallow: true }, cb);
  }

  concern(name, callable, cb) {
    if (!_.isFunction(callable)) {
      callable = options => {
        if (_.isFunction(cb)) {
          cb.call(this, options);
        }
      };
    }
    this._concerns[name] = callable;
    return this;
  }

  concerns() {
    let [names, options, cb] = utils.parseArgs(arguments);
    names.forEach(name => {
      let concern = this._concerns[name];
      if (_.isFunction(concern)) {
        concern.call(this, options);
      } else {
        throw new Error(`No concern named ${name} was found!`);
      }
    });
    return this;
  }

  applyCommonBehaviorFor(method, resources, options, cb) {
    if (resources.length > 1) {
      resources.forEach((r) => {
        this[method](r, options, cb);
      });
      return true;
    }

    if (options.shallow) {
      delete options.shallow;
      this.shallow(() => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (this.isResourceScope) {
      this.nested(() => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    _.keys(options).forEach((k) => {
      if (_.isRegExp(options[k])) {
        if (!options.constraints) options.constraints = {};
        options.constraints[k] = options[k];
        delete options[k];
      }
    });

    let scopeOptions = {};
    _.keys(options).forEach((k) => {
      if (!RESOURCE_OPTIONS.includes(k)) {
        scopeOptions[k] = options[k];
        delete options[k];
      }
    });

    if (_.keys(scopeOptions).length) {
      this.scope(scopeOptions, () => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (!this.isActionOptions(options)) {
      if (this.isScopeActionOptions) {
        _.assign(options, this.scopeActionOptions());
      }
    }

    return false;
  }

  resourceScope(kind, resource, cb) {
    resource.shallow = this.$scope.get('shallow');
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

  shallowScope() {
    let [paths, options, cb] = utils.parseArgs(arguments);
    let scope = {
      as: this.$scope.get('shallowPrefix'),
      path: this.$scope.get('shallowPath')
    };
    this.$scope = this.$scope.create(scope);
    this.scope(...paths, options, cb);
    this.$scope = this.$scope.parent;
  }

  withScopeLevel(kind, cb) {
    if (_.isFunction(cb)) {
      // begin, new
      this.$scope = this.$scope.createLevel(kind);

      cb.call(this);

      // end, reroll
      this.$scope = this.$scope.parent;
    }
  }

  setMemberMappingsForResource() {
    this.member(() => {
      let actions = this.parentResource.actions;
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
    let on = options.on;
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
    let path = utils.normalizePath(this.pathForAction(action, options.path));
    delete options.path;

    action = String(action);
    if (/^[\w\-\/]+$/.test(action)) {
      if (!action.includes('/') && !_.has(options, 'action')) {
        options.action = action.replace(/-/g, '_');
      }
    } else {
      action = null;
    }

    options.as = _.camelCase(this.nameForAction(options.as, action));

    let route = new Route(this.$scope, path, options);

    debug(`route: ${route.as} ${route.verb} ${route.path} ${route.controller}#${route.action}`);

    this.routes.push(route);
  }

  pathForAction(action, path) {
    if (path && this.isCanonicalAction(action)) {
      return this.$scope.get('path');
    } else {
      let scopePath = this.$scope.get('path');
      let actionPath = this.actionPath(action, path);
      return _.compact([scopePath, actionPath]).join('/');
    }
  }

  nameForAction(as, action) {
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
    let candidate = _.compact(actionName).join('_');

    if (candidate) {
      if (!as) {
        if (/^[_a-zA-Z]/.test(candidate) && !(_.has(this.namedRoutes, candidate))) {
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

  get shallowNestingDepth() {
    return this.nesting.filter(r => r.isShallow).length;
  }

  get parentResource() {
    return this.$scope.get('scopeLevelResource');
  }

  get isShallow() {
    return (this.parentResource instanceof Resource) && this.$scope.get('shallow');
  }

  get isScopeActionOptions() {
    let options = this.$scope.get('options');
    return options && (options.only || options.except);
  }

  get nestedOptions() {
    let parentResource = this.parentResource;
    let options = {
      as: parentResource.memberName
    };
    if (this.isParamConstraint) {
      options.constraints = {
        [parentResource.nestedParam]: this.paramConstraint
      };
    }
    return options;
  }

  get isParamConstraint() {
    let constraints = this.$scope.get('constraints');
    return constraints && constraints[this.parentResource.param];
  }

  get paramConstraint() {
    return this.$scope.get('constraints')[this.parentResource.param];
  }

  isActionOptions(options) {
    return options.only || options.except;
  }

  isCanonicalAction(action) {
    return this.isResourceMethodScope && Actions.CANONICAL_ACTIONS.includes(action);
  }

  isUsingMatchShorthand(path, options) {
    return path && !(options.to || options.action) && /\/[\w\/]+$/.test(path);
  }

  scopeActionOptions() {
    let options = this.$scope.get('options');
    let o = {};
    _.keys(options)
      .forEach((k) => {
        if (k === 'only' || k === 'except') {
          o[k] = options[k];
        }
      });
    return o;
  }

  actionPath(name, path) {
    return path || this.$scope.get('pathNames')[name] || name;
  }

}

// Extends Const Actions
_.assign(RouteMapper, Actions);

// HTTP verbs
[
  'get',
  'options',
  'post',
  'put',
  'patch',
  'delete',
  // alias delete
  'del'
].forEach((verb) => {
  let method = verb;
  if (verb === 'del') verb = 'delete';
  RouteMapper.prototype[method] = function() {
    return this._mapMethod(verb, arguments);
  };
});

// Delegates
delegate(RouteMapper.prototype, '$scope')
  .getter('isResources')
  .getter('isNestedScope')
  .getter('isResourceScope')
  .getter('isResourceMethodScope');

export default RouteMapper;
