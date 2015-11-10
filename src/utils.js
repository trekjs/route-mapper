'use strict'

/*!
 * route-mapper - utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import _ from 'lodash'
import { normalize, resolve } from 'path'

/**
 * Split a string to an array.
 *
 * @example
 *  splitTo('controller#action')
 *  // => [ 'controller', 'action' ]
 *
 * @param {String} to
 * @return {Array} [ controller, action ]
 */
function splitTo(to = '') {
  if (/#/.test(to)) {
    return to.split('#')
  }
  return []
}

/**
 * Normalize Path
 *
 * @param {String} path
 * @return {String}
 */
function normalizePath(path) {
  path = '/' + path
  path = resolve(normalize(path))
  path = path.replace(/(%[a-f0-9]{2})/g, $1 => $1.toUpperCase())
  if (path === '') path = '/'
  return path
}

/**
 * Parse the arguments and return an special array.
 *
 * @example
 *  parseArgs(path)
 *  // => [[path], {}, undefined]
 *  parseArgs(path, cb)
 *  // => [[path], {}, cb]
 *  parseArgs(path, options)
 *  // => [[path], options, undefined]
 *  parseArgs(options)
 *  // => [[], options, undefined]
 *
 * @param {Array|ArrayLike} args
 * @return {Array} [ [path, path], {}, function ]
 */
function parseArgs(...args) {
  const l = args.length
  const last = args[l - 1]
  let cb, opts, paths
  if (_.isFunction(last)) {
    cb = last
    args.pop(); // don't remove this semicolon
    [paths, opts] = parseArgs(...args)
  } else if (_.isObject(last) && !Array.isArray(last)) {
    opts = last
    args.pop()
    paths = args
  } else if (!last && l > 0) {
    args.pop()
    return parseArgs(...args)
  } else {
    paths = args
  }
  return [_.compact(_.flatten(paths, true)), opts || {}, cb]
}

const mergeScope = {

  // parent/child
  path(parent, child) {
    return parent ? normalizePath(`${parent}/${child}`) : child
  },

  // parent_child
  as(parent, child) {
    return parent ? `${parent}_${child}` : child
  },

  // parent/child
  module(parent, child) {
    return parent ? normalizePath(`${parent}/${child}`) : child
  },

  controller(parent, child) {
    return child
  },

  action(parent, child) {
    return child
  },

  pathNames(parent, child) {
    return this.options(parent, child)
  },

  options(parent, child) {
    const excepts = this.overrideKeys(child)
    return Object.assign(_.omit(parent, excepts), child)
  },

  overrideKeys(child) {
    return (child.only || child.except) ? ['only', 'except'] : []
  }

}

export default {
  splitTo,
  parseArgs,
  mergeScope,
  normalizePath
}
