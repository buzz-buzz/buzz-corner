import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import URLHelper from "../common/url-helper";
import ServiceProxy from "../service-proxy";
import CurrentUser from "../membership/user";

export default class WechatOAuthFail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            wechatErrorInfo: decodeURIComponent(atob(decodeURIComponent(props.params.wechatErrorInfo)))
        };

        this.goBack = this.goBack.bind(this);
    }

    async componentDidMount() {
        await CurrentUser.signOutNoRedirect();
        console.error(this.state.wechatErrorInfo);
        await ServiceProxy.proxy('/error', {
            body: {
                error: this.state.wechatErrorInfo,
                meta: window.location.href
            },
            method: "PUT"
        })
        this.setState({loading: false})
    }

    componentWillMount() {
        URLHelper.handleOrigin();
    }

    goBack(event) {
        if (window.parent) {
            event.preventDefault();

            window.parent.location.reload();
        }

        window.location.href = '/login';
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={this.state.loading}>
                    <p>微信登录过程中出错了，</p>
                    <p>请<a href="/login" onClick={this.goBack}>返回重试</a>。
                    </p>
                    <p>{this.state.wechatErrorInfo}</p>
                </Segment>
            </Container>
        );
    }
}
