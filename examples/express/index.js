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
  m.constraints({ subdomain: 'api' }, () => {
    m.namespace('api',  { defaults: { format: 'json' }, path: '/' }, () => {
        m.scope({ module: 'v1' }, () => {
          m.resources('users');
        });
      }
    );
  });
});

router.routes.forEach((r) => {
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