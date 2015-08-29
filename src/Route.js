/*!
 * route-mapper - Route
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import _ from 'lodash';
import _debug from 'debug';
import pathToRegexp from 'path-to-regexp';
import utils from './utils';

const debug = _debug('route-mapper:route');

/**
 * Route
 *
 * @class
 */
class Route {

  constructor($scope, path, options) {
    _.defaults(options, $scope.get('options'));

    this.defaultController = options.controller || $scope.get('controller');
    this.defaultAction = options.action || $scope.get('action');
    this.$scope = $scope;
    this.path = path;
    this.options = options;
    this.camelCase = options.camelCase;

    // cleanup options
    delete options.only;
    delete options.except;
    delete options.action;

    let toEndpoint = utils.splitTo(options.to);
    this._controller = toEndpoint[0] || this.defaultController;
    this._action = toEndpoint[1] || this.defaultAction;
    this._controller = this.addControllerModule(this._controller, $scope.get('module'));
  }

  get as() {
    let _as = this.options.as || '';
    return this.camelCase ? _.camelCase(_as) : _as;
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

  addControllerModule(controller, modyoule) {
    if (modyoule && !_.isRegExp(controller)) {
      if (/^\//.test(controller)) {
        return controller.substr(1);
      } else if (/^\//.test(modyoule)) {
        modyoule = modyoule.substr(1);
      }
      return _.compact([modyoule, controller]).join('/');
    }
    return controller;
  }

}

export default Route;
