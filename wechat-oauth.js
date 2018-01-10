import * as request from "request";

export default class WechatOAuth {
    static async getOAuthLink(fromUrl) {
        return await request.post(`http://10.20.32.61:10101/wechat/oauth/logon`,
            {
                app_id: 'buzz',
                returnUrl: 'http://localhost:16111/wechat/oauth/callback?from=' + fromUrl
            }
        );
    }
}