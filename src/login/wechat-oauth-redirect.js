import React from 'react';
import {Container, Segment} from "semantic-ui-react";

export default class WechatOAuthRedirect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        console.log('link = ', window.location.href);
        let response = await fetch(window.location.href);
        if (response.url) {
            window.location.href = response.url;
        }
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