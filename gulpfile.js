const gulp         = require('gulp');
const postcss      = require('gulp-postcss');
const environments = require('gulp-environments');
const sourcemaps   = require('gulp-sourcemaps');
const del          = require('del');
const bs           = require('browser-sync').create();
const watch        = require('gulp-watch');
const spritesmith  = require('gulp.spritesmith');

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
  dist: {
    html:    './dist/',
    js:      './dist/js/',
    css:     './dist/css/',
    img:     './dist/img/'
  },
  src: {
    html:    './src/*.html',
    js:      './src/js/**/*.js',
    css:     './src/css/**/*.css',
    postcss: './src/postcss/**/*.css',
    img:     './src/img/**/*.*'
  },
  watch: {
    html:    './src/**/*.html',
    js:      './src/js/**/*.js',
    css:     './src/postcss/**/*.css',
    postcss: './src/postcss/**/*.css',
    img:     './src/img/**/*.*'
  },
  clean: './dist'
};

gulp.task('css:dev', function () {
  return gulp.src(path.src.postcss)
    .pipe(dev(sourcemaps.init()))
    .pipe(postcss(postcss_for_dev))
    .pipe(dev(sourcemaps.write('.')))
    .pipe(gulp.dest(path.dist.css))
    .pipe(bs.stream());
});


gulp.task('css:prod', function () {
  return gulp.src(path.src.postcss)
    .pipe(dev(sourcemaps.init()))
    .pipe(postcss(postcss_for_prod))
    .pipe(dev(sourcemaps.write('.')))
    .pipe(gulp.dest(path.dist.css))
    .pipe(bs.stream());
});

gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.dist.html))
    .pipe(bs.stream());
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.src.img).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest(path.dist.img));
});

gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: [path.dist.html]
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

gulp.task('clear', function() {
  return del.sync(path.clean);
});

gulp.task('build', ['clear', 'css:prod', 'html:build']);

gulp.task('default', ['clear', 'css:dev', 'html:build', 'watch']);