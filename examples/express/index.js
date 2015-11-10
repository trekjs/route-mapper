'use strict'

import express from 'express'
import RouteMapper from '../..'

const app = express()

const routeMapper = new RouteMapper()

routeMapper
  .root('welcome#index')
  .resources('photos')
  .namespace('api', {
    path: '/'
  }, () => {
    routeMapper.scope({
      module: 'v1'
    }, () => {
      routeMapper.resources('users')
    })
  })

app.use(function(req, res, next) {
  next()
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
          app[m](r.path, ...a)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
})

app.listen(3300)
console.log('Open http://localhost:3300.')
