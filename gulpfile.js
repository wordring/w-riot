const gulp = require('gulp')
const riot = require('gulp-riot')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const runSequence = require('run-sequence')


gulp.task('w-riot.tags', function () {
    return gulp
        .src('docs/tags/*/*.tag')
        .pipe(riot())
        .pipe(concat('w-riot.tags.js'))
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot', function () {
    return gulp
        .src(['docs/tags/w-riot.js', 'docs/js/w-riot.tags.js'])
        .pipe(concat('w-riot.js'))
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot.all.min', function() {
    return gulp
        .src(['node_modules/riot/riot.js', 'docs/js/w-riot.js'])
        .pipe(concat('w-riot.all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('w-riot.min', function () {
    return gulp
        .src('docs/js/w-riot.js')
        .pipe(uglify())
        .pipe(concat('w-riot.min.js'))
        .pipe(gulp.dest('docs/js/'))
})

gulp.task('build', function (callback) {
    runSequence('w-riot.tags', 'w-riot', 'w-riot.min', 'w-riot.all.min')
})

