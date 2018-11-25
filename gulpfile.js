// Gulp.js configuration

let gulp = require('gulp');
//let concat = require('gulp-concat');
let deporder = require('gulp-deporder');
let stripdebug = require('gulp-strip-debug');
let terser = require('gulp-terser'); // Uglify

// development mode?
var devBuild = false; //(process.env.NODE_ENV !== 'production'),

gulp.task('dist', function () {

  let jsbuild = gulp.src('src/**.js')
    .pipe(deporder());

  if (!devBuild) {
    jsbuild = jsbuild
      .pipe(stripdebug())
      .pipe(terser())
      .on('error', function (err) {
        console.log(err.toString());//gutil.log(gutil.colors.red('[Error]'), err.toString());
      });
  }

  return jsbuild.pipe(gulp.dest('dist'));

});
