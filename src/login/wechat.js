import React from 'react';
import {Container, Segment} from "semantic-ui-react";

export default class WechatLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        if (!/MicroMessenger/.test(navigator.userAgent)) {
            alert('请在微信浏览器中使用微信登录方式');
            return;
        }

        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx370ed9dea414747f&redirect_uri=http%3A%2F%2Fcorner.buzzbuzzenglish.com%2Fwechat%2Foauth%2Fredirect%2F${encodeURIComponent(props.params.return_url)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        console.log('aaaaaaaaaaaaa----', this.state.userInfo);
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={this.state.loading}>
                    {JSON.stringify(this.state.userInfo)}
                    <p>return_url = </p>
                    <p>{decodeURIComponent(this.props.params.return_url)}</p>
                </Segment>
            </Container>
        );
    }
}