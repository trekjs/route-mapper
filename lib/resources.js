"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _core = require("6to5-runtime/core-js");

var isEmpty = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isEmpty"));

var isFunction = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isFunction"));

var isObject = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isObject"));

var isRegExp = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isRegExp"));

var isString = _to5Helpers.interopRequire(require("lodash-node/modern/lang/isString"));

var has = _to5Helpers.interopRequire(require("lodash-node/modern/object/has"));

var debug = _to5Helpers.interopRequire(require("debug"));

var _utils = require("./utils");

var buildArgs = _utils.buildArgs;
var compact = _utils.compact;
var newObject = _utils.newObject;
var normalizePath = _utils.normalizePath;
var root = require("./base").root;
var namespace = require("./scoping").namespace;
var Mapping = _to5Helpers.interopRequire(require("./mapping"));

var Resource = _to5Helpers.interopRequire(require("./resource"));

var SingletonResource = _to5Helpers.interopRequire(require("./singleton_resource"));

var debug = debug("route-mapper:resources");

var VALID_ON_OPTIONS = ["new", "collection", "member"];
var RESOURCE_OPTIONS = ["as", "controller", "path", "only", "except", "param", "concerns"];
var CANONICAL_ACTIONS = ["index", "create", "new", "show", "update", "destroy"];

