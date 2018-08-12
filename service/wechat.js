const request = require('request-promise-native');
const fundebug = require('../common/error-handler').fundebug;

function getParameters(msg, base64_callback_origin, base64_query_string) {

    return `${encodeURIComponent(new Buffer(encodeURIComponent(msg)).toString('base64'))}?callback_origin=${base64_callback_origin}&base64_query_string=${base64_query_string}`;
}

let fail = function (ctx, msg, base64_callback_origin, base64_query_string) {
    ctx.redirect(`/wechat/oauth/fail/${getParameters(msg, base64_callback_origin, base64_query_string)}`);
};
let success = function (ctx, userInfoResponse, base64_callback_origin, base64_query_string) {
    ctx.redirect(`/wechat/oauth/success/${getParameters(userInfoResponse, base64_callback_origin, base64_query_string)}`);
};

let getAccessToken = async function (isMobile, code) {
    const appid = isMobile ? process.env.buzz_wechat_appid : process.env.buzz_wechat_qr_appid
    const secret = isMobile ? process.env.buzz_wechat_secret : process.env.buzz_wechat_qr_secret

    let accessTokenResponse = await request({
        uri: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    });

    console.log('accesstoken = ', accessTokenResponse);
    return JSON.parse(accessTokenResponse);
};

let getUserInfo = async function (accessTokenResponse) {
    let userInfoResponse = await request({
        uri: `https://api.weixin.qq.com/sns/userinfo?access_token=${accessTokenResponse.access_token}&openid=${accessTokenResponse.openid}&lang=zh_CN`
    });

    let json = JSON.parse(userInfoResponse);
    return {userInfoResponse, json};
};
let handleAccessTokenResult = async function (accessTokenResponse, ctx, base64_callback_origin, base64_query_string) {
    if (accessTokenResponse.access_token) {
        // response =  { access_token: '6_l7QIfpUBCn_wnWsFcsb5fP_94GcrPU3lm-aTvk9yhVt43CcxI75aH5Soz1pN5dDbOjaNj-FIVXX6YQApyvqQNg',
        //     expires_in: 7200,
        //     refresh_token: '6_1tXQ-GUhbbqUx69UGxQzxKMGygmfBTOHGWNuNoQV48PhqLrBZH5EDYsSz0OSKXmw1MMjjRN5IujlQpR1ZipJfw',
        //     openid: 'oyjHGw_XuFegDeFmObyFh0uTnHXI',
        //     scope: 'snsapi_userinfo',
        //     unionid: 'omVC7woQqmPJnrTQIqzt1PXjnhIk' }

        let {userInfoResponse, json} = await getUserInfo(accessTokenResponse);

        if (!(json.errcode || json.errmsg)) {
            success(ctx, userInfoResponse, base64_callback_origin, base64_query_string);
            return true;
        } else {
            fundebug.notify('获取微信用户信息出错', json.errmsg, {
                json,
                userInfoResponse
            });
            fail(ctx, userInfoResponse, base64_callback_origin, base64_query_string);
            return false;
        }
    } else {
        fundebug.notify('获取 access_token 错误', accessTokenResponse.errmsg, accessTokenResponse);
        fail(ctx, accessTokenResponse.errmsg, base64_callback_origin, base64_query_string);
        return false;
    }
};
module.exports = {
    async login(isMobile, code, base64_callback_origin, base64_query_string, ctx) {
        try {
            let accessTokenResponse = await getAccessToken(isMobile, code);

            return await handleAccessTokenResult(accessTokenResponse, ctx, base64_callback_origin, base64_query_string);
        } catch (e) {
            fundebug.notify('获取微信 access token 出错', e.message, e);
            fail(ctx, e, base64_callback_origin, base64_query_string);

            return false;
        }
    },
}
