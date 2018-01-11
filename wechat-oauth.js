const request = require("request-promise-native");

module.exports = {
    getOAuthLink: async function (fromUrl) {
        return await request.post(`http://10.20.32.61:10101/wechat/oauth/logon`,
            {
                json: {
                    app_id: 'buzz',
                    returnUrl: 'http://localhost:16111/wechat/oauth/callback?from=' + fromUrl
                }
            }
        );
    }
};