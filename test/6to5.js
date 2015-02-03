require('6to5/register')({
  optional: ['selfContained'],
  blacklist: ['es6.templateLiterals'],
  experimental: true,
  playground: true
});