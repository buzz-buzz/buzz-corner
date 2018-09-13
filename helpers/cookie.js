let config = require('../config');
let buzzDomains = [
    '.live.buzzbuzzenglish.com',
    'live.buzzbuzzenglish.com',
    '.corner-test.buzzbuzzenglish.com',
    'corner-test.buzzbuzzenglish.com',
    'buzzbuzzenglish.com',
    '.buzzbuzzenglish.com'
];

let clearCookieOption = {
    expires: new Date(1970, 1, 1),
    path: '/',
    httpOnly: true
};
let sessionCookieOption = {
    expires: 0,
    path: '/',
    httpOnly: true
};

// if (process.env.NODE_ENV === 'prd') {
//     sessionCookieOption.domain = config.rootDomain;
// }

let o = {
    setUserId: function (user_id) {
        this.cookies.set('user_id', user_id, sessionCookieOption);

        if (config.rootDomain) {
            this.cookies.set('user_id', user_id, Object.assign({}, sessionCookieOption, {domain: config.rootDomain}));
        }
    },
    deleteUserId: function () {
        this.cookies.set('user_id', '', clearCookieOption);
        buzzDomains.map((item, index)=>{
            this.cookies.set('user_id', '', {
                ...clearCookieOption,
                domain: item
            });
        });
    }
};

o.resetSignOnCookies = function () {
    o.deleteUserId.call(this);
};

module.exports = o;
