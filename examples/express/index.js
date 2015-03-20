import express from 'express';
import RouteMapper from '../..';

let app = express();

let routeMapper = new RouteMapper();
routeMapper
  .root('welcome#index')
  .resources('photos')
  .namespace('api', { path: '/' }, () => {
    routeMapper.scope({ module: 'v1' }, () => {
      routeMapper.resources('users');
    });
  });

app.use(function(req, res, next) {
  next();
});

routeMapper.routes.forEach((r) => {
  r.verb.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    try {
      let c = require(__dirname + '/controllers/' + controller + '.js');
      let a;
      if (c && (a = c[action])) {
        if (!Array.isArray(a)) {
          a = [a];
        }
        console.log(r.path, controller, action)
        app[m](r.path, ...a);
      };
    } catch (e) {
      console.log(e);
    }
  });
});

app.listen(3300);
