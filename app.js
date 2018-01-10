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

app.use(userAgent);
app.use(bodyParser());

router
    .get('/healthcheck', async ctx => {
        ctx.body = {
            'everything': ' is ok',
            node_env: process.env.NODE_ENV,
            port: process.env.PORT
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

        ctx.body = 'ok';
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
app.listen(port);