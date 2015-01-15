import isFunction from 'lodash-node/modern/lang/isFunction';
import {buildArgs} from './utils';

class Concerns {
  concern(name, callable = null, cb) {
    if (!callable) {
      callable = function(options) {
        if (isFunction(cb)) {
          cb.call(this, options);
        }
      }
    }
    this._concerns[name] = callable;
  }

  concerns(...args) {
    let [names, options, cb] = buildArgs(...args);
    names.forEach((name) => {
      let concern = this._concerns[name];
      if (isFunction(concern)) {
        concern.call(this, options);
      } else {
        throw 'No concern named ' + name + ' was found!'
      }
    });
  }
}

export default Concerns;
