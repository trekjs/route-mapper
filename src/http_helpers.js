import {buildArgs} from './utils';

class HttpHelpers {

  // get('bacon', { to: 'food#bacon' })
  get() {
    return this._map_method('get', arguments);
  }

  // post('bacon', { to: 'food#bacon' })
  post() {
    return this._map_method('post', arguments);
  }

  // patch('bacon', { to: 'food#bacon' })
  patch() {
    return this._map_method('patch', arguments);
  }

  // put('bacon', { to: 'food#bacon' })
  put() {
    return this._map_method('put', arguments);
  }

  // delete('bacon', { to: 'food#bacon' })
  delete() {
    return this._map_method('delete', arguments);
  }

  // private
  _map_method(method, args) {
    let [paths, options, cb] = buildArgs(...args);
    options.via = method;
    this.match(paths, options, cb);
    return this;
  }

}

export default HttpHelpers;
