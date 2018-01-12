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
            sso: 'http://10.20.32.61:10086'
        },

        logger: {
            appName: 'buzz-corner'
        }
    },
    uat: {
        sso: {
            inner: {
                "host": "uat.service.hcd.com",
                "port": 10086
            }
        },
        endPoints: {
            interview: 'http://10.20.32.61:12789',
            video: 'http://uat.bridgeplus.cn',
            masr: 'http://10.20.32.61:12444',
            hongda: 'http://10.20.32.51:10126',
            thirdParty: 'http://10.20.32.61:10101',
            buzzCorner: 'http://10.20.32.51:16111',
            sso: 'http://10.20.32.61:10086'
        },

        logger: {
            appName: 'buzz-corner'
        }
    },
    prd: {
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
            sso: 'http://service.bridgeplus.cn:10086'
        },

        logger: {
            appName: 'buzz-corner'
        }
    }
};

config.production = config.prd;

module.exports = config[process.env.NODE_ENV || 'development'] || config.development;