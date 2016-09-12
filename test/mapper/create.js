import test from 'ava'
import Mapper from '../../lib/Mapper'

test('should create a mapper', t => {
  const m = new Mapper()
  //
  // m.match('photos/:id', {
  //   to: 'photos#show',
  //   verb: 'get'
  // })
  // m.match('photos/:id', {
  //   controller: 'photos',
  //   action: 'show',
  //   verb: 'get'
  // })
  //
  m.resources('magazines', (m) => {
    m.resources('ads', (m) => {
    })
  })

  m.resource('profile')

  t.true(m instanceof Mapper)
  console.log(m.draw())
})
