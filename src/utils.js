import isArray from 'lodash-node/modern/lang/isArray';
import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import compact from 'lodash-node/modern/array/compact';
import {normalize} from 'path';

export var normalizePath = path => {
  path = '/' + path;
  path = normalize(path);
  path = path.replace(/(%[a-f0-9]{2})/g, ($1) => $1.toUpperCase());
  if (path === '') path = '/';
  return path;
};

// [path, path, path, options, cb] => [paths, options, cb]
// [path, cb] => [paths, {}, cb]
// [path, options] => [paths, options, undefined]
// [options] => [[], options, undefined]
// [cb] => [[], {}, cb]
// [path] => [paths, {}, undefined]
// [] => [[], {}, undefined]
export var buildArgs = (...args) => {
  let l = args.length, last = args[l - 1], cb, options, paths;
  if (!last && l > 0) {
   args.pop();
   return buildArgs(...args);
  } else if (isFunction(last)) {
    cb = last;
    args.pop();
    let res = buildArgs(...args);
    paths = res[0];
    options = res[1];
  } else if (isObject(last) && !isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else {
    paths = args;
  }
  return [flatten(paths), options || newObject(), cb];
}


// [1, 2, 3, [4, 5, 6]] => [1, 2, 3, 4, 5, 6]
export var flatten = list => list.reduce(
  (a, b) => a.concat(isArray(b) ? flatten(b) : b), []
);

// [1, null, false] => true
// [null] => false
// [undefined] => false
// [false] => false
// ['', ''] => false
// [0] => true
export var any = list => compact(list).length > 0;

// Object.create(null)
export var newObject = () => Object.create(null);


// mixin(Mapper.prototype, Base.prototype);
export var mixin = Object.define || (target, source) => {
  Object.getOwnPropertyNames(source).forEach((key) => {
    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
  });
  return target;
};
