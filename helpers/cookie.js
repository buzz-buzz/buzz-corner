'use strict';

const config = require('../config');

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

if (process.env.NODE_ENV === 'prd') {
    sessionCookieOption.domain = config.rootDomain;
}

let o = {
    setToken: function (token) {
        this.cookies.set('token', token, sessionCookieOption);
    },
    deleteToken: function () {
        this.cookies.set('token', '', clearCookieOption);
    }
};

o.resetSignOnCookies = function (result) {
    o.deleteToken.call(this);
    o.setToken.call(this, result.token);
};

module.exports = o;