var Resources = (function () {
  function Resources() {
    _to5Helpers.classCallCheck(this, Resources);
  }

  _to5Helpers.prototypeProperties(Resources, null, (function () {
    var _to5Helpers$prototypeProperties = {
      resourcesPathNames: {
        value: function resourcesPathNames(options) {
          return _core.Object.assign(newObject(), this.context.get("path_names"), options);
        },
        writable: true,
        configurable: true
      },
      resource: {
        value: function resource() {
          var _this = this;
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var _buildArgs$apply = buildArgs.apply(undefined, _to5Helpers.toArray(args));

          var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

          var resources = _buildArgs$apply2[0];
          var options = _buildArgs$apply2[1];
          var cb = _buildArgs$apply2[2];
          var kind = "resource";

          if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
            return this;
          }

          this.resourceScope(kind, new SingletonResource(resources.pop(), options), function () {
            if (isFunction(cb)) {
              cb.call(_this);
            }

            if (options.concerns) {
              _this.concerns(options.concerns);
            }

            var actions = _this.parentResource().actions;

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
        },
        writable: true,
        configurable: true
      },
      resources: {
        value: function resources() {
          var _this = this;
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var _buildArgs$apply = buildArgs.apply(undefined, _to5Helpers.toArray(args));

          var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

          var resources = _buildArgs$apply2[0];
          var options = _buildArgs$apply2[1];
          var cb = _buildArgs$apply2[2];
          var kind = "resources";

          if (this.applyCommonBehaviorFor(kind, resources, options, cb)) {
            return this;
          }

          this.resourceScope(kind, new Resource(resources.pop(), options), function () {
            if (isFunction(cb)) {
              cb.call(_this);
            }

            if (options.concerns) {
              _this.concerns(options.concerns);
            }

            var actions = _this.parentResource().actions;

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
        },
        writable: true,
        configurable: true
      },
      collection: {
        value: function collection(cb) {
          var _this = this;
          if (!this.isResourceScope()) {
            throw new Error(`Can't use collection outside resource(s) scope`);
          }

          this.withScopeLevel("collection", function () {
            _this.scope(_this.parentResource().collectionScope, cb);
          });

          return this;
        },
        writable: true,
        configurable: true
      },
      member: {
        value: function member(cb) {
          var _this = this;
          if (!this.isResourceScope()) {
            throw new Error(`Can't use member outside resource(s) scope`);
          }

          this.withScopeLevel("member", function () {
            if (_this.isShallow()) {
              _this.shallowScope(_this.parentResource().memberScope, cb);
            } else {
              _this.scope(_this.parentResource().memberScope, cb);
            }
          });

          return this;
        },
        writable: true,
        configurable: true
      }
    };

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "new", {
      value: function _new(cb) {
        var _this = this;
        if (!this.isResourceScope()) {
          throw new Error(`Can't use new outside resource(s) scope`);
        }

        this.withScopeLevel("new", function () {
          _this.scope(_this.parentResource().newScope(_this.actionPath("new")), cb);
        });

        return this;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "nested", {
      value: function nested(cb) {
        var _this = this;
        if (!this.isResourceScope()) {
          throw new Error(`Can't use nested outside resource(s) scope`);
        }

        this.withScopeLevel("nested", function () {
          if (_this.isShallow() && _this.shallowNestingDepth() >= 1) {
            _this.shallowScope(_this.parentResource().nestedScope, _this.nestedOptions(), cb);
          } else {
            _this.scope(_this.parentResource().nestedScope, _this.nestedOptions(), cb);
          }
        });

        return this;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "namespace", {

      // Scoping#namespace
      //namespace(path, options = {}, cb) {
      value: (function (_namespace) {
        var _namespaceWrapper = function namespace() {
          return _namespace.apply(this, arguments);
        };

        _namespaceWrapper.toString = function () {
          return _namespace.toString();
        };

        return _namespaceWrapper;
      })(function () {
        var _this = this;
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args = buildArgs.apply(undefined, _to5Helpers.toArray(args));
        if (this.isResourceScope()) {
          this.nested(function () {
            namespace.apply(_this, args);
          });
        } else {
          namespace.apply(this, args);
        }
        return this;
      }),
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "shallow", {
      value: function shallow(cb) {
        return this.scope({ shallow: true }, cb);
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isShallow", {
      value: function isShallow() {
        return this.parentResource() instanceof Resource && this.context.get("shallow");
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "root", {

      // root({ to: 'photos#show' })
      // root('photos#show')
      value: (function (_root) {
        var _rootWrapper = function root() {
          return _root.apply(this, arguments);
        };

        _rootWrapper.toString = function () {
          return _root.toString();
        };

        return _rootWrapper;
      })(function (path) {
        var _this = this;
        var options = arguments[1] === undefined ? {} : arguments[1];
        if (isString(path)) {
          options.to = path;
        } else if (isObject(path) && isEmpty(options)) {
          options = path;
        } else {
          throw new Error("Must be called with a path and/or options");
        }

        if (this.context.isResources()) {
          this.withScopeLevel("root", function () {
            _this.scope(_this.parentResource().path, function () {
              root.call(_this, options);
            });
          });
        } else {
          root.call(this, options);
        }

        return this;
      }),
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "match", {

      // match 'path'
      // match 'path', { to: 'controller#action' }
      // match 'path', 'otherpath', { on: 'member', via: 'get' }
      // match { on: 'member', via: 'get' }
      //match(path, ...rest) {
      value: function match() {
        var _this = this;
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, _to5Helpers.toArray(args));

        var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];


        var to = options.to;
        if (to) {
          if (!/#/.test(to)) {
            options.controller = to;
          }
        }

        if (paths.length === 0 && options.path) {
          paths = [options.path];
        }

        if (!has(options, "anchor")) {
          options.anchor = true;
        }

        if (options.on && !VALID_ON_OPTIONS.includes(options.on)) {
          throw new Error(`Unknown scope ${ options.on } given to :on`);
        }

        var controller = this.context.get("controller");
        var action = this.context.get("action");
        if (controller && action) {
          if (!_to5Helpers.hasOwn.call(options, "to")) options.to = `${ controller }#${ action }`;
        }

        paths.forEach(function (p) {
          var routeOptions = _core.Object.assign(options);
          routeOptions.path = p;
          var pathWithoutFormat = p.replace(/\(\.:format\)$/, "");
          if (_this.isUsingMatchShorthand(pathWithoutFormat, routeOptions)) {
            if (!_to5Helpers.hasOwn.call(routeOptions, "to")) routeOptions.to = pathWithoutFormat.replace(/^\//g, "").replace(/\/([^\/]*)$/, "#$1");
            routeOptions.to = routeOptions.to.replace(/-/g, "_");
          }
          _this.decomposedMatch(p, routeOptions);
        });

        return this;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isUsingMatchShorthand", {
      value: function isUsingMatchShorthand(path, options) {
        return path && !(options.to || options.action) && /\//.test(path);
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "decomposedMatch", {
      value: function decomposedMatch(path, options) {
        var _this = this;
        var on = options.on;
        if (on) {
          delete options.on;
          this[on](function () {
            _this.decomposedMatch(path, options);
          });
        } else {
          switch (this.context.scopeLevel) {
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
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "shallowScope", {

      //shallowScope(path, options = {}, cb) {
      value: function shallowScope() {
        var _ref;
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _buildArgs$apply = buildArgs.apply(undefined, _to5Helpers.toArray(args));

        var _buildArgs$apply2 = _to5Helpers.slicedToArray(_buildArgs$apply, 3);

        var paths = _buildArgs$apply2[0];
        var options = _buildArgs$apply2[1];
        var cb = _buildArgs$apply2[2];
        var scope = {
          as: this.context.get("shallow_prefix"),
          path: this.context.get("shallow_path")
        };
        this.context = this.context.create(scope);
        (_ref = this).scope.apply(_ref, _to5Helpers.toArray(paths).concat([options, cb]));
        this.context = this.context.parent;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "setMemberMappingsForResource", {
      value: function setMemberMappingsForResource() {
        var _this = this;
        this.member(function () {
          var actions = _this.parentResource().actions;
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
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "applyCommonBehaviorFor", {
      value: function applyCommonBehaviorFor(method, resources, options, cb) {
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

        if (this.isResourceScope()) {
          this.nested(function () {
            _this[method](resources.pop(), options, cb);
          });
          return true;
        }

        _core.Object.keys(options).forEach(function (k) {
          if (isRegExp(options[k])) {
            (!_to5Helpers.hasOwn.call(options, "constraints") && (options.constraints = {}), options.constraints)[k] = options[k];
            delete options[k];
          }
        });

        var scopeOptions = {};
        _core.Object.keys(options).forEach(function (k) {
          if (!RESOURCE_OPTIONS.includes(k)) {
            scopeOptions[k] = options[k];
            delete options[k];
          }
        });
        if (_core.Object.keys(scopeOptions).length) {
          this.scope(scopeOptions, function () {
            _this[method](resources.pop(), options, cb);
          });
          return true;
        }

        if (!this.isActionOptions(options)) {
          if (this.isScopeActionOptions()) {
            _core.Object.assign(options, this.scopeActionOptions());
          }
        }

        return false;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "resourceScope", {
      value: function resourceScope(kind, resource, cb) {
        var _this = this;
        resource.shallow = this.context.get("shallow");
        this.context = this.context.create({ scope_level_resource: resource });
        this.nesting.push(resource);

        this.withScopeLevel(kind, function () {
          _this.scope(_this.parentResource().resourceScope, cb);
        });

        this.nesting.pop();
        this.context = this.context.parent;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "nestedOptions", {
      value: function nestedOptions() {
        var parentResource = this.parentResource();
        var options = {
          as: parentResource.memberName
        };
        if (this.isParamConstraint()) {
          options.constraints = _to5Helpers.defineProperty({}, parentResource.nestedParam, this.paramConstraint());
        }
        return options;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isParamConstraint", {
      value: function isParamConstraint() {
        var constraints = this.context.get("constraints");
        return constraints && constraints[this.parentResource().param];
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "paramConstraint", {
      value: function paramConstraint() {
        return this.context.get("constraints")[this.parentResource().param];
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "withScopeLevel", {
      value: function withScopeLevel(kind, cb) {
        if (isFunction(cb)) {
          // begin, new
          this.context = this.context.createLevel(kind);

          cb.call(this);

          // end, reroll
          this.context = this.context.parent;
        }
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "parentResource", {
      value: function parentResource() {
        return this.context.get("scope_level_resource");
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "shallowNestingDepth", {
      value: function shallowNestingDepth() {
        return this.nesting.filter(function (r) {
          return r.isShallow();
        }).length;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isResourceScope", {
      value: function isResourceScope() {
        return this.context.isResourceScope();
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isNestedScope", {
      value: function isNestedScope() {
        return this.context.isNested();
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isActionOptions", {
      value: function isActionOptions(options) {
        return options.only || options.except;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isScopeActionOptions", {
      value: function isScopeActionOptions() {
        var options = this.context.get("options");
        return options && (options.only || options.except);
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "scopeActionOptions", {
      value: function scopeActionOptions() {
        var options = this.context.get("options");
        var o = {};
        _core.Object.keys(options).forEach(function (k) {
          if (k === "only" || k === "except") {
            o[k] = options[k];
          }
        });
        return o;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isResourceMethodScope", {
      value: function isResourceMethodScope() {
        return this.context.isResourceMethodScope();
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "isCanonicalAction", {
      value: function isCanonicalAction(action) {
        return this.isResourceMethodScope() && CANONICAL_ACTIONS.includes(action);
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "pathForAction", {
      value: function pathForAction(action, path) {
        if (path && this.isCanonicalAction(action)) {
          return this.context.get("path");
        } else {
          var scopePath = this.context.get("path");
          var actionPath = this.actionPath(action, path);
          return compact([scopePath, actionPath]).join("/");
        }
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "actionPath", {
      value: function actionPath(name, path) {
        return path || this.context.get("path_names")[name] || name;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "addRoute", {
      value: function addRoute(action, options) {
        var path = normalizePath(this.pathForAction(action, options.path));
        delete options.path;

        action = String(action);
        if (/^[\w\-\/]+$/.test(action)) {
          if (!action.includes("/")) {
            if (!_to5Helpers.hasOwn.call(options, "action")) options.action = action.replace(/-/g, "_");
          }
        } else {
          action = null;
        }

        var as = this.nameForAction(options.as, action);
        delete options.as;

        var mapping = Mapping.build(this.context, this.set, path, as, options);
        // mapping.toRoute();
        this.set.addRoute(mapping);
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "prefixNameForAction", {
      value: function prefixNameForAction(as, action) {
        var prefix = undefined;
        if (as) {
          prefix = as;
        } else if (!this.isCanonicalAction(action)) {
          prefix = action;
        }

        if (prefix && prefix !== "/") {
          //return normalizePath(prefix.replace(/-/g, '_'));
          return prefix.replace(/-/g, "_");
        }

        return prefix;
      },
      writable: true,
      configurable: true
    });

    _to5Helpers.defineProperty(_to5Helpers$prototypeProperties, "nameForAction", {
      value: function nameForAction(as, action) {
        var prefix = this.prefixNameForAction(as, action);
        var namePrefix = this.context.get("as");
        var collectionName = undefined;
        var memberName = undefined;
        var parentResource = this.parentResource();
        if (parentResource) {
          if (!(as || action)) {
            return null;
          }

          collectionName = parentResource.collectionName;
          memberName = parentResource.memberName;
        }

        var actionName = this.context.actionName(namePrefix, prefix, collectionName, memberName);
        var candidate = compact(actionName).join("_");

        if (candidate) {
          if (!as) {
            if (/^[_a-zA-Z]/.test(candidate) && !has(this.set.namedRoutes, candidate)) {
              return candidate;
            }
          } else {
            return candidate;
          }
        }
      },
      writable: true,
      configurable: true
    });

    return _to5Helpers$prototypeProperties;
  })());

  return Resources;
})();

module.exports = Resources;