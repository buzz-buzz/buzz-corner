var replace = require('gulp-replace');
var gulp = require('gulp');
var pkg = require('./package.json');

gulp.task('cdn', function () {
    let cdnifiedUrl = '//cdn-corner.buzzbuzzenglish.com/static/';
    if (process.env.NODE_ENV === 'qa') {
        cdnifiedUrl = '//cdn-corner-test.buzzbuzzenglish.com/static/';
    }

    return gulp.src(['build/index.html'])
        .pipe(replace(/"\/static\//g, `"${cdnifiedUrl}`))
        .pipe(gulp.dest('build/'));
});

gulp.task('track', function () {
    const url = `https://jic.talkingdata.com/app/h5/v1?appid=9E0813F899A5460D953190DF02F25381&vn=${pkg.name}_${process.env.NODE_ENV}&vc=${pkg.version}`;

    return gulp.src(['build/index.html'])
        .pipe(replace('/track_script_placeholder.js', url))
        .pipe(gulp.dest('build/'));
});

gulp.task('fundebug', function () {
    const url = `https://js.fundebug.cn/fundebug.0.3.6.min.js`;

    return gulp.src(['build/index.html'])
        .pipe(replace('/fundebug.js', url))
        .pipe(gulp.dest('build/'));
});

gulp.task('fonts', () => {
    const fonts = `http://cdn-admin.buzzbuzzenglish.com/css/css.css`;

    return gulp.src(['node_modules/semantic-ui-css/semantic.css', 'node_modules/semantic-ui-css/semantic.min.css'])
        .pipe(replace('https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin', fonts))
        .pipe(gulp.dest('node_modules/semantic-ui-css/'));
});

gulp.task('default', gulp.series('cdn', 'track', 'fundebug', 'fonts'));