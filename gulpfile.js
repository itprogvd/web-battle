const {
  src,
  dest,
  watch,
  series
} = require('gulp');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const htmlmin = require('gulp-htmlmin');
const tinypng = require('gulp-tinypng-compress');
const concat = require('gulp-concat');

function bs() {
  serveSassAndCompile();
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  watch("src/*.html").on('change', browserSync.reload);
  watch("src/sass/**/*.sass").on('change', serveSassAndCompile);
  watch("src/sass/**/*.scss").on('change', serveSassAndCompile);
}

function serveSassAndCompile() {
  return src('src/sass/**/*.sass', 'src/sass/**/*.scss')
    .pipe(sass())
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

function html(done) {
  src('src/**.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'));
  done();
}


function imagemin(done) {
  src('src/img/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({
      key: 'xTX3St7jj6CL0Dz5D5Zy822V0G6sNhHK',
      sigFile: 'img/.tinypng-sigs'
    }))
    .pipe(dest('dist/img'));
  src('src/img/**/*.svg').pipe(dest('dist/img'));
  done();
}

function buildCSS(done) {
  src('src/css/*.css')
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(concat('style.css'))
    .pipe(dest('dist/css'));
  done();
}

exports.default = bs;
exports.build = series(buildCSS, html, imagemin);