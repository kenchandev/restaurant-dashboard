/* Obtain gulp packages. */
var gulp = require('gulp');
var jshint = require('gulp-jshint');

/* Create a default task. */
/* Configure the files to watch and target which tasks to utilize on file changes. */
gulp.task('default', ['wiredep', 'jshint'], function(){
  gulp.watch('assets/bower_components', ['wiredep']);
  gulp.watch('assets/scripts/*.js', ['jshint']);
});

/* Configure the jshint task. */
gulp.task('jshint', function(){
  return gulp.src('assets/scripts/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'));
});

/* Inject Bower components. */
gulp.task('wiredep', function(){
  var wiredep = require('wiredep').stream;
  gulp.src('./index.html')
      .pipe(wiredep({
        directory: 'assets/bower_components'
      }))
      .pipe(gulp.dest('./'));
});
