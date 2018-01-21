import React from 'react';
import {Button, Container} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';

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
    };

    /**
     * Handle login response
     */
    facebookLoginHandler = response => {
        let self = this;
        if (response.status === 'connected') {
            this.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };

                console.log(userData);

                Promise.all([0].map(async () => {
                    return await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/users/by-facebook/${result.user.id}`
                        }
                    });
                })).then(function (results) {
                    console.log('done with ', results[0]);
                    return self.loginByFacebook(userData.id, results[0].user_id);
                }, function (error) {
                    if (error.status === 404 && error.result && error.result.error === 'The requested user does not exists') {
                        return self.registerByFacebook(result.user)
                            .then((userId) => {
                                return self.loginByFacebook(result.user.id, userId);
                            })
                            ;
                    } else {
                        throw error;
                    }
                })
                    .then((s) => {
                        console.log('signed in with ', s);
                    })
                    .catch((e) => {
                        console.error('error with ', e);
                        alert('登录失败！');
                    });
            });
        } else {
            alert('登录失败！');
        }
    }

    loginByFacebook(facebookId, userId) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/sign-in`,
                method: 'PUT',
                json: {
                    user_id: userId,
                    facebook_id: facebookId
                }
            }
        });
    }

    registerByFacebook(facebookUserInfo) {
        return ServiceProxy.proxyTo({
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