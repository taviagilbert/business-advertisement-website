//gulp
var gulp = require("gulp");

//gulp css
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var cleanCSS = require("gulp-clean-css");

//gulp browser tools
var browserSync = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");

//gulp Js
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");

// Image compression
var imagemin = require("gulp-imagemin");
var imageminGifsicle = require("imagemin-gifsicle");
var imageminJpegtran = require("imagemin-jpegtran");
var imageminOptipng = require("imagemin-optipng");
var imageminSvgo = require("imagemin-svgo");
var imageminPngquant = require("imagemin-pngquant");
var imageminJpegRecompress = require("imagemin-jpeg-recompress");

//Helper tools
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var del = require("del");

// Configuration file - Defining base paths
var cfg = require("./gulpconfig.json");
var Basepaths = cfg.Basepaths;

////////////////// COPY ALL ASSETS /////////////////////////

gulp.task("copy-assets", function() {
  ////////////////// SASS /////////////////////////

  // Copy all fontisto sass
  var stream = gulp
    .src(Basepaths.NODE + "fontisto/sass/fontisto/**/*.scss")

    .pipe(gulp.dest(Basepaths.DEV + "/node_sass/fontisto"));

  // Copy all fork-awesome sass
  gulp
    .src(Basepaths.NODE + "fork-awesome/scss/**/*.scss")
    .pipe(gulp.dest(Basepaths.DEV + "/node_sass/fork-awesome"));

  ////////////////// SASS END  /////////////////////////

  ////////////////// JS  /////////////////////////

  gulp
    .src(Basepaths.NODE + "jquery/dist/jquery.min.js")
    .pipe(gulp.dest(Basepaths.JS + "/jquery"));

  ////////////////// JS END  /////////////////////////

  ////////////////// FONTS /////////////////////////

  // Copy fontisto fonts
  gulp
    .src(
      Basepaths.NODE + "fontisto/fonts/fontisto/**/*.{ttf,woff,woff2,eof,svg}"
    )
    .pipe(gulp.dest(Basepaths.FONTS + "/fontisto"));

  // Copy fork-awesome fonts
  gulp
    .src(Basepaths.NODE + "fork-awesome/fonts/**/*.{ttf,woff,woff2,eof,svg}")
    .pipe(gulp.dest(Basepaths.FONTS + "/ForkAwesome"));

  ////////////////// FONTS END /////////////////////////

  return stream;
});

////////////////// COPY ALL ASSETS END /////////////////////////

////////////////// STYLES  /////////////////////////

// compile & minify sass
gulp.task("styles", function() {
  return gulp
    .src(Basepaths.SCSS + "/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(Basepaths.CSS))
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(Basepaths.CSS));
});

////////////////// STYLES END /////////////////////////

//////////////////  SCRIPTS /////////////////////////

//copy js files and concat into one js file, and minifiy js
gulp.task("scripts", function() {
  var scripts = [Basepaths.JS + "/custom/main.js"];

  return gulp
    .src(scripts)
    .pipe(concat("theme.js"))
    .pipe(gulp.dest(Basepaths.JS + "/dist"))
    .pipe(concat("theme.min.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(Basepaths.JS + "/dist"));
});

//////////////////  SCRIPTS END /////////////////////////

////////////////// COMPRESS IMAGES /////////////////////////

// Images
gulp.task("images", function() {
  return gulp
    .src(Basepaths.IMAGES_PATH)
    .pipe(
      imagemin({
        plugins: [
          imageminGifsicle(),
          imageminJpegtran(),
          imageminOptipng(),
          imageminSvgo(),
          imageminPngquant(),
          imageminJpegRecompress()
        ]
      })
    )
    .pipe(gulp.dest(Basepaths.IMAGES_PATH));
});

//////////////////  COMPRESS IMAGES END /////////////////////////

////////////////// WATCH /////////////////////////

gulp.task("watch", function() {
  gulp.watch(Basepaths.SCSS, gulp.series("styles"));
  gulp.watch(Basepaths.JS, gulp.series("scripts"));
});

////////////////// WATCH END ////////////////////////

////////////////// BROWSER-SYNC /////////////////////////

gulp.task("browser-sync", function() {
  browserSync.init(cfg.browserSyncWatchFiles, cfg.browserSyncOptions);
});

////////////////// BROWSER-SYNC END /////////////////////////

////////////////// CLEAN  /////////////////////////

gulp.task("clean", function() {
  return del([
    Basepaths.DEV, Basepaths.NODE
  ]);
});

////////////////// CLEAN END  /////////////////////////

// Default Tasks
gulp.task("default", gulp.parallel("watch", "browser-sync"));
