module.exports = {
    authHeader() {
        const auth = `Basic ${new Buffer(process.env.BASIC_NAME + ':' + process.env.BASIC_PASS).toString('base64')}`;

        let h = {
            'X-Requested-With': 'buzz-corner'
        };

        if (process.env.NODE_ENV !== 'development') {
            h.Authorization = auth;
        }

        return h;
    }
};