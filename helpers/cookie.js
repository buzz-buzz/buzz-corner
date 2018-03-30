

const config = require('../config');

let clearCookieOption = {
    expires: new Date(1970, 1, 1),
    path: '/',
    httpOnly: true
};
let sessionCookieOption = {
    expires: new Date(Date.now() + 365*24*60*60*1000),
    path: '/',
    httpOnly: true
};

// if (process.env.NODE_ENV === 'prd') {
//     sessionCookieOption.domain = config.rootDomain;
// }

let o = {
    setUserId: function (token) {
        this.cookies.set('user_id', token, sessionCookieOption);
    },
    deleteUserId: function () {
        this.cookies.set('user_id', '', clearCookieOption);
    }
};

o.resetSignOnCookies = function (result) {
    o.deleteUserId.call(this);
    o.setUserId.call(this, result.token);
};

module.exports = o;
