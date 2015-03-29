/*!
 * route-mapper - lib/RouteMapper
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Actions = _interopRequire(require("actions"));

var _debug = _interopRequire(require("debug"));

var delegate = _interopRequire(require("delegates"));

var _ = _interopRequire(require("lodash-node"));

var utils = _interopRequire(require("./utils"));

var mergeScope = _interopRequire(require("./mergeScope"));

var Scope = _interopRequire(require("./Scope"));

var Resource = _interopRequire(require("./Resource"));

var SingletonResource = _interopRequire(require("./SingletonResource"));

var Route = _interopRequire(require("./Route"));

const debug = _debug("route-mapper");

const DEFAULT_RESOURCES_PATH_NAMES = {
  "new": "new",
  edit: "edit"
};

const VALID_ON_OPTIONS = ["new", "collection", "member"];

const RESOURCE_OPTIONS = ["as", "controller", "path", "only", "except", "param", "concerns"];

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

let RouteMapper = (function () {

  /**
   * @param {Object} options
   */

  function RouteMapper() {
    let options = arguments[0] === undefined ? Object.create(DEFAULT_OPTIONS) : arguments[0];

    _classCallCheck(this, RouteMapper);

    _.defaults(options, DEFAULT_OPTIONS);
    let camelCase = options.camelCase;
    let pathNames = options.pathNames;

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

  RouteMapper.prototype.scope = function scope() {
    var _this = this;

    var _utils$parseArgs = utils.parseArgs(arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let paths = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

    let scope = {};

    if (paths.length) {
      options.path = paths.join("/");
    }
    if (!_.has(options, "constraints")) {
      options.constraints = {};
    }

    if (!this.isNestedScope) {
      if (_.has(options, "path") && !_.has(options, "shallowPath")) {
        options.shallowPath = options.path;
      }
      if (_.has(options, "as") && !_.has(options, "shallowPrefix")) {
        options.shallowPrefix = options.as;
      }
    }

    if (_.isObject(options.constraints)) {
      let defaults = {};
      for (var _iterator = _.keys(options.constraints), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
      options.defaults = _.assign(defaults, options.defaults || {});
    } else {
      options.constraints = {};
    }

    this.$scope.options.forEach(function (option) {
      let value;
      if (option === "options") {
        value = options;
      } else {
        value = options[option];
        delete options[option];
      }

      if (value) {
        scope[option] = mergeScope[option](_this.$scope.get(option), value);
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

  RouteMapper.prototype.controller = (function (_controller) {
    var _controllerWrapper = function controller(_x, _x2, _x3) {
      return _controller.apply(this, arguments);
    };

    _controllerWrapper.toString = function () {
      return _controller.toString();
    };

    return _controllerWrapper;
  })(function (controller, _x8, cb) {
    let options = arguments[1] === undefined ? {} : arguments[1];

    if (_.isFunction(options)) {
      cb = options;
      options = {};
    }
    options.controller = controller;
    return this.scope(options, cb);
  });

  RouteMapper.prototype.match = function match() {
    var _this = this;

    var _utils$parseArgs = utils.parseArgs(arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let paths = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

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

    let controller = this.$scope.get("controller");
    let action = this.$scope.get("action");
    if (controller && action) {
      if (!_.has(options, "to")) {
        options.to = `${ controller }#${ action }`;
      }
    }

    paths.forEach(function (p) {
      let routeOptions = _.assign(options);
      routeOptions.path = p;
      let pathWithoutFormat = p.replace(/\.:format\??$/, "");
      if (_this.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
        if (!_.has(options, "to")) {
          routeOptions.to = pathWithoutFormat.replace(/^\//g, "").replace(/\/([^\/]*)$/, "#$1");
        }
        routeOptions.to = routeOptions.to.replace(/-/g, "_");
      }
      _this.decomposedMatch(p, routeOptions);
    });

    return this;
  };

  RouteMapper.prototype.root = function root(path) {
    var _this = this;

    let options = arguments[1] === undefined ? {} : arguments[1];

    if (_.isString(path)) {
      options.to = path;
    } else if (_.isObject(path) && _.isEmpty(options)) {
      options = path;
    } else {
      throw new Error("Must be called with a path and/or options");
    }

    if (this.isResources) {
      this.withScopeLevel("root", function () {
        _this.scope(_this.parentResource.path, function () {
          _root.call(_this, options);
        });
      });
    } else {
      _root.call(this, options);
    }

    return this;

    function _root(options) {
      options = _.assign({}, {
        as: "root",
        verb: "get"
      }, options);
      return this.match("/", options);
    }
  };

  // TODO

  RouteMapper.prototype.mount = function mount() {};

  RouteMapper.prototype._mapMethod = function _mapMethod(method, args) {
    var _utils$parseArgs = utils.parseArgs(args);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let paths = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

    options.verb = method;
    return this.match(paths, options, cb);
  };

  RouteMapper.prototype.resource = function resource() {
    var _this = this;

    var _utils$parseArgs = utils.parseArgs(arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let resources = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

    let kind = "resource";

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(kind, new SingletonResource(resources.pop(), options, this.camelCase), function () {

      if (_.isFunction(cb)) {
        cb.call(_this);
      }

      if (options.concerns) {
        _this.concerns(options.concerns);
      }

      let actions = _this.parentResource.actions;

      if (actions.includes("create")) {
        _this.collection(function () {
          _this.post("create");
        });
      }

      if (actions.includes("new")) {
        _this["new"](function () {
          _this.get("new");
        });
      }

      _this.setMemberMappingsForResource();
    });

    return this;
  };

  RouteMapper.prototype.resources = function resources() {
    var _this = this;

    var _utils$parseArgs = utils.parseArgs(arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let resources = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

    let kind = "resources";

    if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
      return this;
    }

    this.resourceScope(kind, new Resource(resources.pop(), options, this.camelCase), function () {

      if (_.isFunction(cb)) {
        cb.call(_this);
      }

      if (options.concerns) {
        _this.concerns(options.concerns);
      }

      let actions = _this.parentResource.actions;

      _this.collection(function () {
        if (actions.includes("index")) {
          _this.get("index");
        }
        if (actions.includes("create")) {
          _this.post("create");
        }
      });

      if (actions.includes("new")) {
        _this["new"](function () {
          _this.get("new");
        });
      }

      _this.setMemberMappingsForResource();
    });

    return this;
  };

  RouteMapper.prototype.collection = function collection(cb) {
    var _this = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use collection outside resource(s) scope`);
    }

    this.withScopeLevel("collection", function () {
      _this.scope(_this.parentResource.collectionScope, cb);
    });

    return this;
  };

  RouteMapper.prototype.member = function member(cb) {
    var _this = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use member outside resource(s) scope`);
    }

    this.withScopeLevel("member", function () {
      if (_this.isShallow) {
        _this.shallowScope(_this.parentResource.memberScope, cb);
      } else {
        _this.scope(_this.parentResource.memberScope, cb);
      }
    });

    return this;
  };

  RouteMapper.prototype["new"] = function _new(cb) {
    var _this = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use new outside resource(s) scope`);
    }

    this.withScopeLevel("new", function () {
      _this.scope(_this.parentResource.newScope(_this.actionPath("new")), cb);
    });

    return this;
  };

  RouteMapper.prototype.nested = function nested(cb) {
    var _this = this;

    if (!this.isResourceScope) {
      throw new Error(`Can't use nested outside resource(s) scope`);
    }

    this.withScopeLevel("nested", function () {
      if (_this.isShallow && _this.shallowNestingDepth >= 1) {
        _this.shallowScope(_this.parentResource.nestedScope, _this.nestedOptions, cb);
      } else {
        _this.scope(_this.parentResource.nestedScope, _this.nestedOptions, cb);
      }
    });

    return this;
  };

  RouteMapper.prototype.namespace = function namespace() {
    var _this = this;

    let args = utils.parseArgs(arguments);
    if (this.isResourceScope) {
      this.nested(function () {
        _namespace.apply(_this, args);
      });
    } else {
      _namespace.apply(this, args);
    }

    return this;

    function _namespace(path, _x8, cb) {
      let options = arguments[1] === undefined ? {} : arguments[1];

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
  };

  RouteMapper.prototype.constraints = (function (_constraints) {
    var _constraintsWrapper = function constraints(_x4, _x5) {
      return _constraints.apply(this, arguments);
    };

    _constraintsWrapper.toString = function () {
      return _constraints.toString();
    };

    return _constraintsWrapper;
  })(function (_x8, cb) {
    let constraints = arguments[0] === undefined ? {} : arguments[0];

    return this.scope({ constraints: constraints }, cb);
  });

  RouteMapper.prototype.defaults = (function (_defaults) {
    var _defaultsWrapper = function defaults(_x6, _x7) {
      return _defaults.apply(this, arguments);
    };

    _defaultsWrapper.toString = function () {
      return _defaults.toString();
    };

    return _defaultsWrapper;
  })(function (_x8, cb) {
    let defaults = arguments[0] === undefined ? {} : arguments[0];

    return this.scope({ defaults: defaults }, cb);
  });

  RouteMapper.prototype.shallow = function shallow(cb) {
    return this.scope({ shallow: true }, cb);
  };

  RouteMapper.prototype.concern = function concern(name, callable, cb) {
    var _this = this;

    if (!_.isFunction(callable)) {
      callable = function (options) {
        if (_.isFunction(cb)) {
          cb.call(_this, options);
        }
      };
    }
    this._concerns[name] = callable;
    return this;
  };

  RouteMapper.prototype.concerns = function concerns() {
    var _this = this;

    var _utils$parseArgs = utils.parseArgs(arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let names = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

    names.forEach(function (name) {
      let concern = _this._concerns[name];
      if (_.isFunction(concern)) {
        concern.call(_this, options);
      } else {
        throw new Error(`No concern named ${ name } was found!`);
      }
    });
    return this;
  };

  RouteMapper.prototype.applyCommonBehaviorFor = function applyCommonBehaviorFor(method, resources, options, cb) {
    var _this = this;

    if (resources.length > 1) {
      resources.forEach(function (r) {
        _this[method](r, options, cb);
      });
      return true;
    }

    if (options.shallow) {
      delete options.shallow;
      this.shallow(function () {
        _this[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (this.isResourceScope) {
      this.nested(function () {
        _this[method](resources.pop(), options, cb);
      });
      return true;
    }

    _.keys(options).forEach(function (k) {
      if (_.isRegExp(options[k])) {
        if (!options.constraints) options.constraints = {};
        options.constraints[k] = options[k];
        delete options[k];
      }
    });

    let scopeOptions = {};
    _.keys(options).forEach(function (k) {
      if (!RESOURCE_OPTIONS.includes(k)) {
        scopeOptions[k] = options[k];
        delete options[k];
      }
    });

    if (_.keys(scopeOptions).length) {
      this.scope(scopeOptions, function () {
        _this[method](resources.pop(), options, cb);
      });
      return true;
    }

    if (!this.isActionOptions(options)) {
      if (this.isScopeActionOptions) {
        _.assign(options, this.scopeActionOptions());
      }
    }

    return false;
  };

  RouteMapper.prototype.resourceScope = function resourceScope(kind, resource, cb) {
    var _this = this;

    resource.shallow = this.$scope.get("shallow");
    this.$scope = this.$scope.create({
      scopeLevelResource: resource
    });
    this.nesting.push(resource);

    this.withScopeLevel(kind, function () {
      _this.scope(_this.parentResource.resourceScope, cb);
    });

    this.nesting.pop();
    this.$scope = this.$scope.parent;
  };

  RouteMapper.prototype.shallowScope = function shallowScope() {
    var _utils$parseArgs = utils.parseArgs(arguments);

    var _utils$parseArgs2 = _slicedToArray(_utils$parseArgs, 3);

    let paths = _utils$parseArgs2[0];
    let options = _utils$parseArgs2[1];
    let cb = _utils$parseArgs2[2];

    let scope = {
      as: this.$scope.get("shallowPrefix"),
      path: this.$scope.get("shallowPath")
    };
    this.$scope = this.$scope.create(scope);
    this.scope.apply(this, _toConsumableArray(paths).concat([options, cb]));
    this.$scope = this.$scope.parent;
  };

  RouteMapper.prototype.withScopeLevel = function withScopeLevel(kind, cb) {
    if (_.isFunction(cb)) {
      // begin, new
      this.$scope = this.$scope.createLevel(kind);

      cb.call(this);

      // end, reroll
      this.$scope = this.$scope.parent;
    }
  };

  RouteMapper.prototype.setMemberMappingsForResource = function setMemberMappingsForResource() {
    var _this = this;

    this.member(function () {
      let actions = _this.parentResource.actions;
      if (actions.includes("edit")) {
        _this.get("edit");
      }
      if (actions.includes("show")) {
        _this.get("show");
      }
      if (actions.includes("update")) {
        _this.patch("update");
        _this.put("update");
      }
      if (actions.includes("destroy")) {
        _this["delete"]("destroy");
      }
    });
  };

  RouteMapper.prototype.decomposedMatch = function decomposedMatch(path, options) {
    var _this = this;

    let on = options.on;
    if (on) {
      delete options.on;
      this[on](function () {
        _this.decomposedMatch(path, options);
      });
    } else {
      switch (this.$scope.scopeLevel) {
        case "resources":
          this.nested(function () {
            _this.decomposedMatch(path, options);
          });
          break;
        case "resource":
          this.member(function () {
            _this.decomposedMatch(path, options);
          });
          break;
        default:
          this.addRoute(path, options);
      }
    }
  };

  RouteMapper.prototype.addRoute = function addRoute(action, options) {
    let path = utils.normalizePath(this.pathForAction(action, options.path));
    delete options.path;

    action = String(action);
    if (/^[\w\-\/]+$/.test(action)) {
      if (!action.includes("/") && !_.has(options, "action")) {
        options.action = action.replace(/-/g, "_");
      }
    } else {
      action = null;
    }

    options.as = _.camelCase(this.nameForAction(options.as, action));

    let route = new Route(this.$scope, path, options);

    debug(`route: ${ route.as } ${ route.verb } ${ route.path } ${ route.controller }#${ route.action }`);

    this.routes.push(route);
  };

  RouteMapper.prototype.pathForAction = function pathForAction(action, path) {
    if (path && this.isCanonicalAction(action)) {
      return this.$scope.get("path");
    } else {
      let scopePath = this.$scope.get("path");
      let actionPath = this.actionPath(action, path);
      return _.compact([scopePath, actionPath]).join("/");
    }
  };

  RouteMapper.prototype.nameForAction = function nameForAction(as, action) {
    let prefix = this.prefixNameForAction(as, action);
    let namePrefix = this.$scope.get("as");
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
    let candidate = _.compact(actionName).join("_");

    if (candidate) {
      if (!as) {
        if (/^[_a-zA-Z]/.test(candidate) && !_.has(this.namedRoutes, candidate)) {
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

    if (prefix && prefix !== "/") {
      return prefix.replace(/-/g, "_");
    }

    return prefix;
  };

  RouteMapper.prototype.isActionOptions = function isActionOptions(options) {
    return options.only || options.except;
  };

  RouteMapper.prototype.isCanonicalAction = function isCanonicalAction(action) {
    return this.isResourceMethodScope && Actions.CANONICAL_ACTIONS.includes(action);
  };

  RouteMapper.prototype.isUsingMatchShorthand = function isUsingMatchShorthand(path, options) {
    return path && !(options.to || options.action) && /\/[\w\/]+$/.test(path);
  };

  RouteMapper.prototype.scopeActionOptions = function scopeActionOptions() {
    let options = this.$scope.get("options");
    let o = {};
    _.keys(options).forEach(function (k) {
      if (k === "only" || k === "except") {
        o[k] = options[k];
      }
    });
    return o;
  };

  RouteMapper.prototype.actionPath = function actionPath(name, path) {
    return path || this.$scope.get("pathNames")[name] || name;
  };

  _createClass(RouteMapper, {
    shallowNestingDepth: {
      get: function () {
        return this.nesting.filter(function (r) {
          return r.isShallow;
        }).length;
      }
    },
    parentResource: {
      get: function () {
        return this.$scope.get("scopeLevelResource");
      }
    },
    isShallow: {
      get: function () {
        return this.parentResource instanceof Resource && this.$scope.get("shallow");
      }
    },
    isScopeActionOptions: {
      get: function () {
        let options = this.$scope.get("options");
        return options && (options.only || options.except);
      }
    },
    nestedOptions: {
      get: function () {
        var _this = this;

        let parentResource = this.parentResource;
        let options = {
          as: parentResource.memberName
        };
        if (this.isParamConstraint) {
          options.constraints = (function () {
            var _options$constraints = {};
            _options$constraints[parentResource.nestedParam] = _this.paramConstraint;
            return _options$constraints;
          })();
        }
        return options;
      }
    },
    isParamConstraint: {
      get: function () {
        let constraints = this.$scope.get("constraints");
        return constraints && constraints[this.parentResource.param];
      }
    },
    paramConstraint: {
      get: function () {
        return this.$scope.get("constraints")[this.parentResource.param];
      }
    }
  });

  return RouteMapper;
})();

// Extends Const Actions
_.assign(RouteMapper, Actions);

// HTTP verbs
["get", "options", "post", "put", "patch", "delete",
// alias delete
"del"].forEach(function (verb) {
  let method = verb;
  if (verb === "del") verb = "delete";
  RouteMapper.prototype[method] = function () {
    return this._mapMethod(verb, arguments);
  };
});

// Delegates
delegate(RouteMapper.prototype, "$scope").getter("isResources").getter("isNestedScope").getter("isResourceScope").getter("isResourceMethodScope");

module.exports = RouteMapper;