var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');	// Require JS files, run transforms
var watchify = require('watchify');			// Only update changed files
// var reactify = require('reactify');    // JSX -> JS transformation (minimal ES6)
var babelify = require('babelify');			// JSX -> JS transformation + ES6 transform
var streamify = require('gulp-streamify');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');
var server = require('gulp-server-livereload');


//
// Web Server
//
gulp.task('serve', ['default'], function() {
  gulp.src(config.DEST_DEV)
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true,
      https: config.SERVER_HTTPS,
      port: config.SERVER_PORT,
      host: config.SERVER_HOSTNAME,
      defaultFile: config.SERVER_DEFAULT,
      log: config.SERVER_LOGLEVEL // info, debug
    }));
});


//
// Development Tasks
//
gulp.task('default', ['watch']);

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLsrc', function(){
  gulp.src(config.HTML)
    .pipe(htmlreplace({
      'js': config.DEST_JS + config.OUT
    }))
    .pipe(gulp.dest(config.DEST_DEV));
});

// SASS compilation
gulp.task('sassDev', function () {
  gulp.src(config.SASS)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.DEST_DEV + '/' + config.DEST_CSS));
});

// Transform JSX and bundle on file changes
gulp.task('watch', ['sassDev', 'replaceHTMLsrc'], function() {
  gulp.watch(config.HTML, ['replaceHTMLsrc']);
  gulp.watch(config.STYLES, ['sassDev']);

  // Use watchify with browserify so that only changed files are updated. FASTER
  var watcher  = watchify(browserify({
    entries: [config.ENTRY_POINT], // Browserify will traverse to sub-files!
    debug: true,									 // User source maps for transformed code (JSX)
    cache: {}, packageCache: {}, fullPaths: true // Required junk (ignore)
  })
  .transform('babelify', {'presets': ['es2015', 'react']})); // JSX and ES6

  return watcher.on('update', function () {
    watcher.bundle().on('error', function (err) { // Concat JS into one file and resolve the requires
      console.log(err.toString());
      this.emit("end");
    })	
      .pipe(source(config.OUT))
      .pipe(gulp.dest(config.DEST_DEV + '/' + config.DEST_JS))
      console.log(new Date().toTimeString() + ': Updated');
  })
  	// Execute the first time without an update
    .bundle().on('error', function (err) {
      console.log(err.toString());
      this.emit("end");
    })
    .pipe(source(config.OUT))
    .pipe(gulp.dest(config.DEST_DEV + '/' + config.DEST_JS));
});


//
// Release Tasks
//
gulp.task('release', ['replaceHTMLmin', 'sass', 'build']);

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLmin', function(){
  gulp.src(config.HTML)
    .pipe(htmlreplace({
      'js': config.DEST_JS + config.MINIFIED_OUT
    }))
    .pipe(gulp.dest(config.DEST_RELEASE));
});

// SASS compilation
gulp.task('sass', function () {
  gulp.src(config.SASS)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(config.DEST_RELEASE + '/' + config.DEST_CSS));
});

gulp.task('build', function(){
  browserify({
    entries: [config.ENTRY_POINT]
  })
    .transform('babelify', {presets: ["es2015", "react"]})
    .bundle().on('error', function (err) {
      console.log(err.toString());
      this.emit("end");
    })
    .pipe(source(config.MINIFIED_OUT))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(config.DEST_RELEASE + '/' + config.DEST_JS));
});


//
// Cleanup
//
gulp.task('clean', function () {
	return gulp.src(config.DEST_DEV, {read: false})
		.pipe(clean());
});