import isEmpty from 'lodash-node/modern/lang/isEmpty';
import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import isRegExp from 'lodash-node/modern/lang/isRegExp';
import isString from 'lodash-node/modern/lang/isString';
import has from 'lodash-node/modern/object/has';
import create from 'lodash-node/modern/object/create';
import compact from 'lodash-node/modern/array/compact';
import debug from 'debug';
import {buildArgs, normalizePath} from './utils';
import {root} from './base';
import {namespace} from './scoping';
import Mapping from './mapping';
import Resource from './resource';
import SingletonResource from './singleton_resource';

var debug = debug('route-mapper:resources');

const VALID_ON_OPTIONS = ['new', 'collection', 'member'];
const RESOURCE_OPTIONS = ['as', 'controller', 'path', 'only', 'except', 'param', 'concerns'];
const CANONICAL_ACTIONS = ['index', 'create', 'new', 'show', 'update', 'destroy'];

class Resources {

  resourcesPathNames(options) {
    return Object.assign(create(null), this.context.get('path_names'), options);
  }

  resource(...args) {
    let [resources, options, cb] = buildArgs(...args);
    let kind = 'resource';

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(
      kind,
      new SingletonResource(resources.pop(), options), () => {

      if (isFunction(cb)) { cb.call(this); }

      if (options.concerns) {
        this.concerns(options.concerns);
      }

      let actions = this.parentResource().actions;

      if (actions.includes('create')) {
        this.collection(() => {
          this.post('create');
        });
      }

      if (actions.includes('new')) {
        this['new'](() => {
          this.get('new');
        });
      }

      this.setMemberMappingsForResource();
    });

    return this;
  }

  resources(...args) {
    let [resources, options, cb] = buildArgs(...args);
    let kind = 'resources';

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(
      kind,
      new Resource(resources.pop(), options), () => {

      if (isFunction(cb)) { cb.call(this); }

      if (options.concerns) {
        this.concerns(options.concerns);
      }

      let actions = this.parentResource().actions;

      this.collection(() => {
        if (actions.includes('index')) {
          this.get('index');
        }
        if (actions.includes('create')) {
          this.post('create');
        }
      });

      if (actions.includes('new')) {
        this['new'](() => {
          this.get('new');
        });
      }

      this.setMemberMappingsForResource();
    });

    return this;
  }

  collection(cb) {
    if (!this.isResourceScope()) {
      throw new Error(`Can't use collection outside resource(s) scope`);
    }

    this.withScopeLevel('collection', () => {
      this.scope(this.parentResource().collectionScope, cb);
    });

    return this;
  }

  member(cb) {
    if (!this.isResourceScope()) {
      throw new Error(`Can't use member outside resource(s) scope`);
    }

    this.withScopeLevel('member', () => {
      if (this.isShallow()) {
        this.shallowScope(this.parentResource().memberScope, cb);
      } else {
        this.scope(this.parentResource().memberScope, cb);
      }
    });

    return this;
  }

  ['new'](cb) {
    if (!this.isResourceScope()) {
      throw new Error(`Can't use new outside resource(s) scope`);
    }

    this.withScopeLevel('new', () => {
      this.scope(this.parentResource().newScope(this.actionPath('new')), cb);
    });

    return this;
  }

  nested(cb) {
    if (!this.isResourceScope()) {
      throw new Error(`Can't use nested outside resource(s) scope`);
    }

    this.withScopeLevel('nested', () => {
      if (this.isShallow() && this.shallowNestingDepth() >= 1) {
        this.shallowScope(this.parentResource().nestedScope, this.nestedOptions(), cb);
      } else {
        this.scope(this.parentResource().nestedScope, this.nestedOptions(), cb);
      }
    });

    return this;
  }

  // Scoping#namespace
  //namespace(path, options = {}, cb) {
  namespace(...args) {
    args = buildArgs(...args);
    if (this.isResourceScope()) {
      this.nested(() => {
        namespace.apply(this, args);
      });
    } else {
      namespace.apply(this, args);
    }
    return this;
  }

