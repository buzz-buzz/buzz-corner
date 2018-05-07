import React, {Component} from 'react';
import {Container, Segment} from "semantic-ui-react";
import ServiceProxy from "../service-proxy";
import QiniuDomain from '../common/systemData/qiniuUrl';

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
                        <img src= { QiniuDomain + "/new_buzz_logo.png"} className="" alt="logo"
                             style={{maxWidth: '100%', maxHeight: '50px'}}/>
                    </a>
                    <p>Welcome, {JSON.stringify(this.state.userInfo)}</p>
                </Segment>
            </Container>
        );
    }
}

export default Header;
