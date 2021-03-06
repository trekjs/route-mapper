# route-mapper

Generate Rails Style Routing & RESTful Routes. See [Rails Routing][] doc.
Write with `ES6+`, build with [Babel][] for `ES5`.

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![David-dm status][David-dm-image]][David-dm-url]


## Usage

```js
let routeMapper = new RouteMapper();
routeMapper

  // You can have the root of your site routed with "root"
  .root('welcome#index')

  // /products/233  controller = catalog, action = view
  .get('products/:id', { to: 'catalog#view' })

  // Example named route that can be invoked with purchase_path(id: product.id)
  // /products/233/purchase === purchasePath(233)
  .get('products/:id/purchase', { to: 'catalog#purchase', as: 'purchase' })

  // Example resource route (maps HTTP verbs to controller actions automatically):
  .resources('products')

  // Example resource route with options:
  .resources('products', () => {
    routeMapper.member(() => {
      routeMapper
        .get('short')
        .post('toggle');
    })

    .collection(() => {
      routeMapper.get('sold');
    })
  })

  // Example resource route with sub-resources:
  .resources('products', () => {
    routeMapper
      .resources('comments', 'sales')
      .resource('seller');
  })

  // Example resource route with more complex sub-resources:
  .resources('products', () => {
    routeMapper
      .resources('comments')
      .resources('sales', () => {
        routeMapper.get('recent', { on: 'collection' });
      });
  })

  // Example resource route with concerns:
  .concern('toggleable', () => {
    routeMapper.post('toggle');
  })
  .resources('posts', { concerns: 'toggleable' })
  .resources('photos', { concerns: 'toggleable' })

  // Example resource route within a namespace:
  .namespace('admin', () => {
    // Directs /admin/products/*
    routeMapper.resources('products');
  });

});
```


## Features

* Nesting
* Namespace
* Resources
* RESTful
* Chaining
* Named Routes
* URL Helpers
* Pluralized or Singularized
* CamelCase or Underscore Styles
* ...


## APIs

* `get()`, `post()`, `put()`, `delete()` ..., HTTP verbs
* `root`
* `match`
* `scope`
* `controller`
* `namespace`
* `constraints`
* `resource`
* `resources`
  * `collection`
  * `member`
  * `nested`
* `concern`
* `concerns`
* `draw(filename)`


## [Examples](./examples)

### [Express example](./examples/express)

```js
'use strict'

import express from 'express'
import RouteMapper from '../..'

const app = express()

let routeMapper = new RouteMapper()

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

routeMapper.routes.forEach((r) => {
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
```

### [Koa example](./examples/koa)

```js
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
```



[Rails Routing]: http://guides.rubyonrails.org/routing.html
[Babel]: https://babeljs.io/
[npm-image]: https://img.shields.io/npm/v/route-mapper.svg?style=flat-square
[npm-url]: https://npmjs.org/package/route-mapper
[travis-image]: https://img.shields.io/travis/trekjs/route-mapper/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/route-mapper
[David-dm-image]: https://david-dm.org/trekjs/route-mapper.svg?style=flat-square
[David-dm-url]: https://david-dm.org/trekjs/route-mapper
