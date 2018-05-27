import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import URLHelper from "../common/url-helper";

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
        console.error(this.state.wechatErrorInfo)
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

        return true;
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={this.state.loading}>
                    <p>微信登录过程中出错了，</p>
                    <p>请<a href="/select-role" onClick={this.goBack}>返回重试</a>。</p>
                    <p>{this.state.wechatErrorInfo}</p>
                </Segment>
            </Container>
        );
    }
}