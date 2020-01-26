const gulp = require('gulp');
const connect = require('gulp-connect');
const typedoc = require('gulp-typedoc');
const typedocConfig = require('./typedoc.json');

/*
[!} IMPORTANT
While running gulp-typedoc for livereload served docs - it will delete 'out' property from typedocConfig
object for whatever hell knows reason. Wasted 30m on this bs...
*/

function serveTask(done) {
  connect.server(
    {
      name: 'Docs',
      root: 'docs',
      livereload: true,
      port: 8000,
    },
    function() {
      this.server.on('close', done);
    }
  );
}

function watchTypeScriptTask(done) {
  gulp
    .watch('src/**/*.ts')
    .on('change', filepath =>
      gulp.src(filepath, { read: false }).pipe(typedoc({ ...typedocConfig }))
    );
  done();
}

function watchDocsTask(done) {
  gulp
    .watch('docs')
    .on('change', filepath =>
      gulp.src(filepath, { read: false }).pipe(connect.reload())
    );
  done();
}

gulp.task('docs:build', function() {
  return gulp.src(['src/**/*.ts']).pipe(typedoc({ ...typedocConfig }));
});

gulp.task(
  'docs:watch',
  gulp.series(
    'docs:build',
    gulp.parallel(watchTypeScriptTask, watchDocsTask, serveTask)
  )
);
