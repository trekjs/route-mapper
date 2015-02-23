require('babel/register')({
  optional: ['runtime'],
  experimental: true,
  playground: true,
  blacklist: ['regenerator', 'es6.templateLiterals']
});