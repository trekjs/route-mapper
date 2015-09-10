import METHODS from 'methods';
import camelCase from 'lodash/string/camelCase';
import trim from 'lodash/string/trim';
import { parseArgs } from './utils';

class Http {

  _mapMethod(method, args) {
    let [paths, opts, cb] = parseArgs(...args);
    opts.verb = method;
    return this.match(paths, opts, cb)
  }

  static get METHODS() {
    return METHODS;
  }

}

METHODS.forEach((m) => {
  let name = m === 'delete' ? 'del' : m.replace('-', '');
  Http.prototype[m.replace('-', '')] = eval(`(function ${name}() {
    return this._mapMethod('${m}', arguments);
  })`);
});

export default Http;
