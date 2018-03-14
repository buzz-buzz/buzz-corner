var replace = require('gulp-replace');
var gulp = require('gulp');

gulp.task('cdn', function () {
    gulp.src(['build/index.html'])
        .pipe(replace('/static/', '//cdn-corner-test.buzzbuzzenglish.com/static/'))
        .pipe(gulp.dest('build/'));
});