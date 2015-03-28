export let index = function*() {
  this.body = 'photos index';
};

export let show = function*() {
  this.body = `photo ${this.params.id}`;
};
