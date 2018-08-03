let wechatRedirectUrl = `${window.location.protocol}//live.buzzbuzzenglish.com/wechat/oauth/redirect`
if (window.location.host === 'localhost' || window.location.host === 'corner-test.buzzbuzzenglish.com') {
    wechatRedirectUrl = `${window.location.protocol}//corner-test.buzzbuzzenglish.com/wechat/oauth/redirect`
}

export default class ClientConfig {
    static wechatAppIdForMobile = 'wx8f2141f7ff4bb443';

    static getWechatRedirectUri(origin, queryString) {
        let redirectUri = `${wechatRedirectUrl}/${btoa(origin)}/${btoa(queryString)}`

        return encodeURIComponent(redirectUri)
    }

}
