
exports.parseArgs = function parseArgs (...args) {
  const type = typeof args[args.length - 1]
  let opts
  let cb

  if ('function' === type) {
    cb = args.pop()
    if ('object' === typeof args[args.length - 1]) {
      opts = args.pop()
    }
  } else if ('object' === type) {
    opts = args.pop()
  } else if ('undefined' === type) {
    args.pop()
    return parseArgs(...args)
  }

  return [args, opts || {}, cb]
}
