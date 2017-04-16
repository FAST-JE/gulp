var gulp = require('gulp');
var postcss = require('gulp-postcss');
var environments = require('gulp-environments');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var bs = require('browser-sync').create();
var watch = require('gulp-watch');

var dev = environments.development;
var prod = environments.production;

var postcss_for_dev = [
  require('postcss-import'),
  require('postcss-url'),
  require('postcss-cssnext'),
  require('postcss-short'),
  require('postcss-browser-reporter'),
  require('postcss-reporter'),
  require('stylelint')
];

var postcss_for_prod = [
  require('postcss-import'),
  require('postcss-url'),
  require('postcss-cssnext'),
  require('postcss-short'),
  require('postcss-reporter'),
  require('cssnano')({ autoprefixer: false })
];

var path = {
  build: {
    html: './build/',
      js: './build/js/',
     css: './build/css/',
     img: './build/img/'
  },
  app: {
    html: './app/*.html',
      js: './app/js/**/*.js',
     css: './app/postcss/**/.css',
     img: './app/img/**/*.*'
  },
  watch: {
    html: './app/**/*.html',
      js: './app/js/**/*.js',
     css: './app/postcss/**/*.css',
     img: './app/img/**/*.*'
  },
  clean: './build'
};

gulp.task('css:dev', function () {
  return gulp.src(path.app.css)
    .pipe(dev(sourcemaps.init()))
    .pipe(postcss(postcss_for_dev))
    .pipe(dev(sourcemaps.write('.')))
    .pipe(gulp.dest(path.build.css))
    .pipe(bs.stream());
});

gulp.task('css:prod', function () {
  return gulp.src(path.app.css)
    .pipe(dev(sourcemaps.init()))
    .pipe(postcss(postcss_for_prod))
    .pipe(dev(sourcemaps.write('.')))
    .pipe(gulp.dest(path.build.css))
    .pipe(bs.stream());
});

gulp.task('clear', function() {
  return del.sync(path.clean);
});

gulp.task('watch', ['bs', 'css'], function () {
  gulp.watch('./app/postcss/**/*.css', ['css']);
  gulp.watch('app/**/*.html', bs.reload);
  gulp.watch('app/js/**/*.js', bs.reload);
});

gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: path.build
    },
    port: 8080,
    host: 'localhost',
    logPrefix: 'profitway-log',
    open: false
  });
});