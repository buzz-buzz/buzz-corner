import RequestHelper from '../helpers/request-helper';

const cookie = require('../helpers/cookie');

async function setUserToState(context, user_id) {
    context.state.user = {
        userId: user_id
    };

    return context.state.user;
}

async function setUserFromCookie(context) {
    if (!context.cookies) {
        return;
    }

    let user_id = context.cookies.get('user_id');

    if (user_id) {
        await setUserToState(context, user_id);
    } else {
        delete context.state.user;
    }
}

async function setUserFromQueryString(context) {
    // TODO: allow login by query string using more safer method (temp token, for example)
    return false;

    let user_id = context.query.user_id;

    if (user_id) {
        await setUserToState(context, user_id);
        cookie.setUserId.call(context, user_id);
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
        if (RequestHelper.isXHR(context)) {
            let returnUrl = context.headers.referer;

            context.status = 401;
            return context.body = '/login?return_url=' + encodeURIComponent(returnUrl);
        } else {
            let returnUrl = context.request.originalUrl;
            if (returnUrl === '/user-info') {
                returnUrl = context.request.headers.referer;
            }

            let url = '/login?return_url=' + encodeURIComponent(returnUrl);

            console.log('redirected')
            return context.redirect(url);
        }
    }

    await next();
};

membership.pretendToBeOtherUser = async function (context, next) {
    await setUserToState(context, context.params.user_id)
    cookie.setUserId.call(context, context.params.user_id)

    await next();
}

membership.signOut = async function (ctx, next) {
    cookie.resetSignOnCookies.call(ctx);

    await next();
};

membership.signInFromToken = async (ctx, next) => {
    await setUserFromQSOrCookie(ctx);

    await next();
};

module.exports = membership;
