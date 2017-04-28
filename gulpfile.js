const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const ts = require('gulp-typescript');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

const plugins = gulpLoadPlugins();
const tsProject = ts.createProject('tsconfig.json');

const paths = {
  ts: ['./**/*.ts', '!dist/**', '!node_modules/**', '!coverage/**'],
  nonTs: ['./package.json', './.gitignore', './.env'],
  tests: './server/**/*.test.ts'
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage'])
);

// Copy non-ts files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonTs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

// Compile typescript and copy to dist
gulp.task('typescript', () =>
  tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'typescript'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'typescript']
  })
);

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'typescript']
  );
});
