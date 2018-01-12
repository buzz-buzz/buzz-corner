const server = require('../app');
const request = require('supertest');

afterEach(() => {
    server.close();
});

describe('OAuth', function () {
    test('should return a wechat oauth link', async () => {
        const response = await request(server).get('/wechat-oauth-link');
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('text/plain');
        expect(response.text.match(/https:\/\/open.weixin.qq.com\/connect\/oauth2\/authorize\?appid=wx370ed9dea414747f&redirect_uri=http%3A%2F%2Fauth.bridgeplus.cn%2Fwechat%2Flogon&response_type=code&scope=snsapi_userinfo&state=_trd_we_act_(\d+)&connect_redirect=1#wechat_redirect/).length).toEqual(2);
    });
});