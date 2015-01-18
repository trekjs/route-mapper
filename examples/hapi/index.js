import Hapi from 'hapi';
import RouteMapper from '../..';

var server = new Hapi.Server();
server.connection({ port: 3300 });
let routeMapper = new RouteMapper();
routeMapper.draw((m) => {
  m.root('welcome#index');
  m.resources('photos', { only: ['index', 'new'] });
});

routeMapper.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c = require(__dirname + '/controllers/' + controller + '.js');
    let a;
    if (c && (a = c[action])) {
      server.route({
        method: m,
        path: r.path,
        handler: a
      });
    };
  });
});

server.start(() => {
  console.log('Server running at:', server.info.uri);
});