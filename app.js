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
const pug = require('js-koa-pug');
const busboy = require('koa-busboy')
const uploader = busboy({
});

app.use(userAgent);
app.use(bodyParser());
app.use(pug('views'));

function pipeRequest(from, bucket) {
    return function (cb) {
        from.pipe(request.put(
            'http://uat.hcd.com:10003' + '/upload' + bucket,
            {
            },
            function (err, response, body) {
                cb(err, body);
            }));
    };
}

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
    .get('/wechat-login', membership.setHcdUserIfSignedIn, async ctx => {
        if (ctx.state.hcd_user && ctx.state.hcd_user.member_id) {
            ctx.render('wechat-login-callback', {
                hcd_user: ctx.state.hcd_user
            });

            return;
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
            ctx.body = {msg: 'login failed！'};
        }
    })
    .get('/sign-up', membership.signUpFromToken)
    .get('/user-info', membership.ensureAuthenticated ,async ctx => {
        ctx.body = ctx.state.hcd_user || {member_id: 'c7b6d3fb-32ea-4606-8358-3b7c70fb1dea'};
    })
    .put('/avatar', uploader, async ctx=>{
        let { name } = ctx.request.body;
        // files
        // uploaded files is add to ctx.request.files array
        // let fileReadStream = ctx.request.files[0]
        ctx.body ={
            name: name,
            file: ctx.request.files.length
        };
    });
;

if (['production', 'uat', 'prd'].indexOf(process.env.NODE_ENV) >= 0) {
    console.log('running code for production only...');
    app.use(membership.requireAuthenticatedFor([]));

    app.use(serveStatic('build'));

    router
        .get('/profile', serveSPA)
        .get('/login', serveSPA)
        .get('/login/facebook', serveSPA)
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