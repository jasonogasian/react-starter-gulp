var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

// Source and destination path definitions for gulp tasks
var path = {
  HTML: 'src/index.html',
  ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
  JS: ['src/js/*.js', 'src/js/**/*.js'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

//
// Development tasks
//
gulp.task('default', ['build', 'watch']);
gulp.task('build', ['transform', 'copy']);

// Transpile JSX into JS
gulp.task('transform', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});

// COPY HTML to DEST
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

// Watch for changes and run development tasks
gulp.task('watch', function(){
  gulp.watch(path.ALL, ['transform', 'copy']);
});


//
// Release Tasks
//