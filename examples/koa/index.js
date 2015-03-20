import koa from 'koa';
import router from 'koa-router';
import RouteMapper from '../..';

let app = koa();

let routeMapper = new RouteMapper();
routeMapper
  .root('welcome#index')
  .get('about', {
    to: 'welcome#about'
  })
  .resources('posts', () => {
    routeMapper.resources('comments');
  })
  .scope({ path: '~:username?', module: 'users', as: 'user' }, () => {
    routeMapper.root('welcome#index');
  });

app.use(function*(next) {
  yield next;
});

app.use(router(app));

routeMapper.routes.forEach((r) => {
  r.verb.forEach((m) => {
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
