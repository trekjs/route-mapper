import has from 'lodash-node/modern/object/has';
import { SINGLETON_ACTIONS } from 'actions';
import { plural } from 'pluralize';
import Resource from './resource';

class SingletonResource extends Resource {

  constructor(entities, options) {
    super(entities, options);
    this.as = null;
    this.controller = options.controller || this.plural;
    this.as = options.as;
  }

  get defaultActions() {
    return SINGLETON_ACTIONS;
  }

  get plural() {
    if (!has(this, '_plural')) this._plural = plural(this.name);
    return this._plural;
    //return  this._plural ?= plural(this.name);
  }

  get singular() {
    if (!has(this, '_singular')) this._singular = this.name;
    return this._singular;
    //return this._singular ?= this.name;
  }

  get memberName() {
    return this.singular;
  }

  get collectionName() {
    return this.singular;
  }

  get memberScope() {
    return this.path;
  }

  get nestedScope() {
    return this.path;
  }

}

export default SingletonResource;
