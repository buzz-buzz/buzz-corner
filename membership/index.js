

const config = require('../config');
const request = require('request-promise-native');
const cookie = require('../helpers/cookie');

function setUser(context, data) {
    context.state.user = {
        userId: data.user_id
    };
}

async function parseUserIdAndSetUser(context, user_id) {
    setUser(context, {
        user_id: user_id
    });

    return {user_id: user_id}
}

async function setUserFromCookie(context) {
    if (!context.cookies) {
        return;
    }

    let user_id = context.cookies.get('user_id');

    if (user_id) {
        await parseUserIdAndSetUser(context, user_id);
    } else {
        delete context.state.user;
    }
}

async function setUserFromQueryString(context) {
    let user_id = context.query.user_id;

    if (user_id) {
        await parseUserIdAndSetUser(context, user_id);
        cookie.resetSignOnCookies.call(context, Object.assign({}, {user_id: user_id}));
    }

    return user_id;
}

async function setUserFromQSOrCookie(context) {
    (await setUserFromQueryString(context))
    || (await setUserFromCookie(context));
}

let membership = {};

membership.ensureAuthenticated = async function (context, next) {
    await setUserFromQSOrCookie(context);

    if (!context.state.user) {
        if (context.request.get('X-Request-With') === 'XMLHttpRequest') {
            let returnUrl = context.headers.referer;
            let result = {};
            result.isSuccess = false;
            result.code = 302;
            result.message = returnUrl || '/';

            return context.body = result;
        } else {
            let url = '/select-role?return_url=' + encodeURIComponent(context.request.originalUrl);

            return context.redirect(url);
        }
    }

    await next();
};

membership.signOut = async function (next) {
    await request.post(`http://${config.endPoints.sso}/logon/logout`, {
        json: {token: this.query.token || this.cookies.get('token')}
    });

    await next();
};

membership.signInFromToken = async (ctx, next) => {
    await setUserFromQSOrCookie(ctx);

    await next();
};

module.exports = membership;
