import React from 'react';
import {Container, Segment} from "semantic-ui-react";

export default class WechatOAuthFail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            wechatErrorInfo: JSON.parse(decodeURIComponent(atob(props.params.wechatErrorInfo)))
        };
    }

    async componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={true}
                         style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 888}}>
                    {JSON.stringify(this.state.wechatErroInfo)}
                </Segment>
            </Container>
        );
    }
}