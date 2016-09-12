const { normalize } = require('path')
const { plural, singular } = require('pluralize')
const Http = require('./Http')
const { parseArgs } = require('./util')

const REST_MAP = {
  index: 'get',
  create: 'post',
  new: 'get',
  edit: 'get',
  show: 'get',
  update: ['patch', 'put'],
  destroy: 'delete'
}

const VALID_ON_OPTIONS = [
  'new',
  'collection',
  'member'
]

class Mapper extends Http {

  constructor (options = {}, parent) {
    super()

    this.options = options
    this.parent = parent
    this.children = []
    this.routes = []
  }

  get path () {
    return this.options.path || '/'
  }

  get apiOnly () {
    return this.options.api === true
  }

  scope () {}

  mount () {}

  controller () {}

  /**
   * @param {...Array} paths
   * @param {Object} options
   * @param {Function} callback
   */

  match () {
    const [paths, options, cb] = parseArgs(...arguments)
    this._mapMatch(paths, options)
    if (cb) {
      const opts = Object.assign({}, options)
      const mapper = new Mapper(opts, this)
      this.children.push(mapper)
      if (cb) {
        cb(mapper)
      }
    }
    return this
  }

  _mapMatch (paths, options) {
    for (let i = 0, l = paths.length; i < l; ++i) {
      this._decomposedMatch(paths[i], options)
    }
  }

  _decomposedMatch (path, options) {
    this.routes.push({
      path,
      options
    })
  }

  root () {}

  resource () {
    const [paths, options, cb] = parseArgs(...arguments)

    for (let i = 0, l = paths.length; i < l; ++i) {
      const opts = Object.assign({}, options)
      let path = paths[i]
      opts.name = singular(path)
      if (!opts.path) opts.path = opts.name
      if (!opts.controller) opts.controller = opts.name
      if (!opts.param) opts.param = ':id'
      if (!opts.param.startsWith(':')) opts.param = ':' + opts.param
      opts.pathNames = Object.assign({
        new: 'new',
        edit: 'edit'
      }, opts.pathNames)

      opts.scope = 'resource'
      opts.api = !!this.options.api

      // api only
      let actions = ['show', 'create', 'update', 'destroy']
      if (!opts.api) {
        actions.push('new', 'edit')
      }
      if (opts.only) {
        const only = Array.isArray(opts.only) ? opts.only : [opts.only]
        actions = only.filter(a => actions.includes(a))
      } else if (opts.except) {
        const except = Array.isArray(opts.except) ? opts.except : [opts.except]
        actions = actions.filter(a => !except.includes(a))
      }

      const mapper = new Mapper(opts, this)
      this.children.push(mapper)

      const controller = opts.controller
      for (let j = 0, k = actions.length; j < k; ++j) {
        const action = actions[j]
        let prefix = opts.path
        let verbs = REST_MAP[action]
        if (verbs && !Array.isArray(verbs)) {
          verbs = [verbs]
        }

        const pathName = opts.pathNames[action] || ''
        if (pathName) {
          prefix += '/' + pathName
        }

        for (let m = 0, n = verbs.length; m < n; ++m) {
          const verb = verbs[m]
          mapper[verb](prefix, Object.assign(
            {},
            opts,
            {
              action,
              controller
            }
          ))
        }
      }

      if (cb) {
        cb(mapper)
      }
    }
  }

  resources () {
    const [paths, options, cb] = parseArgs(...arguments)

    for (let i = 0, l = paths.length; i < l; ++i) {
      const opts = Object.assign({}, options)
      let path = paths[i]
      opts.name = plural(path)
      if (!opts.path) opts.path = opts.name
      if (!opts.controller) opts.controller = opts.name
      if (!opts.param) opts.param = ':id'
      if (!opts.param.startsWith(':')) opts.param = ':' + opts.param
      opts.pathNames = Object.assign({
        new: 'new',
        edit: 'edit'
      }, opts.pathNames)

      opts.scope = 'resources'
      opts.api = !!this.options.api

      // api only
      let actions = ['index', 'create', 'show', 'update', 'destroy']
      if (!opts.api) {
        actions.push('new', 'edit')
      }
      if (opts.only) {
        const only = Array.isArray(opts.only) ? opts.only : [opts.only]
        actions = only.filter(a => actions.includes(a))
      } else if (opts.except) {
        const except = Array.isArray(opts.except) ? opts.except : [opts.except]
        actions = actions.filter(a => !except.includes(a))
      }

      const mapper = new Mapper(opts, this)
      this.children.push(mapper)

      const controller = opts.controller
      for (let j = 0, k = actions.length; j < k; ++j) {
        const action = actions[j]
        let prefix = opts.path
        let verbs = REST_MAP[action]
        if (verbs && !Array.isArray(verbs)) {
          verbs = [verbs]
        }

        if ('show update destroy edit'.includes(action)) {
          prefix += '/' + opts.param
        }

        const pathName = opts.pathNames[action] || ''
        if (pathName) {
          prefix += '/' + pathName
        }

        for (let m = 0, n = verbs.length; m < n; ++m) {
          const verb = verbs[m]
          mapper[verb](prefix, Object.assign(
            {},
            opts,
            {
              action,
              controller
            }
          ))
        }
      }

      if (cb) {
        cb(mapper)
      }
    }

  }

  collection () {}

  member () {}

  ['new'] () {}

  nested () {}

  namespace () {}

  concern () {}

  concerns () {}

  draw () {
    let path = this.path
    if (this.options.scope === 'resources') {
      path += '/:' + this.options.controller + 'Id/'
    }
    this.children.forEach(m => {
      this.routes.push(...m.draw().map(r => {
        r.path = normalize(path + r.path)
        return r
      }))
    })
    return this.routes
  }

}

module.exports = Mapper
