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
  DEST_SRC: 'build/src',
  DEST_BUILD: 'build/scripts',
  DEST: 'build',
  ENTRY_POINT: './src/js/App.js'
};


// Copy HTML to DEST
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

// Copy HTML to DEST and point to the compiled JS in the build directory
gulp.task('replaceHTMLsrc', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'src/' + path.OUT
    }))
    .pipe(gulp.dest(path.DEST));
});


//
// Development Tasks
//
gulp.task('default', ['watch']);

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
      .pipe(gulp.dest(path.DEST_SRC))
      console.log('Updated');
  })
  	// Execute the first time without an update
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});


//
// Release Tasks
//



//
// Cleanup
//
gulp.task('clean', function () {
	return gulp.src(path.DEST, {read: false})
		.pipe(clean());
});