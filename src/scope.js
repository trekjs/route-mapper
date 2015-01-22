import has from 'lodash-node/modern/object/has';

const OPTIONS = [
  'path', 'shallow_path', 'as', 'shallow_prefix', 'module',
  'controller', 'action', 'path_names', 'constraints',
  'shallow', /*'blocks',*/ 'defaults', 'options'
];

const RESOURCE_SCOPES = ['resource', 'resources'];
const RESOURCE_METHOD_SCOPES = ['collection', 'member', 'new'];

class Scope {

  constructor(hash, parent = {}, scopeLevel = null) {
    this.hash = hash;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  get options() {
    return OPTIONS;
  }

  isNested() {
    return this.scopeLevel === 'nested';
  }

  isResources() {
    return this.scopeLevel === 'resources';
  }

  isResourceScope() {
    return RESOURCE_SCOPES.includes(this.scopeLevel);
  }

  isResourceMethodScope() {
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

  // maybe should use Proxy
  get(key, value = null) {
    if (has(this.hash, key)) { return this.hash[key]; }
    if (has(this.parent, key)) { return this.parent[key]; }
    if (this.parent instanceof Scope) { return this.parent.get(key, value); }
    return value;
  }

  set(key, value) {
    this.hash[key] = value;
  }

  create(hash) {
    return new Scope(hash, this, this.scopeLevel);
  }

  createLevel(level) {
    return new Scope(this, this, level);
  }
}

export default Scope;
