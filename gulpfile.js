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
  require("stylelint")({
    "rules": {
      "indentation": 2
    }
  }),
  require('postcss-url'),
  require('postcss-cssnext'),
  require('postcss-short'),
  require('postcss-browser-reporter'),
  require('postcss-reporter')({ clearMessages: true })
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
    html:    './build/',
    js:      './build/js/',
    css:     './build/css/',
    img:     './build/img/'
  },
  app: {
    root:    './app/',
    html:    './app/*.html',
    js:      './app/js/**/*.js',
    css:     './app/css/**/*.css',
    postcss: './app/postcss/**/*.css',
    img:     './app/img/**/*.*'
  },
  watch: {
    html:    './app/**/*.html',
    js:      './app/js/**/*.js',
    css:     './app/postcss/**/*.css',
    postcss: './app/postcss/**/*.css',
    img:     './app/img/**/*.*'
  },
  clean: './build'
};

gulp.task('css:dev', function () {
  return gulp.src(path.app.postcss)
    .pipe(dev(sourcemaps.init()))
    .pipe(postcss(postcss_for_dev))
    .pipe(dev(sourcemaps.write('.')))
    .pipe(gulp.dest(path.app.css))
    .pipe(bs.stream());
});


gulp.task('css:prod', function () {
  return gulp.src(path.app.postcss)
    .pipe(dev(sourcemaps.init()))
    .pipe(postcss(postcss_for_prod))
    .pipe(dev(sourcemaps.write('.')))
    .pipe(gulp.dest(path.build.css))
    .pipe(bs.stream());
});

gulp.task('html:build', function () {
  return gulp.src(path.app.html)
    .pipe(gulp.dest(path.app.root))
    .pipe(bs.stream());
});

gulp.task('clear', function() {
  return del.sync(path.clean);
});


gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: [path.app.root]
    },
    port: 8080,
    host: 'localhost',
    logPrefix: 'profitway-log',
    open: false
  });
});


gulp.task('watch', ['bs', 'css:dev', 'html:build'], function () {
  watch([path.watch.postcss], function(event, cb) {
    gulp.start('css:dev');
  });
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
});

gulp.task('build', ['css:prod', 'html:build']);

gulp.task('default', ['css:dev', 'html:build', 'watch']);