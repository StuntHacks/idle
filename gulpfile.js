const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const through2 = require("through2");
const path = require("path");
const fs = require("fs");

gulp.task("preprocess-svgs", function () {
  return gulp
    .src("src/assets/icons/*.svg")
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const contents = file.contents.toString();
          const modified = contents.replace(
            ' style="height: 512px; width: 512px;"',
            ""
          );
          file.contents = Buffer.from(modified);
        }
        cb(null, file);
      })
    )
    .pipe(gulp.dest("src/assets/icons"));
});

gulp.task("html", function () {
  return gulp
    .src(["src/html/index.html"])
    .pipe(
      fileInclude({
        prefix: "@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("build"));
});

gulp.task("watch", function () {
  gulp.watch("src/html/**/*.html", gulp.series("preprocess-svgs", "html"));
});
