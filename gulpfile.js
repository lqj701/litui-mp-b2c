const gulp = require('gulp')
const rename = require('gulp-rename')
const del = require('del')

const through = require('through2')
const colors = require('ansi-colors')
const log = require('fancy-log')
const argv = require('minimist')(process.argv.slice(2))

const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const base64 = require('postcss-font-base64')

const sass = require('gulp-sass')
const combiner = require('stream-combiner2')
const babel = require('gulp-babel')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const filter = require('gulp-filter')
const jdists = require('gulp-jdists')
const ts = require('gulp-typescript')
// const htmlmin = require('gulp-htmlmin')
// const jsonminify = require('gulp-jsonminify')
// const uglify = require('gulp-uglify')
// const cssnano = require('gulp-cssnano')

const src = './src'
const dist = './dist'

const handleError = (err) => {
  console.log('\n')
  log(colors.red('Error!'))
  log('fileName: ' + colors.red(err.fileName))
  log('lineNumber: ' + colors.red(err.lineNumber))
  log('message: ' + err.message)
  log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('json', () => {
  return gulp.src(`${src}/**/*.json`).pipe(through.obj()).pipe(gulp.dest(dist))
})

gulp.task('wxml', () => {
  return gulp
    .src(`${src}/**/*.wxml`)
    .pipe(through.obj())
    .pipe(gulp.dest(dist))
})
gulp.task('wxs', () => {
  return gulp.src(`${src}/**/*.wxs`).pipe(gulp.dest(dist))
})

gulp.task('wxss', () => {
  const combined = combiner.obj([
    gulp.src(`${src}/**/*.{wxss,scss}`),
    sass().on('error', sass.logError),
    postcss([pxtorpx(), base64()]),
    through.obj(),
    rename((path) => (path.extname = '.wxss')),
    gulp.dest(dist)
  ])

  combined.on('error', handleError)
})

gulp.task('static', () => {
  return gulp.src(`${src}/static/**`).pipe(gulp.dest(`${dist}/static`))
})

gulp.task('js', () => {
  gulp
    .src(`${src}/**/*.js`)
    .pipe(through.obj())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(through.obj())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
})

gulp.task('ts', () => {
  const f = filter((file) => !/(mock|bluebird)/.test(file.path))
  gulp
    .src(`${src}/**/*.ts`)
    .pipe(through.obj())
    .pipe(ts({
      noImplicitAny: true
    }))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(through.obj())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
})

gulp.task('config', () => {
  gulp.src(`config/${argv.type}.conf.js`)
    .pipe(rename({
      basename: 'config'
    }))
    .pipe(
      babel({
        presets: ['env']
      }))
    .pipe(gulp.dest(dist))
})

gulp.task('watch', () => {
  ['wxml', 'wxss', 'ts', 'js', 'json', 'wxs'].forEach((v) => {
    gulp.watch(`${src}/**/*.${v}`, [v])
  })
  gulp.watch(`${src}/static/**`, ['static'])
  gulp.watch(`${src}/**/*.scss`, ['wxss'])
})

gulp.task('clean', () => {
  return del(['./dist/**'])
})

gulp.task('start', ['clean'], () => {
  runSequence('json', 'static', 'wxml', 'wxss', 'ts', 'js', 'wxs', 'config', 'watch')
})
