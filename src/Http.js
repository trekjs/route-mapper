import {
  parseArgs
}
from './utils';

class Http {

  _mapMethod(method, args) {
    let [paths, opts, cb] = parseArgs(...args);
    opts.verb = method;
    return this.match(paths, opts, cb)
  }

}

[
  'get',
  'post',
  'put',
  'patch',
  'delete'
].forEach((m) => {
  Http.prototype[m] = function() {
    return this._mapMethod(m, arguments);
  };
});

export default Http;
