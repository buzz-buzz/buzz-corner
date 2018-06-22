const BasicAuth = require('./secure/basic-auth');
const Koa = require('koa');
const app = new Koa();
const request = require('request-promise-native');
const oldRequest = require('request');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const serveStatic = require('koa-static');
const config = require('./config');
const membership = require('./membership');
const send = require('koa-send');
const userAgent = require('koa-useragent');
const fs = require('fs');
const pug = require('js-koa-pug');
const qiniu = require('qiniu');
const config_qiniu = require('./config/qiniu');
const wechat = require('./service/wechat');
const mac = new qiniu.auth.digest.Mac(config_qiniu.ACCESS_KEY, config_qiniu.SECRET_KEY);
const putPolicy = new qiniu.rs.PutPolicy({
    scope: config_qiniu.bucket
});
const setCookieParser = require('set-cookie-parser');
const url = require('url');
const fundebug = require('./common/error-handler').fundebug;

fundebug.notify("buzz-corner", "Fundebug started!");

app.use(userAgent);
app.use(bodyParser());
app.use(pug('views'));

router
    .get('/healthcheck', async ctx => {
        ctx.body = {
            'everything': ' is ok',
            node_env: process.env.NODE_ENV,
            port: process.env.PORT,
            version: JSON.parse(fs.readFileSync('package.json', 'utf-8')).version
        };
    })
    .get('/config', async ctx => {
        ctx.body = config;
    })
    .post('/proxy', async ctx => {
        if (ctx.request.body.uri) {
            ctx.request.body.uri = ctx.request.body.uri
                .replace('{config.endPoints.interview}', config.endPoints.interview)
                .replace('{config.endPoints.masr}', config.endPoints.masr)
                .replace('{config.endPoints.hongda}', config.endPoints.hongda)
                .replace('{config.endPoints.buzzService}', config.endPoints.buzzService)
            ;
        }

        try {
            let response = await new Promise((resolve, reject) => {
                oldRequest(Object.assign({
                    headers: {
                        'X-Requested-With': 'buzz-corner',
                        resolveWithFullResponse: true
                    }
                }, ctx.request.body), (err, response, body) => {
                    if (err) {
                        reject(err);
                    } else if (response.statusCode >= 300 || response.statusCode < 200) {
                        reject(response);
                    } else {
                        resolve(response)
                    }
                })
            });

            setCookieParser.parse(response, {
                decodeValues: true
            }).map(cookie => {
                if (ctx.headers.referer) {
                    let parsed = url.parse(ctx.headers.referer, true);
                    console.log('parsed referer = ', parsed);

                    let encodedReturnURL = parsed.query.return_url;

                    if (!encodedReturnURL && parsed.query.base64_query_string) {
                        let qs = new Buffer(parsed.query.base64_query_string, 'base64').toString('ascii');
                        parsed = url.parse(qs, true);

                        encodedReturnURL = parsed.query.return_url;
                    }

                    if (encodedReturnURL) {
                        let returnUrl = decodeURIComponent(encodedReturnURL);
                        console.log('return url = ', returnUrl);

                        let parsedReturnUrl = url.parse(returnUrl);
                        console.log('parsed return url = ', parsedReturnUrl);
                        if (parsedReturnUrl.host) {
                            cookie.domain = parsedReturnUrl.host;
                        }
                    }
                }

                return cookie;
            }).map(cookie => {
                ctx.cookies.set(cookie.name, cookie.value, cookie);

                let option = Object.assign({}, cookie, {domain: config.rootDomain});
                ctx.cookies.set(cookie.name, cookie.value, option);

                option = Object.assign({}, cookie, {domain: undefined});
                ctx.cookies.set(cookie.name, cookie.value, option);

                return cookie;
            });

            ctx.body = response.body;
        } catch (ex) {
            console.error(ex.statusCode, ex.body)
            ctx.throw(ex.statusCode, ex.body)
        }
    })
    .get('/wechat/oauth/redirect/:base64_callback_origin/:base64_query_string?', async ctx => {
        await wechat.login(true, ctx.query.code, ctx.params.base64_callback_origin, ctx.params.base64_query_string, ctx)
    })
    .get('/wechat/oauth/qr-redirect/:base64_callback_origin/:base64_query_string?', async ctx => {
        await wechat.login(false, ctx.query.code, ctx.params.base64_callback_origin, ctx.params.base64_query_string, ctx)
    })
    .get('/wechat/oauth/fail/:wechatErrorInfo', serveSPA)
    .get('/wechat/oauth/success/:wechatUserInfo', async ctx => {
        if (['production', 'uat', 'qa'].indexOf(process.env.NODE_ENV) >= 0) {
            await send(ctx, 'build/wechat-oauth-success.html')
        } else {
            await send(ctx, 'public/wechat-oauth-success.html')

        }
    })
    .get('/sign-in', membership.signInFromToken, async ctx => {
        if (ctx.state.user && ctx.state.user.user_id) {
            ctx.redirect(ctx.query.from || '/my/info');
        } else {
            await serveSPA(ctx);
        }
    })
    .get('/sign-out', membership.signOut, async ctx => {
        ctx.redirect(`/select-role`);
    })
    .get('/user-info', membership.ensureAuthenticated, async ctx => {
        if (isFinite(ctx.state.user.userId)) {
            let options = Object.assign({
                headers: BasicAuth.authHeader(),
                uri: `${config.endPoints.buzzService}/api/v1/users/${ctx.state.user.userId}`
            }, ctx.request.body);

            try {
                let profile = await request(options);
                console.log('profile is ', profile);

                ctx.body = Object.assign(ctx.state.user, {
                    profile: JSON.parse(profile)
                });
            } catch (ex) {
                await membership.signOut(ctx, () => {
                });
                ctx.throw(ex.statusCode, `Met error: ${JSON.stringify(ex)} for userId = ${ctx.state.user.userId}`, ex);
            }
        } else {
            ctx.redirect(`/select-role?return_url=${ctx.request.headers.referer}`);
        }
    })
    .put('/user-info', membership.ensureAuthenticated, async ctx => {
        let options = {
            headers: BasicAuth.authHeader(),
            uri: `${config.endPoints.buzzService}/api/v1/users/${ctx.state.user.userId}`,
            method: 'PUT',
            json: ctx.request.body
        };

        console.log('options = ', options);
        let updatedProfile = await request(options);
        console.log('updated profile = ', updatedProfile);

        ctx.body = Object.assign(ctx.state.user, {
            profile: updatedProfile
        });
    })
    .get('/switch-to-user/:user_id', membership.ensureAuthenticated, membership.pretendToBeOtherUser, async ctx => {
        ctx.body = ctx.state.user;
    })
    .get('/qiniu/token', async ctx => {
        let token = putPolicy.uploadToken(mac);
        ctx.body = {
            uptoken: token || '',
            upload_url: config_qiniu.url.upload_url,
            resources_url: config_qiniu.url.resources_url
        };
    })
    .get('/track_script_placeholder.js', async ctx => {
        ctx.body = 'function doNothing(){}'
    })
    .get('/fundebug.js', async ctx => {
        ctx.body = 'function doNothing(){}'
    })
    .put('/error', async ctx => {
        fundebug.notify('微信登录失败了', ctx.request.body.error, {
            user: Object.assign({}, ctx.state.user, {}),
            metaData: ctx.request.body.meta
        });
        ctx.body = 'noted'
    })
