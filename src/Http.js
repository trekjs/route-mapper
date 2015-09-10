import METHODS from 'methods';
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
  let v = m.replace('-', '');
  let name = v === 'delete' ? 'del' : v;
  Http.prototype[v] = eval(`(function ${name}() {
    return this._mapMethod('${m}', arguments);
  })`);
});

export default Http;
