import React from 'react';
import {Button, Container} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';

export default class FacebookLogin extends React.Component {
    constructor() {
        super();

        this.facebookConnected = this.facebookConnected.bind(this);
    }

    componentDidMount() {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);

        let mountEvent = new Event('componentDidMount');
        document.dispatchEvent(mountEvent);

    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    initializeFacebookLogin = () => {
        this.FB = window.FB;
        this.checkLoginStatus();
    };

    checkLoginStatus = () => {
        if (/MicroMessenger/.test(navigator.userAgent)) {
            alert('在微信浏览器中请使用微信登录方式');
            window.location.href = '/wechat-login';
            return;
        }

        this.FB.getLoginStatus(this.facebookLoginStatusGot);
    };

    facebookLogin = () => {
        console.log('hallo');
        if (!this.FB) return;

        console.log('fetching login status');
        this.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.facebookLoginStatusGot(response);
            } else {
                this.FB.login(this.facebookLoginStatusGot, {scope: 'public_profile'});
            }
        },);
    };

    async facebookConnected(facebookUserData) {
        try {
            let buzzUserData = await this.getBuzzUserData(facebookUserData.id);

            await this.loginByFacebook(facebookUserData.id, buzzUserData.user_id);
        } catch (error) {
            if (this.isNewUser(error)) {
                let newUserId = await this.registerByFacebook(facebookUserData);
                await this.loginByFacebook(facebookUserData.id, newUserId);
            } else {
                throw error;
                alert('Login failed!');
            }
        }
    }

    isNewUser(error) {
        return error.status === 404 && error.result && error.result.error === 'The requested user does not exists';
    }

    async getBuzzUserData(facebook_id) {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/by-facebook/${facebook_id}`
            }
        });
    }

    facebookLoginStatusGot = response => {
        if (response.status === 'connected') {
            this.FB.api('/me', this.facebookConnected);
        } else {
            alert('Failed to connect to Facebook.');
        }
    }

    async loginByFacebook(facebookId, userId) {
        let res = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/sign-in`,
                method: 'PUT',
                json: {
                    user_id: userId,
                    facebook_id: facebookId
                }
            }
        });
        console.log('登录成功！', res);
    }

    async registerByFacebook(facebookUserInfo) {
        return await ServiceProxy.proxyTo({
            body: {
                uri: '{config.endPoints.buzzService}/api/v1/users',
                method: 'POST',
                json: {
                    role: 's',
                    name: facebookUserInfo.name,
                    facebook_id: facebookUserInfo.id,
                    facebook_name: facebookUserInfo.name
                }
            }
        });
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