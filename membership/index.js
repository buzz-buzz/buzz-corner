'use strict';

const config = require('../config');
const request = require('request');
const cookie = require('../helpers/cookie');

function doRequest(options) {
    return new Promise((resolve, reject) => {
        let req = request(options);

        req.on('data', data => {
            console.log('on data = ', data.toString());
            resolve(JSON.parse(data.toString()));
        });
        req.on('error', err => {
            reject(err);
        });
    });
}

function setHcdUser(context, data) {
    context.state.hcd_user = {
        member_id: data.member_id,
        token: data.token,

        isAdmin: false
    };
}

async function parseTokenAndSetHcdUser(context, token) {
    let result = {
        result: {}
    };

    if (config.mock) {
        result = {
            isSuccess: true,
            result: {
                member_id: 'fake member'
            }
        };
    } else {
        result = await doRequest({
            uri: 'http://' + config.sso.inner.host + ':' + config.sso.inner.port + '/token/parse',
            json: {token: token},
            method: 'POST'
        });
    }

    if (result.isSuccess) {
        console.log('setting token: ', token);
        setHcdUser(context, {
            member_id: result.result.member_id,
            token: token
        });

        return result.result;
    } else {
        console.log('token not valid');
        delete context.state.hcd_user;
        return {};
    }
}

async function setHcdUserFromCookie(context) {
    if (!context.cookies) {
        return;
    }

    let token = context.cookies.get('token');

    if (token) {
        await parseTokenAndSetHcdUser(context, token);
    } else {
        delete context.state.hcd_user;
    }
}

async function setHcdUserFromQueryString(context) {
    let token = context.query.token;

    if (token) {
        console.log('parsing token: ', token);
        let result = await parseTokenAndSetHcdUser(context, token);
        console.log('result = ', result);
        cookie.resetSignOnCookies.call(context, Object.assign({}, result, {token: token}));
    }

    return token;
}

async function setHcdUserFromQSOrCookie(context) {
    (await setHcdUserFromQueryString(context))
    || (await setHcdUserFromCookie(context));
}

let membership = {
    parseTokenAndSetHcdUser: parseTokenAndSetHcdUser,
    setHcdUserFromCookie: setHcdUserFromCookie,

    setHcdUser: setHcdUser,

    parseToken: parseTokenAndSetHcdUser
};

membership.setHcdUserIfSignedIn = async function (ctx, next) {
    await setHcdUserFromQSOrCookie(ctx);

    await next();
};

membership.ensureAuthenticated = async function (context, next) {
    await setHcdUserFromQSOrCookie(context);

    if (!context.state.hcd_user) {
        if (context.request.get('X-Request-With') === 'XMLHttpRequest') {
            let returnUrl = context.headers.referer;
            let result = {};
            result.isSuccess = false;
            result.code = 302;
            result.message = returnUrl || '/';

            return context.body = result;
        } else {
            let url = '/sign-in?return_url=' + encodeURIComponent(context.request.originalUrl);

            return context.redirect(url);
        }
    }

    await next();
};

membership.ensureAdmin = async function (ctx, next) {
    await setHcdUserFromQSOrCookie(ctx);

    if (!this.state.hcd_user || !this.state.hcd_user.isAdmin) {
        require('../helpers/cookie').deleteToken.apply(this);
        return this.redirect('/sign-in?return_url=' + encodeURIComponent(this.request.originalUrl));
    }

    await next();
};

membership.signOut = async function (next) {
    await doRequest({
        uri: 'http://' + config.sso.inner.host + ':' + config.sso.inner.port + '/logon/logout',
        json: {token: this.query.token || this.cookies.get('token')},
        method: 'POST'
    });

    await next();
};

membership.requireAuthenticatedFor = function (paths) {
    return async function (ctx, next) {
        if (paths.indexOf(ctx.path) >= 0) {
            return await membership.ensureAuthenticated(ctx, next);
        }

        return await next();
    };
};

module.exports = membership;