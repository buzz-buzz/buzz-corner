import React from 'react';
import {Container, Segment} from "semantic-ui-react";

export default class WechatLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        WechatLogin.redirectToWechatOAuthPage();
    }

    static redirectToWechatOAuthPage() {
        const redirectUri = encodeURIComponent(`${window.location.protocol}//live.buzzbuzzenglish.com/wechat/oauth/redirect/${btoa(window.location.origin)}/${btoa(window.location.search)}`);
        
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx370ed9dea414747f&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
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