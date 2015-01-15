const DEFAULT_OPTIONS = { as: 'root', via: 'get' };

class Base {

  // root('pages#main')
  // root({ to: 'pages#main' })
  root(options, cb) {
    root.call(this, options, cb);
    return this;
  }

  // Options
  //
  // controller
  // action
  // param
  // path
  // module
  // as
  // via
  // to
  // on
  // constraints
  // defaults
  // anchor
  // format
  match(path, options = null, cb) {}

  mount(app, options = null, cb) {}
}

export var root = function(options = {}, cb) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  this.match('/', options, cb);
}

export default Base;
