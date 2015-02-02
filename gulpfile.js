'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');

gulp.task('default', function () {
 return gulp.src('src/**/*.js')
   .pipe(to5({
     optional: ['selfContained'],
     experimental: true,
     playground: true
   }))
  .pipe(gulp.dest('lib'));
});