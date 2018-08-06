function notInProduction() {
    return window.location.host === 'localhost' || window.location.host === 'corner-test.buzzbuzzenglish.com';
}

function inProduction() {
    return !notInProduction();
}

let productionAppId = 'wx370ed9dea414747f';
let testAppId = 'wx8f2141f7ff4bb443';

export default class ClientConfig {
    static wechatAppIdForMobile = inProduction() || true ? productionAppId : testAppId;

    static wechatAppIdForQrCode = 'wx7f1051697b7fab6d';

    static getWechatRedirectUri(origin, queryString) {
        let wechatRedirectUrl = `${window.location.protocol}//live.buzzbuzzenglish.com/wechat/oauth/redirect`
        if (notInProduction()) {
            wechatRedirectUrl = `${window.location.protocol}//corner-test.buzzbuzzenglish.com/wechat/oauth/redirect`
        }

        let redirectUri = `${wechatRedirectUrl}/${btoa(origin)}/${btoa(queryString)}`

        return encodeURIComponent(redirectUri)
    }

    static getWechatQrRedirectUri(origin, queryString) {
        let redirectUri = `${window.location.protocol}//live.buzzbuzzenglish.com/wechat/oauth/qr-redirect/${btoa(origin)}/${btoa(queryString)}`

        return encodeURIComponent(redirectUri)
    }
}
