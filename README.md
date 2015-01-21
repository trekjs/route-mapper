# route-mapper

Generate Rails Style Routing & RESTful Routes. See [Rails Routing][] doc.   
Write with `ES6+`, build with [6to5][] for `ES5`.

[![es6+][es6-image]][es6-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![David-dm status][David-dm-image]][David-dm-url]


## Usage

```js
let routeMapper = new RouteMapper();
routeMapper.draw((m) => {

  // You can have the root of your site routed with "root"
  m.root('welcome#index');

  // /products/233  controller = catalog, action = view
  m.get('products/:id', { to: 'catalog#view' });

  // Example named route that can be invoked with purchase_path(id: product.id)
  // /products/233/purchase === purchase_path(233)
  m.get('products/:id/purchase', { to: 'catalog#purchase', as: 'purchase' });

  // Example resource route (maps HTTP verbs to controller actions automatically):
  m.resources('products');

  // Example resource route with options:
  m.resources('products', () => {
    m.member(() => {
      m.get('short');
      m.post('toggle');
    });

    m.collection(() => {
      m.get('sold');
    });
  });

  // Example resource route with sub-resources:
  m.resources('products', () => {
    m.resources('comments', 'sales');
    m.resource('seller');
  });

  // Example resource route with more complex sub-resources:
  m.resources('products', () => {
    m.resources('comments')
    m.resources('sales', () => {
      m.get('recent', { on: 'collection' });
    });
  });

  // Example resource route with concerns:
  m.concern('toggleable', () => {
    m.post('toggle');
  });
  m.resources('posts', { concerns: 'toggleable' });
  m.resources('photos', { concerns: 'toggleable' });

  // Example resource route within a namespace:
  m.namespace('admin', () => {
    // Directs /admin/products/*
    m.resources('products');
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
* ...


## APIs

* `root`
* `match`
* `get`
* `post`
* `patch`
* `put`
* `delete`
* `scope`
* `controller`
* `namespace`
* `constraints`
* `defaults`
* `resource`
* `resources`
  * `collection`
  * `member`
  * `nested`
* `shallow`
* `concern`
* `concerns`


## [Examples](./examples)

### [Express example](./examples/express)

```js
import express from 'express';
import RouteMapper from '../..';

let app = express();

let routeMapper = new RouteMapper();
routeMapper.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
  m.constraints({ subdomain: 'api' }, () => {
    m.namespace('api',  { defaults: { format: 'json' }, path: '/' }, () => {
        m.scope({ module: 'v1' }, () => {
          m.resources('users');
        });
      }
    );
  });
});


app.use(function (req, res, next) {
  res.locals.pathHelpers = routeMapper.pathHelpers;
  next();
});

routeMapper.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c = require(__dirname + '/controllers/' + controller + '.js');
    let a;
    if (c && (a = c[action])) {
      if (!Array.isArray(a)) {
        a = [a];
      }
      app[m](r.path, ...a);
    };
  });
});

app.listen(3300);
```

### [Koa example](./examples/koa)

```js
import koa from 'koa';
import router from 'koa-router';
import RouteMapper from '../..';

let app = koa();

let routeMapper = new RouteMapper();
routeMapper.draw((m) => {
  m.root('welcome#index');
  m.get('about', { to: 'welcome#about' });
  m.resources('posts', () => {
    m.resources('comments');
  });
  m.scope({ path: '~:username?', module: 'users', as: 'user'}, () => {
    m.root('welcome#index');
  });
});

app.use(function *(next) {
  this.pathHelpers = routeMapper.pathHelpers;
  yield next;
});

app.use(router(app));

routeMapper.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c = require(__dirname + '/controllers/' + controller + '.js');
    let a;
    if (c && (a = c[action])) {
      if (!Array.isArray(a)) {
        a = [a];
      }
      app[m](r.path, ...a);
    };
  });
});

app.listen(3300);
```



[Rails Routing]: http://guides.rubyonrails.org/routing.html
[6to5]: https://6to5.org/
[es6-image]: https://img.shields.io/badge/es-6+-brightgreen.svg?style=flat-square
[es6-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla
[npm-image]: https://img.shields.io/npm/v/route-mapper.svg?style=flat-square
[npm-url]: https://npmjs.org/package/route-mapper
[travis-image]: https://img.shields.io/travis/trekjs/route-mapper/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/route-mapper
[David-dm-image]: https://david-dm.org/trekjs/route-mapper.svg?style=flat-square
[David-dm-url]: https://david-dm.org/trekjs/route-mapper
