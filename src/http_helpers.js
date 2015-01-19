import {buildArgs} from './utils';

class HttpHelpers {

  // get('bacon', { to: 'food#bacon' })
  get(...args) {
    return this._map_method('get', args);
  }

  // post('bacon', { to: 'food#bacon' })
  post(...args) {
    return this._map_method('post', args);
  }

  // patch('bacon', { to: 'food#bacon' })
  patch(...args) {
    return this._map_method('patch', args);
  }

  // put('bacon', { to: 'food#bacon' })
  put(...args) {
    return this._map_method('put', args);
  }

  // delete('bacon', { to: 'food#bacon' })
  delete(...args) {
    return this._map_method('delete', args);
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
