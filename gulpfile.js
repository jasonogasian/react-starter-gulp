var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');

// Source and destination path definitions for gulp tasks
var path = {
  HTML: 'src/index.html',
  ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
  JS: ['src/js/*.js', 'src/js/**/*.js'],
  MINIFIED_OUT: 'main.min.js',
  DEST_SRC: 'build/src',
  DEST_BUILD: 'build/scripts',
  DEST: 'build'
};

//
// Development tasks
//
gulp.task('default', ['initial', 'watch']);
gulp.task('initial', ['transform', 'copy']);

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
gulp.task('release', ['clean', 'replaceHTML', 'build']);

gulp.task('build', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(uglify(path.MINIFIED_OUT))
    .pipe(gulp.dest(path.DEST_BUILD));
});

// Replace <script> tags with just one tag in HTML
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'scripts/' + path.MINIFIED_OUT // Matches the comment in the HTML file
    }))
    .pipe(gulp.dest(path.DEST));
});


//
// Cleanup
//
gulp.task('clean', function () {
	return gulp.src(path.DEST, {read: false})
		.pipe(clean());
});
