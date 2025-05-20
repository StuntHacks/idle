const gulp = require("gulp");
const fileInclude = require("gulp-file-include");

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
  gulp.watch("src/html/**/*.html", gulp.series("html"));
});
