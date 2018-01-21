import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';

export default class WechatOAuthSuccess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        let wechatUserInfo = props.params.wechatUserInfo;
        console.log(atob(wechatUserInfo));
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={this.state.loading}>
                    {JSON.stringify(this.state.userInfo)}
                </Segment>
            </Container>
        );
    }
}