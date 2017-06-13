"use strict";
var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var debug = require('debug')('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('lint', function() {
  return gulp.src(['./*.js','./**/*.js','!./node_modules/**','!./node_modules/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', function(){
    var stream = nodemon({ script: 'app.js' , env: { 'NODE_ENV': 'development', 'DEBUG':'gulp' }, tasks: ['lint','test'] });
 
    stream
      .on('restart', function () {
        debug('restarted!');
      })
      .on('crash', function() {
        debug('Application has crashed!\n');
         stream.emit('restart', 10);  // restart the server in 10 seconds 
      });
});
 
gulp.task('test', function() {
        gulp.src('./test/*.js', {read: false})
        // `gulp-mocha` needs filepaths so you can't have any plugins before it 
        .pipe(mocha({reporter: 'spec'}));
    }
);

gulp.task('create', function(){

});

gulp.task('sanity',['lint','test']);
