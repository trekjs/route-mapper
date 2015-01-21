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