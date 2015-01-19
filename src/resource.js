import isString from 'lodash-node/modern/lang/isString';
import {ACTIONS} from 'actions';
import {plural, singular} from 'pluralize';

class Resource {

  constructor(entities, options) {
    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || 'id';
    this.options = options;
    this.shallow = false;
  }

  get defaultActions() {
    return ACTIONS;
  }

  get actions() {
    let only = this.options.only;
    let except = this.options.except;
    if (isString(only)) only = [only];
    if (isString(except)) except = [except];
    if (only && only.length) {
      return only;
    } else if (except && except.length) {
      return this.defaultActions.filter((a) => except.indexOf(a) < 0);
    }
    return this.defaultActions;
  }

  get name() {
    return this.as || this._name;
  }

  get plural() {
    return this._plural ?= this.name;
  }

  get singular() {
    return this._singular ?= singular(this.name);
  }

  get memberName() {
    return this.singular;
  }

  get collectionName() {
    return this.singular === this.plural ? `${this.plural}_index` : this.plural;
  }

  get resourceScope() {
    return { controller: this.controller };
  }

  get collectionScope() {
    return this.path;
  }

  get memberScope() {
    return `${this.path}/:${this.param}`;
  }

  get shallowScope() {
    return this.memberScope;
  }

  get nestedParam() {
    //return (this.param && this.param !== 'id') ? this.param : this.singular + '_' + this.param;
    return `${this.singular}_${this.param}`;
  }

  get nestedScope() {
    return `${this.path}/:${this.nestedParam}`;
  }

  newScope(newPath) {
    return `${this.path}/${newPath}`;
  }

  isShallow() {
    return this.shallow;
  }

}

export default Resource;
