'use strict'

export const index = function*() {
  this.body = 'comments index'
}

export const show = function*() {
  this.body = `post ${this.params.post_id}, comment ${this.params.id}`
}

exports['new'] = function*() {
  this.body = 'new comment'
}

export const edit = function*() {
  this.body = `edit commment ${this.params.id}`
}
