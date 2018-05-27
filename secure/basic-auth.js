module.exports = {
    authHeader() {
        const auth = `Basic ${new Buffer(process.env.BASIC_NAME + ':' + process.env.BASIC_PASS).toString('base64')}`;

        return {
            'X-Requested-With': 'buzz-corner',
            Authorization: auth
        }
    }
}
