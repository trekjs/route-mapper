import has from 'lodash-node/modern/object/has';

/**
 * Options keywords.
 *
 * @const
 * @static
 * @public
 */
export const OPTIONS = [
  'path',
  'shallowPath',
  'as',
  'shallowPrefix',
  'module',
  'controller',
  'action',
  'pathNames',
  'shallow',
  'constraints',
  'defaults',
  'options'
];

/**
 * Resource Scopes.
 *
 * @const
 * @static
 * @public
 */
export const RESOURCE_SCOPES = ['resource', 'resources'];

/**
 * Resource Method Scopes.
 *
 * @const
 * @static
 * @public
 */
export const RESOURCE_METHOD_SCOPES = ['collection', 'member', 'new'];

/**
 * @class Scope
 * @public
 */
export default class Scope {

  constructor(current, parent = {}, scopeLevel = null) {
    this.current = current;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  get options() {
    return OPTIONS;
  }

  get isNested() {
    return this.scopeLevel === 'nested';
  }

  get isResources() {
    return this.scopeLevel === 'resources';
  }

  get isResourceScope() {
    return RESOURCE_SCOPES.includes(this.scopeLevel);
  }

  get isResourceMethodScope() {
    return RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
  }

  actionName(namePrefix, prefix, collectionName, memberName) {
    switch (this.scopeLevel) {
      case 'nested':
        return [namePrefix, prefix];
      case 'collection':
        return [prefix, namePrefix, collectionName];
      case 'new':
        return [prefix, 'new', namePrefix, memberName];
      case 'member':
        return [prefix, namePrefix, memberName];
      case 'root':
        return [namePrefix, collectionName, prefix];
      default:
        return [namePrefix, memberName, prefix];
    }
  }

  get(key, value) {
    if (has(this.current, key)) return this.current[key];
    if (has(this.parent, key)) return this.parent[key];
    if (this.parent instanceof Scope) return this.parent.get(key, value);
    return value;
  }

  set(key, value) {
    this.current[key] = value;
  }

  create(current) {
    return new Scope(current, this, this.scopeLevel);
  }

  createLevel(level) {
    return new Scope(this, this, level);
  }

}
