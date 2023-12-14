const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

function fonts() {
  return src('src/fonts/raw/*.*')
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(src('src/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('src/fonts'));
}

function images() {
  return src('src/img/raw/**/*.*')
    .pipe(newer('src/img'))
    .pipe(webp())

    .pipe(src('src/img/raw/**/*.*'))
    .pipe(newer('src/img'))
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
      ])
    )
    .pipe(dest('src/img'));
}

function scripts() {
  return src('src/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('src/scss/main.scss')
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

const htmlmin = require('gulp-htmlmin');

function html() {
  return src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function watcher() {
  browserSync.init({
    server: {
      baseDir: 'src/',
    },
    notify: false,
  });
  watch(['src/scss'], styles);
  watch(['src/img/raw'], images);
  watch(['src/js/main.js'], scripts);
  watch(['src/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('dist').pipe(clean());
}

function building() {
  return src(
    [
      'src/css/style.min.css',
      'src/img/**/*.*',
      '!src/img/raw/**',
      'src/fonts/*.*',
      'src/js/main.min.js',
    ],
    {
      base: 'src',
    }
  ).pipe(dest('dist'));
}

exports.styles = styles;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.scripts = scripts;
exports.watcher = watcher;

exports.build = series(cleanDist, html, building);
exports.default = parallel(styles, images, scripts, fonts, watcher);
