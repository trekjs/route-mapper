"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var isNumber = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isNumber"));

var isString = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isString"));

var isRegExp = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isRegExp"));

var isObject = _babelHelpers.interopRequire(require("lodash-node/modern/lang/isObject"));

var compact = _babelHelpers.interopRequire(require("lodash-node/modern/array/compact"));

var assign = _babelHelpers.interopRequire(require("lodash-node/modern/object/assign"));

var originalDebug = _babelHelpers.interopRequire(require("debug"));

var pathToRegexp = _babelHelpers.interopRequire(require("path-to-regexp"));

var _normalizePath = require("./utils").normalizePath;

var URL_OPTIONS = require("./const").URL_OPTIONS;

var debug = originalDebug("route-mapper:mapping");

var Mapping = (function () {
  function Mapping(context, set, path, defaults, as, options) {
    _babelHelpers.classCallCheck(this, Mapping);

    this.requirements = {};
    this.conditions = {};
    this.defaults = defaults;
    this.set = set;

    this.to = options.to;
    this.default_controller = options.controller || context.get("controller");
    this.default_action = options.action || context.get("action");

    this.as = as;
    this.anchor = options.anchor;
    delete options.to;
    delete options.controller;
    delete options.action;
    delete options.anchor;

    var formatted = options.format;
    var via = options.via;
    if (isString(via)) {
      via = [via];
    }
    var optionsConstraints = options.constraints;
    delete options.format;
    delete options.via;
    delete options.constraints;

    path = this.normalizePath(path, formatted);

    this.format = formatted;
    this.via = via;
    this.pathWithForamt = path;
    this.path = path.replace(/\.:format\??$/, "");
    this.type = context.scopeLevel;

    var ast = pathToRegexp(path);
    var pathParams = ast.keys;

    options = this.normalizeOptions(options, formatted, pathParams, ast, context.get("module"));

    var contextConstraints = context.get("constraints");
    if (contextConstraints) {
      this.splitConstraints(ast.keys, contextConstraints);
    }

    var constraints = this.constraints(options, pathParams);

    this.splitConstraints(pathParams, constraints);

    if (isObject(optionsConstraints)) {
      this.splitConstraints(pathParams, optionsConstraints);
      for (var _iterator = _core.$for.getIterator(_core.Object.keys(optionsConstraints)), _step; !(_step = _iterator.next()).done;) {
        var k = _step.value;

        var v = optionsConstraints[k];
        if (URL_OPTIONS.includes(k) && (isString(v) || isNumber(v))) {
          var _defaults = this.defaults;
          var _k = k;
          if (!_babelHelpers.hasOwn.call(_defaults, _k)) _defaults[_k] = v;
        }
      }
    }

    this.normalizeFormat(formatted);

    this.conditions.pathInfo = path;
    this.conditions.parsedPathInfo = ast;

    this.addRequestMethod(this.via, this.conditions);
    this.normalizeDefaults(options);

    debug("route: %s %s %s %s %s", this.type, this.as, this.via, this.pathWithForamt, this.controller + "#" + this.action);
  }

  _babelHelpers.prototypeProperties(Mapping, {
    build: {
      value: function build(context, set, path, as, options) {
        var contextOptions = context.get("options");
        if (contextOptions) {
          options = assign({}, contextOptions, options);
        }

        delete options.only;
        delete options.except;
        delete options.shallow_path;
        delete options.shallow_prefix;
        delete options.shallow;

        var defaults = assign({}, context.get("defaults") || {}, options.defaults || {});
        delete options.defaults;

        return new Mapping(context, set, path, defaults, as, options);
      },
      writable: true,
      configurable: true
    }
  }, {
    controller: {
      get: function () {
        return this._controller || this.default_controller || ":controller";
      },
      configurable: true
    },
    action: {
      get: function () {
        return this._action || this.default_action || ":action";
      },
      configurable: true
    },
    name: {
      get: function () {
        return this.as;
      },
      configurable: true
    },
    splitConstraints: {
      value: function splitConstraints(pathParams, constraints) {
        var _this = this;

        _core.Object.keys(constraints).forEach(function (k) {
          var v = constraints[k];
          if (pathParams.filter(function (p) {
            return p.name === k;
          }).length || k === "controller") {
            _this.requirements[k] = v;
          } else {
            _this.conditions[k] = v;
          }
        });
      },
      writable: true,
      configurable: true
    },
    constraints: {
      value: function constraints(options, pathParams) {
        var constraints = {};
        var requiredDefaults = [];
        _core.Object.keys(options).forEach(function (k) {
          var v = options[k];
          if (isRegExp(v)) {
            constraints[k] = v;
          } else {
            if (!pathParams.filter(function (p) {
              return p.name === k;
            }).length) {
              requiredDefaults.push(k);
            }
          }
        });
        this.conditions.requiredDefaults = requiredDefaults;
        return constraints;
      },
      writable: true,
      configurable: true
    },
    normalizeOptions: {
      value: function normalizeOptions(options, formatted, pathParams, pathAst, modyoule) {
        if (pathParams.filter(function (p) {
          return p.name === "controller";
        }).length) {
          if (modyoule) {
            throw new Error(`'controller' segment is not allowed within a namespace block`);
          }
          var _options = options;
          if (!_babelHelpers.hasOwn.call(_options, "controller")) _options.controller = /.+?/;
        }

        if (this.to) {
          var toEndpoint = splitTo(this.to);
          this._controller = toEndpoint[0] || this.default_controller;
          this._action = toEndpoint[1] || this.default_action;
          this._controller = this.addControllerModule(this.controller, modyoule);
          options = assign(options, this.checkControllerAndAction(pathParams, this.controller, this.action));
        }
        return options;
      },
      writable: true,
      configurable: true
    },
    addRequestMethod: {
      value: function addRequestMethod(via, conditions) {
        if (via[0] === "all") {
          return;
        }if (!via.length) {
          throw new Error(`You should not use the \`match\` method in your router without specifying an HTTP method.\n \
        If you want to expose your action to both GET and POST, add \`via: ['get', 'post']\` option.\n \
        If you want to expose your action to GET, use \`get\` in the router:\n \
          Instead of: match "controller#action"\n \
          Do: get "controller#action`);
        }
        conditions.requestMethod = via.map(function (m) {
          return m.replace(/_/g, "-");
        });
      },
      writable: true,
      configurable: true
    },
    normalizeFormat: {
      value: function normalizeFormat(formatted) {
        if (formatted === true) {
          var _requirements = this.requirements;
          if (!_babelHelpers.hasOwn.call(_requirements, "format")) _requirements.format = /.+/;
        } else if (isRegExp(formatted)) {
          this.requirements.format = formatted;
          this.defaults.format = null;
        } else if (isString(formatted)) {
          this.requirements.format = new RegExp(formatted);
          this.defaults.format = formatted;
        }
      },
      writable: true,
      configurable: true
    },
    normalizePath: {
      value: function normalizePath(path, format) {
        path = _normalizePath(path);
        if (format === true) {
          return `${ path }.:format`;
        } else if (this.isOptionalFormat(path, format)) {
          return `${ path }.:format?`;
        } else {
          return path;
        }
      },
      writable: true,
      configurable: true
    },
    isOptionalFormat: {
      value: function isOptionalFormat(path, format) {
        return format !== false && !/:format\??$/.test(path) && !(path[path.length - 1] === "/");
      },
      writable: true,
      configurable: true
    },
    normalizeDefaults: {
      value: function normalizeDefaults(options) {
        var _this = this;

        _core.Object.keys(options).forEach(function (k) {
          var v = options[k];
          if (!isRegExp(v)) {
            _this.defaults[k] = v;
          }
        });
      },
      writable: true,
      configurable: true
    },
    checkControllerAndAction: {
      value: function checkControllerAndAction(pathParams, controller, action) {
        var hash = this.checkPart("controller", controller, pathParams, {}, function (part) {
          if (isRegExp(part)) return part;
          if (/^[a-z_0-9][a-z_0-9\/]*$/i.exec(part)) return part;
          throw new Error(`'${ part }' is not a supported controller name. This can lead to potential routing problems.`);
        });
        this.checkPart("action", action, pathParams, hash, function (part) {
          return part;
        });
        return hash;
      },
      writable: true,
      configurable: true
    },
    checkPart: {
      value: function checkPart(name, part, pathParams, hash, cb) {
        if (part) {
          hash[name] = cb(part);
        } else {
          if (!pathParams.filter(function (p) {
            return p.name === name;
          }).length) {
            throw new Error(`Missing :${ name } key on routes definition, please check your routes.`);
          }
        }
        return hash;
      },
      writable: true,
      configurable: true
    },
    addControllerModule: {
      value: function addControllerModule(controller, modyoule) {
        if (modyoule && !isRegExp(controller)) {
          if (/^\//.test(controller)) {
            return controller.substr(1);
          } else {
            if (/^\//.test(modyoule)) {
              modyoule = modyoule.substr(1);
            }
            return compact([modyoule, controller]).join("/");
          }
        }
        return controller;
      },
      writable: true,
      configurable: true
    },
    toRoute: {
      value: function toRoute() {
        return [/*app, */this.conditions, this.requirements, this.defaults, this.as, this.anchor];
      },
      writable: true,
      configurable: true
    }
  });

  return Mapping;
})();

var splitTo = function (to) {
  if (/#/.test(to)) {
    return to.split("#");
  }
  return [];
};

module.exports = Mapping;