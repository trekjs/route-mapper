import koa from 'koa';
import Router from 'koa-router';
import RouteMapper from '../..';

let app = koa();
let router = new Router();

let routeMapper = new RouteMapper();
routeMapper
  .root('welcome#index')
  .get('about', {
    to: 'welcome#about'
  })
  .resources('posts', () => {
    routeMapper.resources('comments');
  })
  .scope({
    path: '~:username?',
    module: 'users',
    as: 'user'
  }, () => {
    routeMapper.root('welcome#index');
  });

routeMapper.routes.forEach((r) => {
  r.verb.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c = require(__dirname + '/controllers/' + controller + '.js');
    let a;
    console.log(m, r.path);
    if (c && (a = c[action])) {
      if (!Array.isArray(a)) {
        a = [a];
      }
      router[m](r.path, ...a);
    };
  });
});

app.use(router.routes());

console.log('Open http://localhost:3300.');
app.listen(3300);
