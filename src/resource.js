import has from 'lodash-node/modern/object/has';
import isString from 'lodash-node/modern/lang/isString';
import camelCase from 'lodash-node/modern/string/camelCase';
import { plural, singular } from 'pluralize';
import { ACTIONS } from 'actions';

/**
 * Resource
 *
 * @class Resource
 */
class Resource {

  constructor(entities, options, camelCase) {
    this._name = String(entities);
    this.path = options.path || this._name;
    this.controller = options.controller || this._name;
    this.as = options.as;
    this.param = options.param || 'id';
    this.shallow = false;
    this.options = options;
    this.camelCase = camelCase;
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
    return isString(this.as) ? this.as : this._name;
  }

  get plural() {
    if (!has(this, '_plural')) this._plural = plural(this.name);
    return this._plural;
  }

  get singular() {
    if (!has(this, '_singular')) this._singular = singular(this.name);
    return this._singular;
  }

  get memberName() {
    return this.singular;
  }

  get collectionName() {
    let name = '';
    if (!this.plural) {
      name = 'index';
    } else if (this.singular === this.plural) {
      name = `${this.plural}_index`;
    } else {
      name = this.plural;
    }
    return this.camelCase ? camelCase(name) : name;
  }

  get resourceScope() {
    return {
      controller: this.controller
    };
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
    let param = this.param !== 'id' ? this.param : this.singular + '_' + this.param;
    return this.camelCase ? camelCase(param) : param;
  }

  get nestedScope() {
    return `${this.path}/:${this.nestedParam}`;
  }

  get isShallow() {
    return this.shallow;
  }

  newScope(newPath) {
    return `${this.path}/${newPath}`;
  }

}

export default Resource;
