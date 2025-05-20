const gulp = require("gulp");
const fileInclude = require("gulp-file-include");

gulp.task("html", function () {
  return gulp
    .src(["html/index.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("build"));
});

gulp.task("watch", function () {
  gulp.watch("html/**/*.html", gulp.series("html"));
});
