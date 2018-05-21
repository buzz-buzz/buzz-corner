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
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx370ed9dea414747f&redirect_uri=https%3A%2F%2Flive.buzzbuzzenglish.com%2Fwechat%2Foauth%2Fredirect%2F${btoa(window.location.origin)}%2F${btoa(window.location.search)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
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