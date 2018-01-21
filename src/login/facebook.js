import React from 'react';
import {Button, Container} from "semantic-ui-react";

export default class FacebookLogin extends React.Component {
    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        this.FB = window.FB;
        this.checkLoginStatus();
    }
    /**
     * Check login status
     */
    checkLoginStatus = () => {
        if (/MicroMessenger/.test(navigator.userAgent)) {
            alert('在微信浏览器中请使用微信登录方式');
            window.location.href = '/wechat-login';
            return;
        }

        this.FB.getLoginStatus(this.facebookLoginHandler);
    }
    /**
     * Check login status and call login api is user is not logged in
     */
    facebookLogin = () => {
        console.log('hallo');
        if (!this.FB) return;

        console.log('fetching login status');
        this.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.facebookLoginHandler(response);
            } else {
                this.FB.login(this.facebookLoginHandler, {scope: 'public_profile'});
            }
        },);
    }
    /**
     * Handle login response
     */
    facebookLoginHandler = response => {
        if (response.status === 'connected') {
            this.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };
                console.log('me: ', result.user)
                // this.props.onLogin(true, result);
            });
        } else {
            console.log('not me');
            // this.props.onLogin(false);
        }
    }

    componentDidMount() {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);

        let mountEvent = new Event('componentDidMount');
        document.dispatchEvent(mountEvent);

    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    render() {
        return (
            <Container textAlign="center">
                <p>Hello from facebook</p>
                <Button onClick={this.facebookLogin}>Sign in with facebook</Button>
            </Container>
        );
    }
}