const config = require('../config');
const cookie = require('../helpers/cookie');

const fundebug = require('../common/error-handler').fundebug;

async function setUserToState(context, user_id) {
    console.log('super users = ', config.superUsers);

    context.state.user = {
        userId: user_id,
        super: (config.superUsers || []).indexOf(Number(user_id)) >= 0
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
        if (context.request.get('X-Request-With') === 'XMLHttpRequest') {
            let returnUrl = context.headers.referer;
            let result = {};
            result.isSuccess = false;
            result.code = 302;
            result.message = returnUrl || '/';

            return context.body = result;
        } else {
            let returnUrl = context.request.originalUrl;
            if (returnUrl === '/user-info') {
                returnUrl = context.request.headers.referer;
            }

            let url = '/select-role?return_url=' + encodeURIComponent(returnUrl);

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
    console.log('signing out...');
    cookie.resetSignOnCookies.call(ctx);
    console.log('signed out');

    await next();
};

membership.signInFromToken = async (ctx, next) => {
    await setUserFromQSOrCookie(ctx);

    await next();
};

module.exports = membership;
