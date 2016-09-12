const { parseArgs } = require('./util')

class Http {

  get () {
    return this._mapMethod('get', ...arguments)
  }

  post () {
    return this._mapMethod('post', ...arguments)
  }

  put () {
    return this._mapMethod('put', ...arguments)
  }

  delete () {
    return this._mapMethod('delete', ...arguments)
  }

  connect () {
    return this._mapMethod('connect', ...arguments)
  }

  head () {
    return this._mapMethod('head', ...arguments)
  }

  patch () {
    return this._mapMethod('patch', ...arguments)
  }

  options () {
    return this._mapMethod('options', ...arguments)
  }

  trace () {
    return this._mapMethod('trace', ...arguments)
  }

  _mapMethod (verb, ...args) {
    args = parseArgs(...args)
    args[1].verb = verb
    return this.match(...args[0], args[1], args[2])
    // return this.match(...args)
  }

}

module.exports = Http
