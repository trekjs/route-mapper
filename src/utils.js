import isFunction from 'lodash-node/modern/lang/isFunction';
import isObject from 'lodash-node/modern/lang/isObject';
import isArray from 'lodash-node/modern/lang/isArray';
import {normalize} from 'path';

let _hasOwn = Object.prototype.hasOwnProperty;

export let hasOwn = (o, k) => _hasOwn.call(o, k);

export let normalizePath = (path) => {
  path = '/' + path;
  path = normalize(path);
  path = path.replace(/(%[a-f0-9]{2})/g, ($1) => $1.toUpperCase());
  if (path === '') path = '/';
  return path;
}

// [path, path, path, options, cb] => [paths, options, cb]
// [path, cb] => [paths, {}, cb]
// [path, options] => [paths, options, undefined]
// [options] => [[], options, undefined]
// [cb] => [[], {}, cb]
// [path] => [paths, {}, undefined]
// [] => [[], {}, undefined]
export let buildArgs = (...args) => {
  let l = args.length, last = args[l - 1], cb, options, resources;
  if (!last && l > 0) {
   args.pop();
   return buildArgs(...args);
  } else if (isFunction(last)) {
    cb = last;
    args.pop();
    let res = buildArgs(...args);
    resources = res[0];
    options = res[1];
  } else if (isObject(last) && !isArray(last)) {
    options = last;
    args.pop();
    resources = args;
  } else {
    resources = args;
  }
  return [flatten(resources), options || {}, cb];
}


// [1, 2, 3, [4, 5, 6]] => [1, 2, 3, 4, 5, 6]
export let flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

// [null, undefined, false, ''] => []
export let compact = list => list.filter(
  (e) => !(e === null || e === false || e === '' || e === void 0)
);

// [1, null, false] => true
// [null] => false
// [undefined] => false
// [false] => false
// ['', ''] => false
// [0] => true
export let any = list => compact(list).length > 0;
