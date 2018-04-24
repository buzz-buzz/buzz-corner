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
const mac = new qiniu.auth.digest.Mac(config_qiniu.ACCESS_KEY, config_qiniu.SECRET_KEY);
const putPolicy = new qiniu.rs.PutPolicy({
    scope: config_qiniu.bucket
});

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

        console.log('proxing with ...', ctx.request.body);

        ctx.body = await oldRequest(ctx.request.body);
    })
    .get('/wechat/oauth/redirect/:base64_callback_origin/:base64_query_string', async ctx => {
        let getCode = function () {
            ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.buzz_wechat_appid}&redirect_uri=http%3A%2F%2Fcorner.buzzbuzzenglish.com%2Fwechat%2Foauth%2Fredirect%2F${0}%2F${0}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
        };

        let code = ctx.query.code;
        if (!code) {
            getCode();
            return;
        }

        try {
            let accessTokenResponse = JSON.parse(await request({
                uri: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.buzz_wechat_appid}&secret=${process.env.buzz_wechat_secret}&code=${code}&grant_type=authorization_code`
            }));

            console.log('response = ', accessTokenResponse);

            if (accessTokenResponse.errcode === 40163 && accessTokenResponse.errmsg.startsWith('code been used,')) {
                getCode();
                return;
            }

            // response =  { access_token: '6_l7QIfpUBCn_wnWsFcsb5fP_94GcrPU3lm-aTvk9yhVt43CcxI75aH5Soz1pN5dDbOjaNj-FIVXX6YQApyvqQNg',
            //     expires_in: 7200,
            //     refresh_token: '6_1tXQ-GUhbbqUx69UGxQzxKMGygmfBTOHGWNuNoQV48PhqLrBZH5EDYsSz0OSKXmw1MMjjRN5IujlQpR1ZipJfw',
            //     openid: 'oyjHGw_XuFegDeFmObyFh0uTnHXI',
            //     scope: 'snsapi_userinfo',
            //     unionid: 'omVC7woQqmPJnrTQIqzt1PXjnhIk' }

            let userInfoResponse = await request({
                uri: `https://api.weixin.qq.com/sns/userinfo?access_token=${accessTokenResponse.access_token}&openid=${accessTokenResponse.openid}&lang=zh_CN`
            });

            console.log('wechat User Response = ', userInfoResponse);

            let json = JSON.parse(userInfoResponse);

            if (json.errcode || json.errmsg) {
                ctx.redirect(`/wechat/oauth/fail/${encodeURIComponent(new Buffer(encodeURIComponent(userInfoResponse)).toString('base64'))}?callback_origin=${ctx.params.base64_callback_origin}&base64_query_string=${ctx.params.base64_query_string}`)
            } else {
                ctx.redirect(`/wechat/oauth/success/${encodeURIComponent(new Buffer(encodeURIComponent(userInfoResponse)).toString('base64'))}?callback_origin=${ctx.params.base64_callback_origin}&base64_query_string=${ctx.params.base64_query_string}`);
            }
        } catch (ex) {
            console.error(ex);
            getCode();
        }
    })
    .get('/wechat/oauth/fail/:wechatErrorInfo', serveSPA)
    .get('/wechat/oauth/success/:wechatUserInfo', serveSPA)
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
        ctx.body = ctx.state.user;
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
    .get('/profile', serveSPA)
    .get('/login', serveSPA)
    .get('/login/facebook', serveSPA)
    .get('/login/wechat', serveSPA)
    .get('/my/info', serveSPA)
    .get('/my/profile', serveSPA)
    .get('/my/profile/avatar', serveSPA)
    .get('/my/profile/language', serveSPA)
    .get('/admin', serveSPA)
    .get('/admin/class', serveSPA)
    .get('/placement', serveSPA)
    .get('/home', serveSPA)
    .get('/friends', serveSPA)
    .get('/reward', serveSPA)
    .get('/user', serveSPA)
    .get('/class/:class_id', serveSPA)
    .get('/class/evaluation/:to_user_id/:class_id', serveSPA)
    .get('/consult', serveSPA)
    .get('/class-lessons', serveSPA)
    .get('/consult', serveSPA)
    .get('/wechat/demo', serveSPA)
    .get('/select-role', serveSPA)
    .get('/video-play', serveSPA)
;

app
    .use(router.routes())
    .use(router.allowedMethods());

if (process.env.NODE_ENV !== 'test') {
    let port = process.env.PORT || 16111;
    module.exports = app.listen(port);
} else {
    module.exports = app;
}