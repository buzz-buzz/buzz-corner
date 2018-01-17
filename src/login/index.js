import React from 'react';
import {Button, Container} from "semantic-ui-react";

export default class Login extends React.Component {
    gotoFacebookLogin = () => {
        window.location.href = '/login/facebook';
    };

    render() {
        return (
            <Container textAlign="center">
                <a className="ui green button"
                   href={`//corner.buzzbuzzenglish.com/wechat-login?sign_in_origin=${btoa(window.location.href)}`}>weChat
                    login</a>
                <br/>
                <Button circular color='facebook' icon='facebook' onClick={this.gotoFacebookLogin()}/>
            </Container>
        );
    }
}