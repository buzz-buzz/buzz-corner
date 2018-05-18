const request = require('request-promise-native');

module.exports = {
    async redirect(isMobile, code, base64_callback_origin, base64_query_string, ctxRedirect) {
        function redirectFail(msg) {
            ctxRedirect(`/wechat/oauth/fail/${encodeURIComponent(new Buffer(encodeURIComponent(msg)).toString('base64'))}?callback_origin=${base64_callback_origin}&base64_query_string=${base64_query_string}`)
        }

        try {
            const appid = isMobile ? process.env.buzz_wechat_appid : process.env.buzz_wechat_qr_appid
            const secret = isMobile ? process.env.buzz_wechat_secret : process.env.buzz_wechat_qr_secret
            let accessTokenResponse = JSON.parse(await request({
                uri: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
            }));

            console.log('response = ', accessTokenResponse);

            if (accessTokenResponse.errcode === 40163 && accessTokenResponse.errmsg.startsWith('code been used,')) {
                redirectFail(accessTokenResponse.errmsg)
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
                redirectFail(userInfoResponse)
            } else {
                ctxRedirect(`/wechat/oauth/success/${encodeURIComponent(new Buffer(encodeURIComponent(userInfoResponse)).toString('base64'))}?callback_origin=${base64_callback_origin}&base64_query_string=${base64_query_string}`);
            }
        } catch (e) {
            console.error(e);
            redirectFail(e)
        }
    },
}
