import {newObject} from './utils';

const DEFAULT_OPTIONS = { as: 'root', via: 'get' };

class Base {

  // root('pages#main')
  // root({ to: 'pages#main' })
  root(options, cb) {
    return root.call(this, options, cb);
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

export var root = function(options = newObject(), cb) {
  options = Object.assign(newObject(), DEFAULT_OPTIONS, options);
  return this.match('/', options, cb);
}

export default Base;
