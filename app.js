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
        if (ctx.query.is_registed) {
            ctx.body = `你已注册过，现在可以使用 ${ctx.query.token} 登录`;
        } else {
            ctx.body = ctx.query;
        }
    })
    .get('/wechat-oauth-link', async ctx => {
        try {
            ctx.body = await WechatOAuth.getOAuthLink('test');
        } catch (ex) {
            ctx.throw(500, ex);
        }
    })
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