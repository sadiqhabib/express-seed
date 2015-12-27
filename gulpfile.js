/* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
'use strict';

/**
 * External dependencies
 */
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var debounce = require('debounce');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var nodemon = require('gulp-nodemon');
var jasmine = require('gulp-jasmine');
var stylish = require('gulp-jscs-stylish');
var Jasminereporter = require('jasmine-spec-reporter');

/**
 * Application dependencies
 */
var mergeSources = require('./utils/merge-sources');

/**
 * Assets
 */
var assets = {
  env: [
    'env/*.js'
  ],
  app: [
    'app/**/*.js',
    'app/**/*.json',
    '!app/**/*.spec.js'
  ],
  tests: [
    'app/**/*.spec.js'
  ]
};

/*****************************************************************************
 * Tasks
 ***/

/**
 * Lint code
 */
function lintCode() {
  return gulp.src(mergeSources(
    assets.env,
    assets.app,
    assets.tests
  )).pipe(cached('lintCode'))
    .pipe(jshint())
    .pipe(jscs())
    .on('error', function() {})
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
}

/**
 * Run unit tests
 */
function testCode() {
  return gulp.src(assets.tests)
    .pipe(jasmine({
      reporter: new Jasminereporter()
    }));
}

/**
 * Watch code
 */
function watchCode() {
  gulp.watch(mergeSources(
    assets.env,
    assets.app,
    assets.tests
  ), debounce(gulp.series(
    lintCode, testCode
  ), 200));
}

/**
 * Start nodemon
 */
function startNodemon() {
  nodemon({
    script: 'scripts/server.js'
  });
}

/*****************************************************************************
 * CLI exposed tasks
 ***/

/**
 * Tasks
 */
gulp.task('lint', lintCode);
gulp.task('test', testCode);
gulp.task('watch', watchCode);
gulp.task('start', startNodemon);

/**
 * Default task
 */
gulp.task('default', gulp.series(
  gulp.parallel('lint', 'test'), gulp.parallel('watch', 'start')
));
