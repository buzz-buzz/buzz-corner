import React from 'react';
import {Container, Icon} from "semantic-ui-react";
import {Link} from "react-router";

export default class Login extends React.Component {
    render() {
        return (
            <Container textAlign="center">
                <Link to="login/wechat" className="ui green button">微信登录</Link>
                <br/>
                <br/>
                <Link to="login/facebook" className="ui facebook button">
                    <Icon name="facebook"/>
                    Facebook 登录
                </Link>
            </Container>
        );
    }
}