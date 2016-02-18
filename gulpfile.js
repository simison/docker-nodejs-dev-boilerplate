/**
 * Gulp task runner Configuration
 * - Installs frontend vendor assets using Bower
 * - Compiles SASS files to css
 * - Watches assets for changes and reloads them using LiveReload
 * - Serves the app using Nodemon
 */
'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

gulp.task('bower', function() {
  return bower();
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    ignore: ['node_modules/*', 'bower_components/*'],
    env: { 'NODE_ENV': 'development' }
  })
  .on('restart', function() {
    console.log('Nodemon restarted!')
  });
});

gulp.task('sass', function() {
  return gulp.src(['./bower_components/primer-css/scss/primer.scss', './src/*.scss'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./public/build'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./public/*.html').on('change', livereload.changed);
});

// Build
gulp.task('build', ['bower', 'sass']);

// Production
//gulp.task('production', ['build']);

// Development
gulp.task('default', ['build', 'watch', 'nodemon']);
