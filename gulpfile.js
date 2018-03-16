var replace = require('gulp-replace');
var gulp = require('gulp');

gulp.task('cdn', function () {
    let cdnifiedUrl = '//cdn-corner-test.buzzbuzzenglish.com/static/';
    if (process.env.NODE_ENV === 'production') {
        cdnifiedUrl = '//cdn-corner.buzzbuzzenglish.com/static/';
    }
    gulp.src(['build/index.html'])
        .pipe(replace('/static/', cdnifiedUrl))
        .pipe(gulp.dest('build/'));
});