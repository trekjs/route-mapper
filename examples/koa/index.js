'use strict'

import koa from 'koa'
import Router from 'koa-router'
import RouteMapper from '../..'

const app = koa()
const router = new Router()

const routeMapper = new RouteMapper()

routeMapper
  .root('welcome#index')
  .get('about', {
    to: 'welcome#about'
  })
  .resources('posts', () => {
    routeMapper.resources('comments')
  })
  .scope({
    path: '~:username?',
    module: 'users',
    as: 'user'
  }, () => {
    routeMapper.root('welcome#index')
  })

routeMapper.routes.forEach(r => {
  const { controller, action } = r
  try {
    let c = require(__dirname + '/controllers/' + controller + '.js')
    if (c) {
      c = c.default || c
      r.verb.forEach(m => {
        let a
        if (a = c[action]) {
          if (!Array.isArray(a)) {
            a = [a]
          }
          console.log(r.path, controller, action)
          router[m](r.path, ...a)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
})

app.use(router.routes())

console.log('Open http://localhost:3300.')
app.listen(3300)
