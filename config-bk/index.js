'use strict';

let config = {
    development: {
        sso: {
            inner: {
                "host": "10.20.32.61",
                "port": 10086
            }
        },

        endPoints: {
            interview: 'http://10.20.32.61:12789',
            video: 'http://uat.bridgeplus.cn',
            masr: 'http://10.20.32.61:12444',
            hongda: 'http://10.20.32.51:10126',
            thirdParty: 'http://10.20.32.61:10101',
            buzzCorner: 'http://localhost:16111',
            sso: 'http://10.20.32.61:10086',
            buzzService: process.env.buzzService || 'https://buzz-corner-service.herokuapp.com',
            upload_qiniu: 'http://uat.hcd.com:10003'
        },

        logger: {
            appName: 'buzz-corner'
        }
    },

    staging: {
        endPoints: {
            buzzService: 'https://buzz-corner-service.herokuapp.com'
        }
    },

    qa: {
        sso: {
            inner: {
                "host": "service.bridgeplus.cn",
                "port": 10086
            }
        },

        endPoints: {
            interview: 'http://service2.bridgeplus.cn:12789',
            video: 'https://interview.bridgeplus.cn',
            masr: 'http://114.55.233.38:12444',
            hongda: 'http://114.55.233.38:10126',
            thirdParty: 'http://service.bridgeplus.cn:10101',
            buzzCorner: 'http://corner.buzzbuzzenglish.com',
            sso: 'http://service.bridgeplus.cn:10086',
            buzzService: 'http://localhost:16888',
            upload_qiniu: 'http://service.hcdlearning.com:10003'
        },

        logger: {
            appName: 'buzz-corner'
        }
    },
    production: {
        sso: {
            inner: {
                "host": "service.bridgeplus.cn",
                "port": 10086
            }
        },

        endPoints: {
            interview: 'http://service2.bridgeplus.cn:12789',
            video: 'https://interview.bridgeplus.cn',
            masr: 'http://114.55.233.38:12444',
            hongda: 'http://114.55.233.38:10126',
            thirdParty: 'http://service.bridgeplus.cn:10101',
            buzzCorner: 'http://corner.buzzbuzzenglish.com',
            sso: 'http://service.bridgeplus.cn:10086',
            buzzService: process.env.buzz_service_endpoints,
            upload_qiniu: 'http://service.hcdlearning.com:10003'
        },

        logger: {
            appName: 'buzz-corner'
        }
    }
};

module.exports = config[process.env.NODE_ENV || 'development'] || config.development;
