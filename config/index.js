'use strict';

let config = {
    development: {
        endPoints: {
            buzzCorner: 'http://localhost:16111',
            buzzService: `${process.env.cors}/127.0.0.1:16888/`,
            upload_qiniu: 'http://uat.hcd.com:10003'
        },

        logger: {
            appName: 'buzz-corner'
        },

        superUsers: [532],

    },

    staging: {
        endPoints: {
            buzzService: 'https://buzz-corner-service.herokuapp.com'
        },

        superUsers: [532]
    },

    qa: {
        endPoints: {
            buzzCorner: 'http://live.buzzbuzzenglish.com',
            buzzService: 'http://localhost:16888',
            upload_qiniu: 'http://service.hcdlearning.com:10003'
        },

        logger: {
            appName: 'buzz-corner'
        },

        superUsers: [56],

        rootDomain: '.buzzbuzzenglish.com'
    },
    production: {
        endPoints: {
            buzzCorner: 'http://live.buzzbuzzenglish.com',
            buzzService: process.env.buzz_service_endpoints,
            upload_qiniu: 'http://service.hcdlearning.com:10003'
        },

        logger: {
            appName: 'buzz-corner'
        },

        superUsers: [3],
        rootDomain: '.buzzbuzzenglish.com'
    }
};

module.exports = config[process.env.NODE_ENV || 'development'] || config.development;
