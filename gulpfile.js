"use strict";
var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var debug = require('debug')('gulp');
var todo = require('gulp-todo');
var mocha = require('gulp-mocha');

var runSequence = require('run-sequence');
var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');
var config = require('./config');
var argv = require('minimist');



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
    // Override RATE LIMIT HERE FOR UNIT TEST
    process.env.RATE_LIMIT = 10;
    process.env.SECURE_MODE = true;
    process.env.NO_CACHE = 'no';
    process.env.NODE_ENV = 'test';
    gulp.src('./test', {read: false})
        // `gulp-mocha` needs filepaths so you can't have any plugins before it 
        .pipe(mocha({
            reporter: 'spec'
        }));
    }
    );

gulp.task('create', function(){

});

// generate a todo.md from your javascript files 
gulp.task('todo', function() {
  gulp.src(['./*.js','./**/*.js','!./node_modules/**','!./node_modules/*.js'])
  .pipe(todo())
  .pipe(gulp.dest('./'));
        // -> Will output a TODO.md with your todos 
    });

gulp.task('sanity',['lint','test','todo']);

// Release

gulp.task('changelog', function () {
  return gulp.src('./CHANGELOG.md', {
    buffer: false
})
  .pipe(conventionalChangelog({
      preset: 'angular' // Or to any other commit message convention you use.
  }))
  .pipe(gulp.dest('./'));
});

gulp.task('github-release', function(done) {
  conventionalGithubReleaser({
    type: "oauth",
    token: config.gitOAuthToken // change this to your own GitHub token or use an environment variable
}, {
    preset: 'angular' // Or to any other commit message convention you use.
}, done);
});

// Remember to pass argument '-r patch/minor/major' to the release command
gulp.task('bump-version', function () {
  var args = argv(process.argv.slice(2));
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
if(!args.r){
  throw new Error('The release type is not defined! Please pass the -r switch with a release type argument (patch/minor/major)');
}else{
  return gulp.src(['./package.json'])
  .pipe(bump({type: args.r}).on('error', gutil.log))
  .pipe(gulp.dest('./'));
}
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
  .pipe(git.add())
  .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'dev', cb);
});

gulp.task('create-new-tag', function (cb) {
  var getPackageJsonVersion = function () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};
var version = getPackageJsonVersion();
git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
  }
  git.push('origin', 'dev', {args: '--tags'}, cb);
});
});

gulp.task('release', function (callback) {
  runSequence(
    'sanity',
    'bump-version',
    'changelog',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'github-release',
    function (error) {
      if (error) {
        console.log(error.message);
    } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
    }
    callback(error);
});
});
