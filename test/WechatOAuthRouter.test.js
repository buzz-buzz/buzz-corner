const server = require('../app');
const request = require('supertest');

afterEach(() => {
    server.close();
});

describe.skip('OAuth', function () {
    test('should redirect to wechat oauth page', async () => {
        const response = await request(server).get('/wechat-login');
        expect(response.status).toEqual(302);
        expect(response.status).toEqual(302);
        expect(response.type).toEqual('text/html');
        expect(response.text.startsWith('Redirecting to')).toEqual(true);
    });
});