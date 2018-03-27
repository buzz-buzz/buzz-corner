'use strict';

let config_qiniu = {
    ACCESS_KEY: process.env.buzz_qiniu_access_key,
    SECRET_KEY: process.env.buzz_qiniu_secret_key,
    bucket: "buzz-corner-user-resource",
    url: {
        upload_url: 'http://upload.qiniu.com/',
        resources_url:  'http://p57969ygc.bkt.clouddn.com/'
    }
};

module.exports = config_qiniu;
