const config = require('../config');

let clearCookieOption = {
    expires: new Date(1970, 1, 1),
    path: '/',
    httpOnly: true
};
let longCookie = {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    path: '/',
    httpOnly: true
};

// if (process.env.NODE_ENV === 'prd') {
//     sessionCookieOption.domain = config.rootDomain;
// }

let o = {
    setUserId: function (user_id) {
        this.cookies.set('user_id', user_id, longCookie);
    },
    deleteUserId: function () {
        this.cookies.set('user_id', '', clearCookieOption);
    }
};

o.resetSignOnCookies = function () {
    o.deleteUserId.call(this);
};

module.exports = o;
