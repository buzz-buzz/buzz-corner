const app = require('../app');
const request = require('supertest');

let server = null;

beforeEach(() => {
    server = app.listen(process.env.PORT)
})

afterEach(() => {
    server.close();
    console.log('server closed');
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