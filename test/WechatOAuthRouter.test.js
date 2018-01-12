const server = require('../app');
const request = require('supertest');

afterEach(() => {
    server.close();
});

describe('OAuth', function () {
    test('should return a message to indicate user to open in wechat browser', async () => {
        const response = await request(server).get('/wechat-login');
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('text/plain');
        console.error(response.text);
        expect(response.text).toEqual('请在微信中打开此链接。');
    });

    test('should return a wechat oauth link', async () => {
        request.agent(server, {}).set('User-agent', 'MicroMessenger');
        const response = await request(server)
            .get('/wechat-login');
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('text/plain');
        console.error(response.text);
        expect(response.text).toEqual('请在微信中打开此链接。');
    });
});