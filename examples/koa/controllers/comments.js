export let index = function *() {
  this.body = 'comments index';
};

export let show = function *() {
  this.body = `post ${this.params.post_id}, comment ${this.params.id}`;
  let path = this.pathHelpers.post_comment_path(this.params.post_id, this.params.id);
  this.body += `\npost_comment_path(${this.params.post_id}, ${this.params.id}) === ${path}`;
};

exports['new'] = function *() {
  this.body = 'new comment'
};

export let edit = function *() {
  this.body = `edit commment ${this.params.id}`
  let path = this.pathHelpers.edit_post_comment_path(this.params.post_id, this.params.id);
  this.body += `\nedit_post_comment_path(${this.params.post_id}, ${this.params.id}) === ${path}`;
};
