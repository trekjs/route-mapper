
export let index =  [
  function *(next) {
    this.body = 'Welcome index!';
    yield* next;
  },
  function *() {
    this.body += '\nHello route-mapper!';
  }
];

export let about = function *() {
  this.body = 'About ME!';
};
