
export var index = (request, reply) => {
  reply('Hello, photos!');
}

exports['new'] = (request, reply) => {
  reply('new photo');
}
