var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');			// Require JS files, run transforms
var watchify = require('watchify');					// Only update changed files
var reactify = require('reactify');					// JSX -> JS transformation
var streamify = require('gulp-streamify');
var clean = require('gulp-clean');
var config = require('./config');




//
// Development Tasks
//
gulp.task('default', ['watch']);

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLsrc', function(){
  gulp.src(config.HTML)
    .pipe(htmlreplace({
      'js': config.DEST_DEV + config.OUT
    }))
    .pipe(gulp.dest(config.DEV));
});

// Transform JSX and bundle on file changes
gulp.task('watch', ['replaceHTMLsrc'], function() {
  gulp.watch(config.HTML, ['replaceHTMLsrc']);

  // Use watchify with browserify so that only changed files are updated. FASTER
  var watcher  = watchify(browserify({
    entries: [config.ENTRY_POINT],  // Browserify will traverse to sub-files!
    transform: [reactify],				// JSX->JS
    debug: true,									// User source maps for transformed code (JSX)
    cache: {}, packageCache: {}, fullPaths: true // Required junk (ignore)
  }));

    console.log('Initial Update');
  return watcher.on('update', function () {
    watcher.bundle()	// Concat JS into one file and resolve the requires
      .pipe(source(config.OUT))
      .pipe(gulp.dest(config.DEV + '/' + config.DEST_DEV))
      console.log('Updated');
  })
  	// Execute the first time without an update
    .bundle()
    .pipe(source(config.OUT))
    .pipe(gulp.dest(config.DEV + '/' + config.DEST_DEV));
});


//
// Release Tasks
//
gulp.task('release', ['replaceHTMLmin', 'build']);

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLmin', function(){
  gulp.src(config.HTML)
    .pipe(htmlreplace({
      'js': config.DEST_RELEASE + config.MINIFIED_OUT
    }))
    .pipe(gulp.dest(config.RELEASE));
});

gulp.task('build', function(){
  browserify({
    entries: [config.ENTRY_POINT],
    transform: [reactify]
  })
    .bundle()
    .pipe(source(config.MINIFIED_OUT))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(config.RELEASE + '/' + config.DEST_RELEASE));
});


//
// Cleanup
//
gulp.task('clean', function () {
	return gulp.src(config.DEV, {read: false})
		.pipe(clean());
});