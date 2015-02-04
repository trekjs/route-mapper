import isArray from 'lodash-node/modern/lang/isArray';
import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import compact from 'lodash-node/modern/array/compact';
import flatten from 'lodash-node/modern/array/flatten';
import create from 'lodash-node/modern/object/create';
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
  return [flatten(paths, true), options || create(null), cb];
}

// mixin(Mapper.prototype, Base.prototype);
export var mixin = Object.define || (target, source) => {
  Object.getOwnPropertyNames(source).forEach((key) => {
    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
  });
  return target;
};
