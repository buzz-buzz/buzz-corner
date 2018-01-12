const request = require("request-promise-native");
const config = require('./config');

module.exports = {
    getOAuthLink: async function (fromUrl) {
        let response = await request.post(`${config.endPoints.thirdParty}/wechat/oauth/logon`,
            {
                json: {
                    app_id: 'buzz',
                    returnUrl: 'http://localhost:16111/wechat/oauth/callback?from=' + fromUrl
                }
            }
        );

        if (response.isSuccess) {
            return response.result;
        } else {
            throw new Error(response);
        }
    }
};