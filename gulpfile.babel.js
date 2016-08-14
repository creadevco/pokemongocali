/** gulpfile.babel.js
* Author: Juan Roa, CreaDev.co
* Copyright (C) 2016 Juan Roa
* Version 2.1.0
* Author URL: http://juanroa.me
* Free to use and distribute under the MIT License
* https://opensource.org/licenses/MIT
*/

import gulp from "gulp";
import sass from "gulp-ruby-sass";
import browserSync from "browser-sync";
import runSequence from 'run-sequence';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import useref from 'gulp-useref';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';
import cssnano from 'gulp-cssnano';
import ghPages from 'gulp-gh-pages';

/**
* Compile with gulp-ruby-sass
*/

gulp.task("sass", () => {
  console.log("compiling scss")
  return sass("src/assets/scss/style.scss")
  .on("error", sass.logError)
  // Writes converted css to dest url
  .pipe(gulp.dest("src/assets/css"))
  .pipe(browserSync.stream({match: "dist/*.css"}))
});

gulp.task('deploy', () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

/*
* Static Server + watching scss/html files
*/
gulp.task("serve", () => {
  browserSync({
    server: {
      baseDir: "dist"
    },
  })
});

gulp.task("watch", () => {
  /**
  * Listens changes for all .html files and reloads the browser
  * In the case of spanish html files, it executes de min task before.
  */
  gulp.watch("src/*.html", ["min", browserSync.reload]);
  /**
  * Listens changes for all .scss files and runs the sass and min tasks
  * also, it reloads the browser after that.
  */
  gulp.watch("src/assets/scss/*.scss", ["sass", browserSync.reload]);
  gulp.watch("src/assets/scss/*.scss", ["min", browserSync.reload]);
  /**
  * Listens changes for all english .html files and runs the en task
  */
  gulp.watch("src/en/*.html", ["en", browserSync.reload]);

});

gulp.task('x', callback => {
  runSequence('serve', 'watch', callback);
});

gulp.task('images', () => gulp.src('src/assets/images/**/*.+(png|jpg|gif|svg)')
.pipe(imagemin())
.pipe(gulp.dest('dist/assets/images')));

gulp.task('minify', () => gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
  .pipe(gulp.dest('dist')));

gulp.task('min', () => gulp.src('src/*.html')
.pipe(useref())
// Minifies only if it's a JS file
.pipe(gulpIf('*.js', uglify({mangle: false})))
// Minifies only if it's a CSS file
.pipe(gulpIf('*.css', cssnano()))
.pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true, removeComments: true})))
.pipe(gulp.dest('dist')));


// It just copies the english html files to dist
gulp.task('en', () => gulp.src('src/en/*.html')
.pipe(useref())
.pipe(gulp.dest('dist/en')));


// Copying fonts to dist
gulp.task('fonts', () => gulp.src('src/assets/fonts/**/*')
.pipe(gulp.dest('dist/assets/fonts')))