;


async function serveSPA(ctx) {
    if (['production', 'uat', 'qa'].indexOf(process.env.NODE_ENV) >= 0) {
        await send(ctx, 'build/index.html');
    } else {
        await send(ctx, 'public/index.html');
    }
}

app.use(serveStatic('build'));

if (process.env.NODE_ENV === 'staging') {
    app.use(serveStatic('public'));
}

router
    .get('/%2f', serveSPA)
    .get('//', serveSPA)
    .get('/profile', serveSPA)
    .get('/login', serveSPA)
    .get('/login/facebook', serveSPA)
    .get('/login/wechat', serveSPA)
    .get('/my/info', serveSPA)
    .get('/placement', serveSPA)
    .get('/home', membership.ensureAuthenticated, serveSPA)
    .get('/friends', serveSPA)
    .get('/reward', serveSPA)
    .get('/user', membership.ensureAuthenticated, serveSPA)
    .get('/user-profile', serveSPA)
    .get('/user/:user_id', serveSPA)
    .get('/class/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/class/foreign/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/class/evaluation/:to_user_id/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/evaluation/:from_user_id/:to_user_id/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/poster/:from_user_id/:to_user_id/:class_id', serveSPA)
    .get('/consult', serveSPA)
    .get('/class-lessons', membership.ensureAuthenticated, serveSPA)
    .get('/consult', serveSPA)
    .get('/wechat/demo', serveSPA)
    .get('/select-role', serveSPA)
    .get('/video-play', serveSPA)
    .get('/tutor', serveSPA)
    .get('/student', serveSPA)
    .get('/account/set', membership.ensureAuthenticated, serveSPA)
    .get('/account/about', serveSPA)
    .get('/account/select', serveSPA)
    .get('/login/account', serveSPA)
    .get('/zoom', serveSPA)
    .get('/zoom-join', serveSPA)
;

app
    .use(router.routes())
    .use(router.allowedMethods());

app.on('error', fundebug.KoaErrorHandler);

if (process.env.NODE_ENV !== 'test') {
    let port = process.env.PORT || 16111;
    module.exports = app.listen(port);
} else {
    module.exports = app;
}