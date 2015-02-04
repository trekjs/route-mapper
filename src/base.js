import assign from 'lodash-node/modern/object/assign';
import {DEFAULT_OPTIONS} from './const';

class Base {

  // root('pages#main')
  // root({ to: 'pages#main' })
  root(options, cb) {
    return root.call(this, options, cb);
  }

  // Options
  //
  //  controller:
  //    The route's controller.
  //
  //  action:
  //    The route's action.
  //
  //  param:
  //    Overrides the default resource identifier `:id`
  //    (name of the dynamic segment used to generate the routes).
  //    You can access that segment from your controller using
  //    params[param].
  //
  //  path:
  //    The path prefix for the routes.
  //
  //  module:
  //    The namespace for 'controller'.
  //
  //      match(
  //        'path',
  //        { to: 'c#a', module: 'sekret', controller: 'posts', via: 'get' }
  //      )
  //      => Sekret.PostsController
  //
  //  as:
  //    The name used to generate routing helpers.
  //
  //  via:
  //    Allowed HTTP verb(s) for route.
  //
  //      match('path', { to: 'c#a', via: 'get' })
  //      match('path', { to: 'c#a', via: ['get', 'post'] })
  //      match('path', { to: 'c#a', via: 'all' })
  //
  //  to:
  //    Points to a `Koa` endpoint. Can be an object that responds to
  //    `callback` or a string representing a controller's action.
  //
  //      match('path', { to: 'controller#action', via: 'get' })
  //      match('path', { to: (env)=>{}, via: 'get' })
  //      match('path', { to: KoaApp, via: 'get' })
  //
  //  on:
  //    Shorthand for wrapping routes in a specific RESTful context. Valid
  //    values are `member`, `collection`, and `new`. Only use within
  //    resource(s) block. For example:
  //
  //      resource('bar', () => {
  //        match('foo', { to: 'c#a', on: 'member', via: ['get', 'post'] })
  //      })
  //
  //    Is equivalent to:
  //
  //      resource('bar', () => {
  //        member(() => {
  //          match('foo', { to: 'c#a', via: ['get', 'post'] })
  //        })
  //      })
  //
  //  constraints:
  //    Constrains parameters with a hash of regular expressions
  //    or an object that responds to `matches`. In addition, constraints
  //    other than path can also be specified with any object
  //    that responds to `===` (eg. String, Array, Range, etc.).
  //
  //      match('path/:id', { constraints: { id: /[A-Z]\d{5}/ }, via: 'get' })
  //
  //      match('json_only', { constraints: { format: 'json' }, via: 'get' })
  //
  //      function Whitelist() {
  //        this.matches = function (request) {
  //          return request.remote_ip == '1.2.3.4';
  //        }
  //      }
  //      match('path', { to: 'c#a', constraints: new Whitelist, via: 'get' })
  //
  //  defaults:
  //    Sets defaults for parameters
  //
  //      // Sets params['format'] to 'jpg' by default
  //      match('path', { to: 'c#a', defaults: { format: 'jpg' }, via: 'get' })
  //
  //  anchor:
  //    Boolean to anchor a `match` pattern. Default is true. When set to
  //    false, the pattern matches any request prefixed with the given path.
  //
  //      // Matches any request starting with 'path'
  //      match('path', { to: 'c#a', anchor: false, via: 'get' })
  //
  //  format:
  //    Allows you to specify the default value for optional `format`
  //    segment or disable it by supplying `false`.
  match(path, options, cb) {}

  mount(app, options, cb) {
    //options.via ?= 'all';
    //return this.match(
    //  path,
    //  assign(options, { to: app, anchor: false, format: false })
    //);
  }

}

export function root (options, cb) {
  options = assign({}, DEFAULT_OPTIONS, options);
  return this.match('/', options, cb);
}

export default Base;
