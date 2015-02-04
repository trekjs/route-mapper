import isFunction from 'lodash-node/modern/lang/isFunction';
import {buildArgs} from './utils';

class Concerns {

  concern(name, callable, cb) {
    if (!callable) {
      callable = options => {
        if (isFunction(cb)) {
          cb.call(this, options);
        }
      };
    }
    this._concerns[name] = callable;
    return this;
  }

  concerns(...args) {
    let [names, options, cb] = buildArgs.apply(undefined, args);
    names.forEach(name => {
      let concern = this._concerns[name];
      if (isFunction(concern)) {
        concern.call(this, options);
      } else {
        throw new Error(`No concern named ${name} was found!`);
      }
    });
    return this;
  }

}

export default Concerns;
