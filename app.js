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
const busboy = require('koa-busboy');
const qiniu = require('qiniu');
const uploader = busboy({});

const mac = new qiniu.auth.digest.Mac('OlMuxpncg3fDYzOU2aVW2VC0bvPrQDWeO_elb5js', 'kljBtxHbByZTQjS0y73JnzUiaTmymb2-6RufCGj-');
const putPolicy = new qiniu.rs.PutPolicy({
    scope: 'buzz-resource'
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
    .get('/wechat/oauth/redirect', async ctx => {
        let getCode = function () {
            ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.buzz_wechat_appid}&redirect_uri=http%3A%2F%2Fbuzzbuzzenglish.com%2Fwechat%2Foauth%2Fredirect&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
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

            ctx.redirect(`/wechat/oauth/success/${encodeURIComponent(new Buffer(encodeURIComponent(userInfoResponse)).toString('base64'))}`);
        } catch (ex) {
            console.error(ex);
            getCode();
        }
    })
    .get('/wechat/oauth/success/:wechatUserInfo', serveSPA)
    .get('/sign-in', membership.signInFromToken, async ctx => {
        if (ctx.state.user && ctx.state.user.user_id) {
            ctx.redirect(ctx.query.from || '/');
        } else {
            ctx.body = {msg: 'login failed！'};
        }
    })
    .get('/user-info', membership.ensureAuthenticated, async ctx => {
        ctx.body = ctx.state.user;
    })
    .put('/avatar', uploader, async ctx => {
        let {name} = ctx.request.body;
        // files
        // uploaded files is add to ctx.request.files array
        // let fileReadStream = ctx.request.files[0]
        ctx.body = {
            name: name,
            file: ctx.request.files.length
        };

    })
    .get('/qiniu/token', async ctx => {
        let token = putPolicy.uploadToken(mac);
        ctx.body = {
            uptoken: token || ''
        };
    })
;


async function serveSPA(ctx) {
    if (['production', 'uat', 'prd'].indexOf(process.env.NODE_ENV) >= 0) {
        await send(ctx, 'build/index.html');
    } else {
        await send(ctx, 'public/index.html');
    }
}

if (['production', 'uat', 'prd'].indexOf(process.env.NODE_ENV) >= 0) {
    console.log('running code for production only...');

    app.use(serveStatic('build'));

    router
        .get('/profile', serveSPA)
        .get('/login', serveSPA)
        .get('/login/facebook', serveSPA)
        .get('/login/wechat', serveSPA)
    ;


    console.log('end running code for production only.')
}

app
    .use(router.routes())
    .use(router.allowedMethods());

let port = process.env.PORT || 16111;
let server = app.listen(port);

module.exports = server;