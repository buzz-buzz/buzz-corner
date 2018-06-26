let config = require('../config')

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
            this.cookies.set('user_id', user_id, Object.assign({}, sessionCookieOption, { domain: config.rootDomain }));
        }
    },
    deleteUserId: function () {
        this.cookies.set('user_id', '', clearCookieOption);
        let options = { ...clearCookieOption, domain: config.rootDomain };
        this.cookies.set('user_id', '', options);
    }
};

o.resetSignOnCookies = function () {
    o.deleteUserId.call(this);
};

module.exports = o;
