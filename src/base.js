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
  match(path, options, cb) {}

  mount(app, options, cb) {}

}

export var root = function(options, cb) {
  options = assign({}, DEFAULT_OPTIONS, options);
  return this.match('/', options, cb);
}

export default Base;
