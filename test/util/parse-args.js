import test from 'ava'
import { parseArgs } from '../../lib/util'

test('should return 3 params', t => {
  const args = parseArgs('/', {}, () => {})
  t.deepEqual(args[0], ['/'])
  t.deepEqual(args[1], {})
  t.true('function' === typeof args[2])
})

test('if inputs 2 params should return 3 params', t => {
  const args = parseArgs('/', {})
  t.deepEqual(args[0], ['/'])
  t.deepEqual(args[1], {})
  t.is(args[2], undefined)
})

test('if inputs 2 params and last param is function should return 3 params', t => {
  const args = parseArgs('/', () => {})
  t.deepEqual(args[0], ['/'])
  t.deepEqual(args[1], {})
  t.true('function' === typeof args[2])
})

test('if only 1 param should return 3 params', t => {
  const args = parseArgs('/')
  t.deepEqual(args[0], ['/'])
  t.deepEqual(args[1], {})
  t.is(args[2], undefined)
})

test('if inputs more than 3 params should return 3 params', t => {
  const args = parseArgs('/', 'trekjs', 'route-mapper', {}, () => {})
  t.deepEqual(args[0], ['/', 'trekjs', 'route-mapper'])
  t.deepEqual(args[1], {})
  t.true('function' === typeof args[2])
})

test('if inputs only paths params should return 3 params', t => {
  const args = parseArgs('/', 'trekjs', 'route-mapper')
  t.deepEqual(args[0], ['/', 'trekjs', 'route-mapper'])
  t.deepEqual(args[1], {})
  t.is(args[2], undefined)
})
