# route-mapper

Generate Rails Style Routing & RESTful Routes.
See [Rails Routing][] doc.

  [![es6+][es6-image]][es6-url]
  [![NPM version][npm-image]][npm-url]


## Usage

```js
let routeMapper = new RouteMapper();
routeMapper.draw((m) => {

  // You can have the root of your site routed with "root"
  m.root('welcome#index');

  // /products/233  controller = catalog, action = view
  m.get('products/:id', { to: 'catalog#view' });

  // Example named route that can be invoked with purchase_url(id: product.id)
  // /products/233/purchase === purchase_url(233)
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

let controllers = {
  welcome: {
    index:  (req, res) => {
      res.send('Welcome Index!');
    }
  },
  photos: {
    index: (req, res) => {
      res.send('photos index');
    },
    show: (req, res) => {
      res.send(`photo ${req.params.id}`);
    }
  }
};

let routeMapper = new RouteMapper();
routeMapper.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
});

routeMapper.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c;
    let a;
    if ((c = controllers[controller]) && (a = c[action])) {
      app[m](r.path, a);
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
app.use(router(app));

let controllers = {
  welcome: {
    index:  function *() {
      this.body = 'Welcome Index!';
    }
  },
  photos: {
    index: function *() {
      this.body = 'photos index';
    },
    show: function *() {
      this.body = `photo ${this.params.id}`;
    }
  },
  posts: {
    index: function *() {
      this.body = 'posts index';
    },
    show: function *() {
      this.body = `posts ${this.params.id}`;
    }
  },
  comments: {
    index: function *() {
      this.body = 'comments index';
    },
    show: function *() {
      this.body = `post ${this.params.post_id}, comment ${this.params.id}`;
    }
  },
};

let routeMapper = new RouteMapper();
routeMapper.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
  m.resources('posts', () => {
    m.resources('comments');
  });
});

routeMapper.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c;
    let a;
    if ((c = controllers[controller]) && (a = c[action])) {
      app[m](r.path, a);
    };
  });
});

app.listen(3300);
```



[es6-image]: https://img.shields.io/badge/es-6+-brightgreen.svg?style=flat-square
[es6-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla
[npm-image]: https://img.shields.io/npm/v/route-mapper.svg?style=flat-square
[npm-url]: https://npmjs.org/package/route-mapper
[Rails Routing]: http://guides.rubyonrails.org/routing.html
