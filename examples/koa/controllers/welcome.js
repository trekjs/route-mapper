'use strict'

export const index = [

  function*(next) {
    this.body = 'Welcome index!'
    yield* next
  },

  function*() {
    this.body += '\nHello route-mapper!'
  }
]

export const about = function*() {
  this.body = 'About ME!'
}
