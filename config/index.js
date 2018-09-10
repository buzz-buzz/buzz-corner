let config = {
    development: {
        endPoints: {
            buzzCorner: 'http://localhost:16111',
            buzzService: `${process.env.cors}/127.0.0.1:16888/`,
            upload_qiniu: 'http://uat.hcd.com:10003'
        },
        wechatRedirectUrl: 'localhost'
    },

    qa: {
        endPoints: {
            buzzCorner: 'http://live.buzzbuzzenglish.com',
            buzzService: 'http://localhost:16888',
            upload_qiniu: 'http://service.hcdlearning.com:10003'
        },
        wechatRedirectUrl: 'live.buzzbuzzenglish.com',

        rootDomain: '.buzzbuzzenglish.com'
    },
    production: {
        endPoints: {
            buzzCorner: 'http://live.buzzbuzzenglish.com',
            buzzService: process.env.buzz_service_endpoints,
            buzzService1: process.env.buzz_service1_endpoints,
            buzzService2: process.env.buzz_service2_endpoints,
            upload_qiniu: 'http://service.hcdlearning.com:10003'
        },

        wechatRedirectUrl: 'live.buzzbuzzenglish.com',

        rootDomain: '.buzzbuzzenglish.com'
    }
};

module.exports = config[process.env.NODE_ENV || 'development'] || config.development;
