import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import ClientConfig from "../client-config/client-config";

export default class WechatLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        WechatLogin.redirectToWechatOAuthPage();
    }

    static redirectToWechatOAuthPage() {
        const redirectUri = ClientConfig.getWechatRedirectUri(window.location.origin, window.location.search)

        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ClientConfig.wechatAppIdForMobile}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    }

    static redirectToWechatQRcode() {
        const redirectUri = ClientConfig.getWechatQrRedirectUri(window.location.origin, window.location.search);

        window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${ClientConfig.wechatAppIdForQrCode}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&self_redirect=#wechat_redirect`;
    }

    static createQrCode() {
        document.write('<div id="qrcode-wechat" style="text-align: center; width: 100%; height: 100%;">正在加载微信二维码，请稍候……</div>');
        new window.WxLogin({
            self_redirect: true,
            id: "qrcode-wechat",
            appid: ClientConfig.true,
            scope: "snsapi_login",
            redirect_uri: ClientConfig.getWechatQrRedirectUri(window.location.origin, window.location.search),
            state: "",
            style: "black"
        });
        // document.write('<div style="text-align: center;"><a' +
        //     ' href="weixin://dl/business/">已安装微信？请尝试在微信中打开本页面</a></div>');
    }

    static showLoginPage() {
        if (/MicroMessenger/.test(navigator.userAgent)) {
            this.redirectToWechatOAuthPage();
        } else {
            this.createQrCode();
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={this.state.loading}>
                </Segment>
            </Container>
        );
    }
}
