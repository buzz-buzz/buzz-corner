var replace = require('gulp-replace');
var gulp = require('gulp');
var pkg = require('./package.json');

gulp.task('cdn', function () {
    let cdnifiedUrl = '//cdn-corner.buzzbuzzenglish.com/static/';
    if (process.env.NODE_ENV === 'qa') {
        cdnifiedUrl = '//cdn-corner-test.buzzbuzzenglish.com/static/';
    }

    return gulp.src(['build/index.html'])
        .pipe(replace('/static/', cdnifiedUrl))
        .pipe(gulp.dest('build/'));
});

gulp.task('track', function () {
    const url = `https://jic.talkingdata.com/app/h5/v1?appid=9E0813F899A5460D953190DF02F25381&vn=${pkg.name}_${process.env.NODE_ENV}&vc=${pkg.version}`
    
    return gulp.src(['build/index.html'])
        .pipe(replace('track_script_placeholder', url))
        .pipe(gulp.dest('build/'));
});
