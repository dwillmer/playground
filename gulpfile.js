/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, S. Chris Colbert
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

var del = require('del');
var concat = require('gulp-concat');
var gulp = require('gulp');
var header = require('gulp-header');
var nib = require('nib');
var rename = require('gulp-rename');
var stream = require('event-stream');
var stylus = require('gulp-stylus');
var typedoc = require('gulp-typedoc');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');


var buildTypings = [
  './bower_components/phosphor/dist/phosphor.d.ts',
  './typings/es6-promise/es6-promise.d.ts'
];

var examplesTypings = buildTypings.concat([
]);

var testsTypings = buildTypings.concat([
]);


var tsSources = [
  'terminal',
  'sidecar'
].map(function(name) { return './src/' + name + '.ts'; });


var stylSources = './styl/index.styl';


gulp.task('clean', function(cb) {
  del(['./dist'], cb);
});


gulp.task('src', function() {
  var project = typescript.createProject({
    declarationFiles: true,
    noImplicitAny: true,
    target: 'ES5',
  });

  var src = gulp.src(buildTypings.concat(tsSources))
    .pipe(typescript(project));

  var dts = src.dts.pipe(concat('phosphor-playground.d.ts'))
    .pipe(gulp.dest('./dist'));

  var js = src.pipe(concat('phosphor-playground.js'))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('./dist'));

  return stream.merge(dts, js);
});


gulp.task('styl', function() {
  return gulp.src(stylSources)
    .pipe(stylus({ use: [nib()] }))
    .pipe(rename('phosphor-playground.css'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('build', ['src', 'styl']);


gulp.task('dist', ['build'], function() {
  return gulp.src('./dist/phosphor-playground.js')
    .pipe(uglify())
    .pipe(rename('phosphor-playground.min.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('watch', function() {
  gulp.watch(tsSources, ['src']);
});


gulp.task('examples', function() {
  var project = typescript.createProject({
    declarationFiles: false,
    noImplicitAny: true,
    target: 'ES5',
  });

  var sources = examplesTypings.concat([
    'dist/phosphor-playground.d.ts',
    'examples/**/*.ts'
  ]);

  var src = gulp.src(sources)
    .pipe(typescript(project))
    .pipe(rename(function (path) {
      path.dirname += '/build'; }))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('examples'));

  var css = gulp.src('examples/**/index.styl')
    .pipe(stylus({ use: [nib()] }))
    .pipe(rename(function (path) {
      path.dirname += '/build'; }))
    .pipe(gulp.dest('examples'));

  return stream.merge(src, css);
});


gulp.task('docs', function() {
  return gulp.src(buildTypings.concat(tsSources))
    .pipe(typedoc({
      out: './build/docs',
      name: 'Phosphor Terminal',
      target: 'ES5',
      mode: 'file',
      includeDeclarations: false }));
});


gulp.task('tests', function() {
  var project = typescript.createProject({
    declarationFiles: false,
    noImplicitAny: true,
    target: 'ES5',
  });

  var sources = testsTypings.concat([
    'dist/phosphor-playground.d.ts',
    'tests/**/*.ts'
  ]);

  return gulp.src(sources)
    .pipe(typescript(project))
    .pipe(concat('index.js'))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('tests/build'));
});


gulp.task('default', ['dist']);
