import React, {Component} from 'react';
import {Container, Segment} from "semantic-ui-react";
import ServiceProxy from "../service-proxy";

class Header extends Component {
    constructor() {
        super();

        this.state = {}
    }

    async componentDidMount() {
        let userInfo = await  ServiceProxy.proxy('/user-info');
        this.setState({
            userInfo: userInfo
        });
    }

    render() {
        return (
            <Container className='spa-header'>
                <Segment inverted>
                    <a href="/">
                        <img src="//p579tk2n2.bkt.clouddn.com/new_buzz_logo.png" className="" alt="logo"
                             style={{maxWidth: '100%', maxHeight: '50px'}}/>
                    </a>
                    <p>Welcome, {JSON.stringify(this.state.userInfo)}</p>
                </Segment>
            </Container>
        );
    }
}

export default Header;
