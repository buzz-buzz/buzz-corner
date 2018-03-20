var replace = require('gulp-replace');
var gulp = require('gulp');

gulp.task('cdn', function () {
    let cdnifiedUrl = '//cdn-corner.buzzbuzzenglish.com/static/';
    if (process.env.NODE_ENV === 'qa') {
        cdnifiedUrl = '//cdn-corner-test.buzzbuzzenglish.com/static/';
    }
    gulp.src(['build/index.html'])
        .pipe(replace('/static/', cdnifiedUrl))
        .pipe(gulp.dest('build/'));
});