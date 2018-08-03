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

    static createQrCode() {
        document.write('<div id="qrcode-wechat" style="text-align: center;">正在加载微信二维码，请稍候……</div>');
        document.write('<div style="text-align: center;"><p>&nbsp;</p></div>');
        document.write('<div style="text-align: center;"><p>&nbsp;</p></div>');
        document.write('<div style="text-align: center;"><p>&nbsp;</p></div>');
        new window.WxLogin({
            self_redirect: true,
            id: "qrcode-wechat",
            appid: "wx7f1051697b7fab6d",
            scope: "snsapi_login",
            redirect_uri: ClientConfig.getWechatRedirectUri(window.location.origin, window.location.search),
            state: "",
            style: "black"
        });
        document.write('<div style="text-align: center;"><a' +
            ' href="weixin://dl/business/">已安装微信？请尝试在微信中打开本页面</a></div>');
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
