const gulp = require('gulp');
const connect = require('gulp-connect');
const typedoc = require('gulp-typedoc');
const typedocConfig = require('./typedoc.json');
const shell = require('gulp-shell');

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
    function () {
      this.server.on('close', done);
    }
  );
}

function watchTypeScriptTask(done) {
  gulp.watch('src/**/*.ts').on('change', (filepath) =>
    gulp
      .src(filepath, { read: false })
      /*
      Using typedoc from 'gulp-typedoc' throws error
      related to `typedoc-plugin-markdown` - without that plugin
      everything works fine i.e.:
      ...pipe(typedoc({ ...typedocConfig }))

      This also generates new project.json file on ./website/.eveble/project.json. This however will require reload of Docusaurus is new files are present.
      */
      .pipe(shell(['./node_modules/.bin/typedoc <%= file.path %>']))
  );
  done();
}

function watchDocsTask(done) {
  gulp
    .watch('docs')
    .on('change', (filepath) =>
      gulp.src(filepath, { read: false }).pipe(connect.reload())
    );
  done();
}

gulp.task('docs:build', function () {
  return gulp.src(['src/**/*.ts']).pipe(typedoc({ ...typedocConfig }));
});

gulp.task(
  'docs:watch',
  gulp.series(
    'docs:build',
    gulp.parallel(watchTypeScriptTask, watchDocsTask, serveTask)
  )
);
