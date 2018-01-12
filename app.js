const Koa = require('koa');
const app = new Koa();
const request = require('request');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const serveStatic = require('koa-static');
const config = require('./config');
const membership = require('./membership');
const send = require('koa-send');
const userAgent = require('koa-useragent');
const WechatOAuth = require('./wechat-oauth');
const fs = require('fs');

app.use(userAgent);
app.use(bodyParser());

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
            ;
        }
        ctx.body = await request(ctx.request.body);
    })
    .get('/wechat-login', async ctx => {
        if (!/MicroMessenger/i.test(ctx.userAgent.source)) {
            return ctx.body = '请在微信中打开此链接。';
        }

        ctx.redirect(await WechatOAuth.getOAuthLink(`${config.endPoints.buzzCorner}/wechat-login`));
    })
    .get('/wechat/oauth/callback', async ctx => {
        if (String(ctx.query.is_registed) === String(true)) {
            ctx.redirect(`/sign-in?token=${ctx.query.token}&openid=${ctx.query.openid}&from=${ctx.query.from}`);
        } else {
            ctx.redirect(`/sign-up?token=${ctx.query.token}&openid=${ctx.query.openid}&from=${ctx.query.from}`);
        }
    })
    .get('/sign-in', membership.signInFromToken, async ctx => {
        if (ctx.state.hcd_user && ctx.state.hcd_user.member_id) {
            ctx.redirect(ctx.query.from || '/');
        } else {
            ctx.body = '登录失败！';
        }
    })
    .get('/sign-up', membership.signUpFromToken)
;

if (['production', 'uat', 'prd'].indexOf(process.env.NODE_ENV) >= 0) {
    console.log('running code for production only...');
    app.use(membership.requireAuthenticatedFor([]));

    app.use(serveStatic('build'));

    router
        .get('/test/', serveSPA)
    ;

    async function serveSPA(ctx) {
        await send(ctx, 'build/index.html');
    }

    console.log('end running code for production only.')
}

app
    .use(router.routes())
    .use(router.allowedMethods());

let port = process.env.PORT || 16111;
let server = app.listen(port);

module.exports = server;