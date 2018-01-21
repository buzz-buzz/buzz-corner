import React from 'react';
import {Button, Container, Segment} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';

export default class FacebookLogin extends React.Component {
    constructor() {
        super();

        this.facebookUserInfoGot = this.facebookUserInfoGot.bind(this);

        this.state = {
            loading: true
        };
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

    facebookLoginStatusGot = response => {
        if (response.status === 'connected') {
            this.FB.api('/me', this.facebookUserInfoGot);
        } else {
            alert('Failed to connect to Facebook.');
            this.FB.login(this.facebookLoginStatusGot, {scope: 'public_profile'});
        }
    };

    facebookUserInfoGot = async (facebookUserData) => {
        try {
            await this.loginOldUser(facebookUserData);
        } catch (error) {
            await this.loginNewUser(error, facebookUserData);
        }
    };

    loginOldUser = async (facebookUserData) => {
        let buzzUserData = await this.getBuzzUserData(facebookUserData.id);

        await this.loginByFacebook(facebookUserData.id, buzzUserData.user_id);
    };

    loginNewUser = async (error, facebookUserData) => {
        if (this.isNewUser(error)) {
            let newUserId = await this.registerByFacebook(facebookUserData);
            await this.loginByFacebook(facebookUserData.id, newUserId);
        } else {
            throw error;
            alert('Login failed!');
        }
    };

    getBuzzUserData = async (facebook_id) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/by-facebook/${facebook_id}`
            }
        });
    };

    isNewUser = (error) => {
        return error.status === 404 && error.result && error.result.error === 'The requested user does not exists';
    };

    registerByFacebook = async (facebookUserInfo) => {
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
    };

    loginByFacebook = async (facebookId, userId) => {
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
        this.setState({
            userInfo: res,
            loading: false
        });
    };

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