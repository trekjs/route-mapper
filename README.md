
# route-mapper

Generate Rails Routing Style Routers Mapper.


### Usage

```js
let router = new RouteSet();
router.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
});
```


#### Express working with `route-mapper`:

```js
import express from 'express';
import {RouteSet} from '../..';

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

let router = new RouteSet();
router.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
});

router.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller || r.default_controller;
    let action = r.action || r.default_action;
    let c;
    let a;
    if ((c = controllers[controller]) && (a = c[action])) {
      app[m](r.path, a);
    };
  });
});

app.listen(2333);
```

#### Koa working with `route-mapper`:

```js
import koa from 'koa';
import router from 'koa-router';
import {RouteSet} from '../..';

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
  }
};

let router = new RouteSet();
router.draw((m) => {
  m.root('welcome#index');
  m.resources('photos');
});

router.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller || r.default_controller;
    let action = r.action || r.default_action;
    let c;
    let a;
    if ((c = controllers[controller]) && (a = c[action])) {
      app[m](r.path, a);
    };
  });
});

app.listen(2333);
```
