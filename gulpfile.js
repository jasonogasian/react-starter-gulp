var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');			// Require JS files, run transforms
var watchify = require('watchify');					// Only update changed files
var reactify = require('reactify');					// JSX -> JS transformation
var streamify = require('gulp-streamify');
var clean = require('gulp-clean');


// Source and destination path definitions for gulp tasks
var path = {
  HTML: 'src/index.html',
  MINIFIED_OUT: 'main.min.js',
  OUT: 'main.js',
  RELEASE: 'release',
  DEV: 'build',
  DEST_DEV: 'src/',
  DEST_RELEASE: 'scripts/',
  ENTRY_POINT: './src/js/App.js'
};


//
// Development Tasks
//
gulp.task('default', ['watch']);

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLsrc', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': path.DEST_DEV + path.OUT
    }))
    .pipe(gulp.dest(path.DEV));
});

// Transform JSX and bundle on file changes
gulp.task('watch', ['replaceHTMLsrc'], function() {
  gulp.watch(path.HTML, ['replaceHTMLsrc']);

  // Use watchify with browserify so that only changed files are updated. FASTER
  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],  // Browserify will traverse to sub-files!
    transform: [reactify],				// JSX->JS
    debug: true,									// User source maps for transformed code (JSX)
    cache: {}, packageCache: {}, fullPaths: true // Required junk (ignore)
  }));

    console.log('Initial Update');
  return watcher.on('update', function () {
    watcher.bundle()	// Concat JS into one file and resolve the requires
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEV + '/' + path.DEST_DEV))
      console.log('Updated');
  })
  	// Execute the first time without an update
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEV + '/' + path.DEST_DEV));
});


//
// Release Tasks
//
gulp.task('release', ['replaceHTMLmin', 'build']);

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLmin', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': path.DEST_RELEASE + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.RELEASE));
});

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(path.RELEASE + '/' + path.DEST_RELEASE));
});


//
// Cleanup
//
gulp.task('clean', function () {
	return gulp.src(path.DEV, {read: false})
		.pipe(clean());
});