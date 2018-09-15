var replace = require('gulp-replace');
var gulp = require('gulp');
var pkg = require('./package.json');

// var fs = require('fs');
// var path = require('path');
// var qiniu = require('qiniu');
// const config_qiniu = {
//     ACCESS_KEY: process.env.buzz_qiniu_access_key,
//     SECRET_KEY: process.env.buzz_qiniu_secret_key,
//     bucket: 'buzz-corner-user-resource',
//     url: {
//         upload_url: 'https://upload.qiniup.com/',
//         resources_url: 'https://buzz-corner.user.resource.buzzbuzzenglish.com/',
//     },
// }
// gulp.task('upload', async () => {
//   const mac = new qiniu.auth.digest.Mac(config_qiniu.ACCESS_KEY, config_qiniu.SECRET_KEY)
//   const putPolicy = new qiniu.rs.PutPolicy({
//       scope: config_qiniu.bucket,
//   })
//
//   const config = new qiniu.conf.Config()
//   // 空间对应的机房
//   config.zone = qiniu.zone.Zone_z0
//   // 是否使用https域名
//   config.useHttpsDomain = true
//   // 上传是否使用cdn加速
//   config.useCdnDomain = true
//
//   const formUploader = new qiniu.form_up.FormUploader(config)
//   const putExtra = new qiniu.form_up.PutExtra()
//   const uploadToken = putPolicy.uploadToken(mac)
//   console.log(fs.readdirSync(path.join(__dirname, 'build', 'static')))
//   // formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
//   // respBody, respInfo) {
//   //   if (respErr) {
//   //     throw respErr;
//   //   }
//   //   if (respInfo.statusCode === 200) {
//   //     console.log(respBody);
//   //   } else {
//   //     console.log(respInfo.statusCode);
//   //     console.log(respBody);
//   //   }
//   // });
// });

gulp.task('cdn', function () {
    let cdnifiedUrl = '//cdn-corner.buzzbuzzenglish.com/static/';
    if (process.env.NODE_ENV === 'qa') {
        cdnifiedUrl = '//cdn-corner-test.buzzbuzzenglish.com/corner-test/static/';
    }
    return gulp.src(['build/index.html'])
        .pipe(replace(/"\/static\//g, `"${cdnifiedUrl}`))
        .pipe(gulp.dest('build/'));
});

gulp.task('track', function () {
    const url = `https://jic.talkingdata.com/app/h5/v1?appid=9E0813F899A5460D953190DF02F25381&vn=${pkg.name}_${process.env.NODE_ENV}&vc=${pkg.version}`;

    return gulp.src(['build/index.html', 'build/wechat-oauth-success.html'])
        .pipe(replace('/track_script_placeholder.js', url))
        .pipe(gulp.dest('build/'));
});

gulp.task('fundebug', function () {
    const url = `https://js.fundebug.cn/fundebug.1.0.1.min.js`;

    return gulp.src(['build/index.html', 'build/wechat-oauth-success.html'])
        .pipe(replace('/fundebug.js', url))
        .pipe(gulp.dest('build/'));
});

gulp.task('fonts', () => {
    const fonts = `//cdn-admin.buzzbuzzenglish.com/css/css.css`;

    return gulp.src(['node_modules/semantic-ui-css/semantic.css', 'node_modules/semantic-ui-css/semantic.min.css'])
        .pipe(replace('https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin', fonts))
        .pipe(replace('https://cdn-admin.buzzbuzzenglish.com/css/css.css', fonts))
        .pipe(gulp.dest('node_modules/semantic-ui-css/'));
});

gulp.task('default', gulp.series('cdn', 'track', 'fundebug', 'fonts'));