  shallow(cb) {
    return this.scope({ shallow: true }, cb);
  }

  isShallow() {
    return (this.parentResource() instanceof Resource) &&
      this.context.get('shallow');
  }

  // root({ to: 'photos#show' })
  // root('photos#show')
  root(path, options = {}) {
    if (isString(path)) {
      options.to = path;
    } else if (isObject(path) && isEmpty(options)) {
      options = path;
    } else {
      throw new Error('Must be called with a path and/or options');
    }

    if (this.context.isResources()) {
      this.withScopeLevel('root', () => {
        this.scope(this.parentResource().path, () => {
          root.call(this, options);
        });
      });
    } else {
      root.call(this, options);
    }

    return this;
  }

  // match 'path'
  // match 'path', { to: 'controller#action' }
  // match 'path', 'otherpath', { on: 'member', via: 'get' }
  // match { on: 'member', via: 'get' }
  //match(path, ...rest) {
  match(...args) {
    let [paths, options, cb] = buildArgs(...args);

    let to = options.to;
    if (to) {
      if (!/#/.test(to)) {
        options.controller = to;
      }
    }

    if (paths.length === 0 && options.path) {
      paths = [options.path];
    }

    if (!has(options, 'anchor')) {
      options.anchor = true;
    }

    if (options.on && !VALID_ON_OPTIONS.includes(options.on)) {
      throw new Error(`Unknown scope ${options.on} given to :on`);
    }

    let controller = this.context.get('controller');
    let action = this.context.get('action');
    if (controller && action) {
      options.to ?= `${controller}#${action}`;
    }

    paths.forEach((p) => {
      let routeOptions = Object.assign(options);
      routeOptions.path = p;
      let pathWithoutFormat = p.replace(/\(\.:format\)$/, '');
      if (this.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
        routeOptions.to ?= pathWithoutFormat.replace(/^\//g, '').replace(/\/([^\/]*)$/, '#$1');
        routeOptions.to = routeOptions.to.replace(/-/g, '_');
      }
      this.decomposedMatch(p, routeOptions);
    });

    return this;
  }

  isUsingMatchShorthand(path, options) {
    return path && !(options.to || options.action) && /\//.test(path);
  }

  decomposedMatch(path, options) {
    let on = options.on;
    if (on) {
      delete options.on;
      this[on](() => {
        this.decomposedMatch(path, options);
      });
    } else {
      switch (this.context.scopeLevel) {
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

  //shallowScope(path, options = {}, cb) {
  shallowScope(...args) {
    let [paths, options, cb] = buildArgs(...args);
    let scope = {
      as: this.context.get('shallow_prefix'),
      path: this.context.get('shallow_path')
    };
    this.context = this.context.create(scope);
    this.scope(...paths, options, cb);
    this.context = this.context.parent;
  }

  setMemberMappingsForResource() {
    this.member(() => {
      let actions = this.parentResource().actions;
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
        this['delete']('destroy');
      }
    });
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

    if (this.isResourceScope()) {
      this.nested(() => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    Object.keys(options).forEach((k) => {
      if (isRegExp(options[k])) {
        (options.constraints ?= {})[k] = options[k];
        delete options[k];
      }
    });

    let scopeOptions = {};
    Object.keys(options).forEach((k) => {
      if (!RESOURCE_OPTIONS.includes(k)) {
        scopeOptions[k] = options[k];
        delete options[k];
      }
    });
    if (Object.keys(scopeOptions).length) {
      this.scope(scopeOptions, () => {
        this[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (!this.isActionOptions(options)) {
      if (this.isScopeActionOptions()) {
        Object.assign(options, this.scopeActionOptions());
      }
    }

    return false;
  }

  resourceScope(kind, resource, cb) {
    resource.shallow = this.context.get('shallow');
    this.context = this.context.create({ scope_level_resource: resource });
    this.nesting.push(resource);

    this.withScopeLevel(kind, () => {
      this.scope(this.parentResource().resourceScope, cb);
    });

    this.nesting.pop();
    this.context = this.context.parent;
  }

  nestedOptions() {
    let parentResource = this.parentResource();
    let options = {
      as: parentResource.memberName
    };
    if (this.isParamConstraint()) {
      options.constraints = {
        [parentResource.nestedParam]: this.paramConstraint()
      };
    }
    return options;
  }

  isParamConstraint() {
    let constraints = this.context.get('constraints');
    return constraints && constraints[this.parentResource().param];
  }

  paramConstraint() {
    return this.context.get('constraints')[this.parentResource().param];
  }

  withScopeLevel(kind, cb) {
    if (isFunction(cb)) {
      // begin, new
      this.context = this.context.createLevel(kind);

      cb.call(this);

      // end, reroll
      this.context = this.context.parent;
    }
  }

  parentResource() {
    return this.context.get('scope_level_resource');
  }

  shallowNestingDepth() {
    return this.nesting.filter((r) => r.isShallow()).length;
  }

  isResourceScope() {
    return this.context.isResourceScope();
  }

  isNestedScope() {
    return this.context.isNested();
  }

  isActionOptions(options) {
    return options.only || options.except;
  }

  isScopeActionOptions() {
    let options = this.context.get('options');
    return options && (options.only || options.except);
  }

  scopeActionOptions() {
    let options = this.context.get('options');
    let o = {};
    Object.keys(options)
      .forEach((k) => {
        if (k === 'only' || k === 'except') {
          o[k] = options[k];
        }
      });
    return o;
  }

  isResourceMethodScope() {
    return this.context.isResourceMethodScope();
  }

  isCanonicalAction(action) {
    return this.isResourceMethodScope() && CANONICAL_ACTIONS.includes(action);
  }

  pathForAction(action, path) {
    if (path && this.isCanonicalAction(action)) {
      return this.context.get('path');
    } else {
      let scopePath = this.context.get('path');
      let actionPath = this.actionPath(action, path);
      return compact([scopePath, actionPath]).join('/');
    }
  }

  actionPath(name, path) {
    return path || this.context.get('path_names')[name] || name;
  }

  addRoute(action, options) {
    let path = normalizePath(this.pathForAction(action, options.path));
    delete options.path;

    action = String(action);
    if (/^[\w\-\/]+$/.test(action)) {
      if (!action.includes('/')) {
        options.action ?= action.replace(/-/g, '_')
      }
    } else {
      action = null;
    }

    let as = this.nameForAction(options.as, action);
    delete options.as;

    let mapping = Mapping.build(this.context, this.set, path, as, options);
    // mapping.toRoute();
    this.set.addRoute(mapping);
  }

  prefixNameForAction(as, action) {
    let prefix;
    if (as) {
      prefix = as;
    } else if (!this.isCanonicalAction(action)) {
      prefix = action;
    }

    if (prefix && prefix !== '/') {
      //return normalizePath(prefix.replace(/-/g, '_'));
      return prefix.replace(/-/g, '_');
    }

    return prefix;
  }

  nameForAction(as, action) {
    let prefix = this.prefixNameForAction(as, action);
    let namePrefix = this.context.get('as');
    let collectionName;
    let memberName;
    let parentResource = this.parentResource();
    if (parentResource) {
      if (!(as || action)) {
        return null;
      }

      collectionName = parentResource.collectionName;
      memberName = parentResource.memberName;
    }

    let actionName = this.context.actionName(namePrefix, prefix, collectionName, memberName);
    let candidate = compact(actionName).join('_');

    if (candidate) {
      if (!as) {
        if (/^[_a-zA-Z]/.test(candidate) && !(has(this.set.namedRoutes, candidate))) {
          return candidate;
        }
      } else {
        return candidate;
      }
    }
  }

}

export default Resources;
