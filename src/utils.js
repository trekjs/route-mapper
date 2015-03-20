/*!
 * route-mapper - utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import _ from 'lodash-node';
import { normalize, resolve } from 'path';

export const normalizePath = path => {
  path = '/' + path;
  path = resolve(normalize(path));
  path = path.replace(/(%[a-f0-9]{2})/g, ($1) => $1.toUpperCase());
  if (path === '') path = '/';
  return path;
};

export const parseArgs = args => {
  args = [...args];
  let l = args.length,
    last = args[l - 1],
    cb, options, paths;
  if (_.isFunction(last)) {
    cb = last;
    args.pop();
    let res = parseArgs(args);
    paths = res[0];
    options = res[1];
  } else if (_.isObject(last) && !_.isArray(last)) {
    options = last;
    args.pop();
    paths = args;
  } else if (!last && l > 0) {
    args.pop();
    return parseArgs(args);
  } else {
    paths = args;
  }
  return [_.compact(_.flatten(paths, true)), options || {}, cb];
}
