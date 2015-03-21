import _ from 'lodash-node';
import delegate from 'delegates';
import pathToRegexp from 'path-to-regexp';
import * as utils from './utils';

class Route {

  constructor($scope, path, options) {
    this.build($scope, path, options);

    this.path = this.normalizePath(path, this.format);
    this.pathWithoutFormat = this.path.replace(/\.:format\??$/, '');

    let ast = pathToRegexp(this.path);
    let pathParams = ast.keys;

    options = this.normalizeOptions(options, this.format, pathParams, ast, $scope.get('module'));

  }

  // @private
  build($scope, path, options) {
    _.defaults(options, $scope.get('options'));

    this.defaultController = options.controller || $scope.get('controller');
    this.defaultAction = options.action || $scope.get('action');

    this.defaults = _.defaults(options.defaults || {}, $scope.get('defaults') || {});
    this.$scope = $scope;
    this.options = options;

    // cleanup options
    delete options.only;
    delete options.except;
    delete options.shallow_path;
    delete options.shallow_prefix;
    delete options.shallow;
    delete options.defaults;
    delete options.controller;
    delete options.action;
  }

  get type() {
    return this.$scope.scopeLevel;
  }

  get controller() {
    return this._controller || this.defaultController || ':controller';
  }

  get action() {
    return this._action || this.defaultAction || ':action';
  }

  get verb() {
    return _.isArray(this.options.verb) ? this.options.verb : [this.options.verb];
  }

  normalizePath(path, format) {
    path = utils.normalizePath(path);
    if (format === true) {
      return `${path}.:format`
    } else if (this.isOptionalFormat(path, format)) {
      return `${path}.:format?`
    } else {
      return path;
    }
  }

  isOptionalFormat(path, format) {
    return format !== false && !/:format\??$/.test(path) && !(path[path.length - 1] === '/');
  }

  normalizeOptions(options, formatted, pathParams, pathAst, modyoule) {
    if (pathParams.filter(p => {
        return p.name === 'controller'
      }).length) {
      if (modyoule) {
        throw new Error(`'controller' segment is not allowed within a namespace block`);
      }
      // Add a default constraint for :controller path segments that matches namespaced
      // controllers with default routes like :controller/:action/:id(.:format), e.g:
      // GET /admin/products/show/1
      // => { controller: 'admin/products', action: 'show', id: '1' }
      if (!_.has(options, 'controller')) {
        options.controller = /.+?/;
      }
    }

    let toEndpoint = utils.splitTo(this.to);
    this._controller = toEndpoint[0] || this.defaultController;
    this._action = toEndpoint[1] || this.defaultAction;
    this._controller = this.addControllerModule(this._controller, modyoule);
    options = _.assign(options, this.checkControllerAndAction(pathParams, this._controller, this._action));
    return options;
  }

  checkControllerAndAction(pathParams, controller, action) {
    let hash = this.checkPart('controller', controller, pathParams, {}, (part) => {
      if (_.isRegExp(part)) return part;
      if (/^[a-z_0-9][a-z_0-9\/]*$/i.exec(part)) return part;
      throw new Error(`'${part}' is not a supported controller name. This can lead to potential routing problems.`);
    });
    this.checkPart('action', action, pathParams, hash, (part) => {
      return part;
    });
    return hash;
  }

  checkPart(name, part, pathParams, hash, cb) {
    if (part) {
      hash[name] = cb(part);
    } else {
      if (!pathParams.filter(p => {
          return p.name === name
        }).length) {
        throw new Error(`Missing :${name} key on routes definition, please check your routes.`);
      }
    }
    return hash;
  }

  addControllerModule(controller, modyoule) {
    if (modyoule && !_.isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else {
        if (/^\//.test(modyoule)) {
          modyoule = modyoule.substr(1);
        }
        return _.compact([modyoule, controller]).join('/');
      }
    }
    return controller;
  }

}

// Delegates
delegate(Route.prototype, 'options')
  .getter('format')
  .getter('as')
  .getter('to')

export default Route;
