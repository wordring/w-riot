const gulp = require('gulp')
const riot = require('gulp-riot')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')

const sass = require("gulp-sass")
const cleanCSS = require('gulp-clean-css')

const runSequence = require('run-sequence')


gulp.task('w-riot.tags.js', function () {
    return gulp
        .src('docs/tags/*/*.tag')
        .pipe(riot())
        .pipe(concat('w-riot.tags.js'))
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot.js', function () {
    return gulp
        .src(['docs/tags/w-riot.js', 'docs/js/w-riot.tags.js'])
        .pipe(concat('w-riot.js'))
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot.min.js', function () {
    return gulp
        .src('docs/js/w-riot.js')
        .pipe(uglify())
        .pipe(concat('w-riot.min.js'))
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot+riot.min.js', function () {
    return gulp
        .src(['node_modules/riot/riot.js', 'docs/js/w-riot.js'])
        .pipe(concat('w-riot+riot.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot+riot+route.min.js', function () {
    return gulp
        .src([
            'node_modules/riot/riot.js',
            'node_modules/riot-route/dist/route.js',
            'docs/js/w-riot.js'])
        .pipe(concat('w-riot+riot+route.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot.css', function () {
    return gulp
        .src(['docs/w-riot.scss', 'docs/tags/**/*.scss'])
        .pipe(sass())
        .pipe(concat('w-riot.css'))
        .pipe(gulp.dest('docs/css'))
})

gulp.task('w-riot.min.css', function () {
    return gulp
        .src('docs/css/w-riot.css')
        .pipe(cleanCSS())
        .pipe(concat('w-riot.min.css'))
        .pipe(gulp.dest('docs/css'))
})

gulp.task('build-demo-js', function() {
    return gulp
        .src('docs/demo/*.tag')
        .pipe(riot())
        .pipe(concat('w-riot.demo.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('docs/js'))
})

gulp.task('build-demo-css', function(){
    return gulp
        .src('docs/demo/*.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(concat('w-riot.demo.min.css'))
        .pipe(gulp.dest('docs/css'))
})

gulp.task('build-js', function (callback) {
    runSequence(
        'w-riot.tags.js',
        'w-riot.js',
        'w-riot.min.js',
        'w-riot+riot.min.js',
        'w-riot+riot+route.min.js')
})

gulp.task('build-css', function (callback) {
    runSequence(
        'w-riot.css',
        'w-riot.min.css')
})
gulp.task('build', function () {
    gulp.run('build-css')
    gulp.run('build-js')
    gulp.run('build-demo-js')
    gulp.run('build-demo-css')
})

