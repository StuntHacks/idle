const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const through2 = require("through2");
const path = require("path");
const fs = require("fs");

gulp.task("build-svg-sprite", function () {
  let symbols = "";

  const spritePath = "src/assets/icons/_sprite.svg";
  if (fs.existsSync(spritePath)) fs.unlinkSync(spritePath);

  return gulp.src("src/assets/icons/**/*.svg").pipe(
    through2.obj(
      function (file, _, cb) {
        if (file.isBuffer()) {
          let contents = file.contents.toString();
          const iconsBase = path.resolve("src/assets/icons");
          const name = path
            .relative(iconsBase, file.path)
            .replace(/\.svg$/, "")
            .replace(/[\\/]/g, "-");

          contents = contents
            .replace(/<\?xml[^>]*>/g, "")
            .replace(/<!DOCTYPE[^>]*>/g, "")
            .replace(/style="[^"]*"/g, "")
            .replace(/\sfill="[^"]*"/g, "")
            .replace(/\sfill-opacity="[^"]*"/g, "")
            .replace("font- ", "")
            .replace('<path d="M0 0h512v512H0z"></path>', "")
            .replace(/<path/g, '<path fill="currentColor"')
            .replace(
              /<svg([^>]*)>/,
              (_, attrs) => `<symbol id="${name}"${attrs}>`,
            )
            .replace(/<\/svg>/, "</symbol>");

          symbols += contents.trim() + "\n";
        }
        cb(null, file);
      },
      function (cb) {
        const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}</svg>`;
        fs.writeFileSync("src/assets/icons/_sprite.svg", sprite);
        cb();
      },
    ),
  );
});

gulp.task(
  "html",
  gulp.series("build-svg-sprite", function () {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

    return gulp
      .src(["src/html/index.html"])
      .pipe(
        fileInclude({
          prefix: "@",
          basepath: "@file",
          context: {
            VERSION: pkg.version,
          },
        }),
      )
      .pipe(gulp.dest("build"));
  }),
);

gulp.task("watch", function () {
  gulp.watch("src/html/**/*.html", gulp.series("html"));
  gulp.watch("package.json", gulp.series("html"));
  gulp.watch(
    ["src/assets/icons/**/*.svg", "!src/assets/icons/_sprite.svg"],
    { events: ["add", "unlink"] },
    gulp.series("build-svg-sprite", "html"),
  );
});
