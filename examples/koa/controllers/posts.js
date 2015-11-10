'use strict'

export const index = function*() {
  this.body = 'photos index'
}

export const show = function*() {
  this.body = `photo ${this.params.id}`
}
