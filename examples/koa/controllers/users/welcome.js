
export let index = function *() {
  this.body = 'users/welcome index';
  this.body += `\n Hello ${this.params.username || '404'}`;
  let path = this.pathHelpers.user_root_path(this.params.username || '');
  this.body += `\nuser_root_path(${this.params.username}) === ${path}`;
};
