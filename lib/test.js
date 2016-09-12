const { normalize } = require('path')
const { parseArgs } = require('./util')

const rest = {
  index: 'get',
  create: 'post',
  new: 'get',
  edit: 'get',
  show: 'get',
  update: ['patch', 'put'],
  destroy: 'delete'
}

class Mapper {

  constructor (options = {}, parent) {
    this.path = options.path || '/'
    this.options = options
    this.parent = parent
    this.children = []
    this.routes = []
  }

  _mapMatch (paths, options) {
    paths.forEach(path => {
      this.routes.push({
        path,
        options
      })
    })
    return this
  }

  get () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

  post () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

  patch () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

  put () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

  delete () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

  match () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

  resources () {
    const [paths, options, cb] = parseArgs(...arguments)
    paths.forEach(path => {
      const opts = Object.assign({}, options)
      opts.path = opts.path || path
      opts.scope = 'resources'
      opts.controller = opts.controller || path
      const mapper = new Mapper(opts, this)
      const controller = opts.controller
      this.children.push(mapper)

      const actions = 'index create new show update destroy edit'.split(' ')

      actions
        .forEach(action => {
          let prefix = opts.path
          let verbs = rest[action]
          if (verbs && !Array.isArray(verbs)) {
            verbs = [verbs]
          }
          let param = options.param || 'id'
          if (!param.startsWith(':')) param = ':' + param
          if (!options.param) {
            options.param = param
          }

          if ('show update destroy edit'.includes(action)) {
            prefix += '/' + param
          }

          const pathNames = Object.assign({}, {
            new: 'new',
            edit: 'edit'
          }, options.pathNames)

          const pathName = pathNames[action]

          verbs.forEach(verb => {
            mapper[verb](`${prefix}${pathName ? '/' + pathName : ''}`, Object.assign({
              verb,
              controller,
              action
            }, opts))
          })
        })


      if (cb) {
        cb(mapper)
      }
    })
    return this._mapMatch(paths, options)
  }

  resource () {
    const [paths, options, cb] = parseArgs(...arguments)
    if (cb) {
      const mapper = new Mapper(options)
      this.children.push(mapper)
      cb(mapper)
    }
    return this._mapMatch(paths, options)
  }

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
    console.log('------------------------------------')
    console.log(this.routes)
    console.log('------------------------------------')
    return this.routes
  }
}

const m = new Mapper()

m
//.get('/')
//https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/routing/mapper.rb#L1285
  .resources('magazines', (m) => {
    m.resources('ads', { pathNames: { new: 'create', edit: 'modify' } })
    m.resources('posts', { path: '/admin/posts' }, (m) => {
      m.resources('books')
    })
  })
//.resource('profile')
  .draw()
