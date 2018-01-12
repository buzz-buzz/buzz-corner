import * as WechatOAuth from "../wechat-oauth";

describe('Wechat OAuth', () => {
    test('should return a wechat oauth link', async () => {
        let link = await WechatOAuth.getOAuthLink('test');

        console.error(`link is `, link);

        expect(/https:\/\/open.weixin.qq.com\/connect\/oauth2\/authorize\?appid=wx370ed9dea414747f&redirect_uri=http%3A%2F%2Fauth.bridgeplus.cn%2Fwechat%2Flogon&response_type=code&scope=snsapi_userinfo&state=_trd_we_act_(\d+)&connect_redirect=1#wechat_redirect/.test(link)).toEqual(true);
    });
});