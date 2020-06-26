"use strict";

const gulp = require("gulp");
const gulpMjml = require("gulp-mjml");
const del = require("del");
const server = require("browser-sync").create();

const paths = {
  src: "./src",
  dist: "./dist",
};

function clean() {
  return del([`${paths.dist}/*`]);
}

function copy() {
  return gulp
    .src([`${paths.src}/img/**`], {
      base: "src",
    })
    .pipe(gulp.dest(paths.dist));
}

function webserver() {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch(`${paths.src}/**.*`, gulp.series(clean, copy));
  gulp.watch(`${paths.src}/*.mjml`, gulp.series(refresh, mjml));
}

function mjml() {
  return gulp
    .src(`${paths.src}/**/*.mjml`)
    .pipe(gulpMjml())
    .pipe(gulp.dest(paths.dist));
}

function refresh(done) {
  server.reload();
  done();
}

const build = gulp.series(clean, copy, mjml);
const webserverTask = gulp.series(build, webserver);
const def = gulp.series(clean, copy, webserverTask);

gulp.task("build", build);
gulp.task("default", def);
