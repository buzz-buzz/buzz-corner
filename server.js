import RequestHelper from "./helpers/request-helper";

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
const _ = require('lodash');
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
const languageParser = require('accept-language-parser');

fundebug.notify("buzz-corner-koa", "Fundebug started!");

app.use(userAgent);
app.use(bodyParser());
app.use(pug('views'));

router
    .get('/redirect/:url', async ctx => {
      const v = Buffer.from(ctx.params.url, 'base64').toString('ascii')
       ctx.redirect(_.includes(v, '?') ? v + '&' + ctx.querystring : v + '?' + ctx.querystring)
    })
    .get('/file-text', ctx => {
        ctx.body = 'c3d21b070a9a69097729494dc1065841';
    })
    .get('/healthcheck', async ctx => {
        ctx.body = {
            'everything': ' is ok',
            node_env: process.env.NODE_ENV,
            port: process.env.PORT,
            version: JSON.parse(fs.readFileSync('package.json', 'utf-8')).version,
            rootDomain: config.rootDomain
        };
    })
    .get('/config', async ctx => {
        ctx.body = config;
    })
    .get('/language', async ctx => {
        let languages = languageParser.parse('en-GB,en;q=0.8');
        ctx.body = languages[0].code;
    })
    .post('/proxy', async ctx => {
        let buzzService = config.endPoints.buzzService;

        if(ctx.request.origin && ctx.request.origin.indexOf('live1') > -1 && (config.endPoints.buzzService1 || process.env.buzz_service1_endpoints)){
            buzzService = config.endPoints.buzzService1 || process.env.buzz_service1_endpoints;
        }

        if(ctx.request.origin && ctx.request.origin.indexOf('live2') > -1 && (config.endPoints.buzzService2 || process.env.buzz_service2_endpoints)){
            buzzService = config.endPoints.buzzService2 || process.env.buzz_service2_endpoints;
        }

        if (ctx.request.body.uri) {
            ctx.request.body.uri = ctx.request.body.uri
                .replace('{config.endPoints.interview}', config.endPoints.interview)
                .replace('{config.endPoints.masr}', config.endPoints.masr)
                .replace('{config.endPoints.hongda}', config.endPoints.hongda)
                .replace('{config.endPoints.buzzService}', buzzService)
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

                    let encodedReturnURL = parsed.query.return_url;

                    if (!encodedReturnURL && parsed.query.base64_query_string) {
                        let qs = new Buffer(parsed.query.base64_query_string, 'base64').toString('ascii');
                        parsed = url.parse(qs, true);

                        encodedReturnURL = parsed.query.return_url;
                    }

                    if (encodedReturnURL) {
                        let returnUrl = decodeURIComponent(encodedReturnURL);

                        let parsedReturnUrl = url.parse(returnUrl);
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
        const meta = {
            query: ctx.query,
            params: ctx.params
        };
        let start = new Date()
        fundebug.notify('微信手机登录开始', `${ctx.query.code}@${start}`, meta)
        let result = await wechat.login(true, ctx.query.code, ctx.params.base64_callback_origin, ctx.params.base64_query_string, ctx)
        let end = new Date()
        fundebug.notify(`微信手机登录结束 ${result ? '成功' : '失败'}`, `${ctx.query.code}@${end}：${(end - start) / 1000} 秒`, meta)
    })
    .get('/wechat/oauth/qr-redirect/:base64_callback_origin/:base64_query_string?', async ctx => {
        const meta = {
            query: ctx.query,
            params: ctx.params
        };
        let start = new Date()
        fundebug.notify('微信扫码登录开始', `${ctx.query.code}@${start}`, meta)
        let result = await wechat.login(false, ctx.query.code, ctx.params.base64_callback_origin, ctx.params.base64_query_string, ctx)
        let end = new Date()
        fundebug.notify(`微信扫码登录结束 ${result ? '成功' : '失败'}`, `${ctx.query.code}@${end}：${(end - start) / 1000} 秒`, meta)
    })
    .get('/wechat/oauth/fail/:wechatErrorInfo', membership.signOut, serveSPA)
    .get('/wechat/oauth/success/:wechatUserInfo', membership.signOut, serveSPA)
    .get('/facebook/oauth/success/:id/:name', membership.signOut, serveSPA)
    .get('/sign-in', membership.signOut, membership.signInFromToken, async ctx => {
        if (ctx.state.user && ctx.state.user.user_id) {
            ctx.redirect(ctx.query.from || '/my/info');
        } else {
            await serveSPA(ctx);
        }
    })
    .get('/sign-out', membership.signOut, async ctx => {
        ctx.redirect(`/login`);
    })
    .get('/sign-out-no-redirect', membership.signOut, async ctx => {
        ctx.body = {message: 'signed out'};
    })
    .get('/user-info', membership.ensureAuthenticated, async ctx => {
        let options = Object.assign({
            headers: BasicAuth.authHeader(),
            uri: `${config.endPoints.buzzService}/api/v1/users/${ctx.state.user.userId}`
        }, ctx.request.body);

        try {
            let profile = await request(options);

            ctx.body = Object.assign(ctx.state.user, {
                profile: JSON.parse(profile)
            });
        } catch (ex) {
            fundebug.notifyError(`Met error: ${JSON.stringify(ex)} for userId = ${ctx.state.user.userId}`, ex);
            let returnUrl = ctx.headers.referer;

            if (RequestHelper.isXHR(ctx)) {
                ctx.status = 401;
                return ctx.body = '/login?return_url=' + encodeURIComponent(returnUrl);
            } else {
                ctx.redirect(`/login?return_url=${returnUrl}`);
            }
        }
    })
    .put('/user-info', membership.ensureAuthenticated, async ctx => {
        let options = {
            headers: BasicAuth.authHeader(),
            uri: `${config.endPoints.buzzService}/api/v1/users/${ctx.state.user.userId}`,
            method: 'PUT',
            json: ctx.request.body
        };

        let updatedProfile = await request(options);

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

router
    .get('/%2f', serveSPA)
    .get('//', serveSPA)
    .get('/profile', serveSPA)
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
    .get('/course/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/class/foreign/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/class/evaluation/:to_user_id/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/evaluation/:from_user_id/:to_user_id/:class_id', membership.ensureAuthenticated, serveSPA)
    .get('/evaluation/standards', serveSPA)
    .get('/poster/:from_user_id/:to_user_id/:class_id', serveSPA)
    .get('/share/:from_user_id/:to_user_id/:class_id', serveSPA)
    .get('/consult', serveSPA)
    .get('/class-lessons', membership.ensureAuthenticated, serveSPA)
    .get('/consult', serveSPA)
    .get('/wechat/demo', serveSPA)
    .get('/select-role', serveSPA)
    .get('/video-play', serveSPA)
    .get('/tutor', async ctx => ctx.redirect('/sign-in?role=c&return_url='))
    .get('/student', async ctx => ctx.redirect('/sign-in?role=s&return_url='))
    .get('/account/set', membership.ensureAuthenticated, serveSPA)
    .get('/account/about', serveSPA)
    .get('/account/select', serveSPA)
    .get('/zoom', serveSPA)
    .get('/zoom-join', serveSPA)
    .get('/help/:faq_id', serveSPA)
    .get('/course', membership.ensureAuthenticated, serveSPA)
    .get('/user-guide', serveSPA)
    .get('/login/account', serveSPA)
    .get('/login', membership.signOut, serveSPA)
    .get('/login-select', serveSPA)
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
