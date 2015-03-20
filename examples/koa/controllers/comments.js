export let index = function *() {
  this.body = 'comments index';
};

export let show = function *() {
  this.body = `post ${this.params.post_id}, comment ${this.params.id}`;
};

exports['new'] = function *() {
  this.body = 'new comment'
};

export let edit = function *() {
  this.body = `edit commment ${this.params.id}`
};
