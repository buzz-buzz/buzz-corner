import React from 'react';
import {Image} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import BuzzServiceApiErrorParser from "../common/buzz-service-api-error-parser";
import URLHelper from "../common/url-helper";
import {MemberType} from "../membership/member-type";
import BuzzRoundButton from "../common/commonComponent/buttons/buzz-round-button";

let loadFacebookScripts = () => {
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '534664310238961',
            cookie: true,
            xfbml: true,
            version: 'v2.11'
        });

        window.FB.AppEvents.logPageView();

        var fbInitEvent = new Event('FBObjectReady');
        document.dispatchEvent(fbInitEvent);

        document.addEventListener('componentDidMount', function () {
            console.log('component mounted');
            document.dispatchEvent(fbInitEvent);
            console.log('dispatched fb ready.');
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

export default class FacebookLogin extends React.Component {
    initializeFacebookLogin = () => {
        this.FB = window.FB;
        this.FB.getLoginStatus(this.facebookLoginStatusGot);
    };
    facebookLoginStatusGot = response => {
        if (response.status === 'connected') {
            this.FB.api('/me', this.facebookUserInfoGot);
        } else {
            this.setState({
                loading: false,
                facebookConnected: true
            }, () => {
                // alert('Please click the Facebook Login button to open facebook authentication page...')
            });
        }
    };
    doLogin = () => {
        this.checkWechatBrowser();
        this.setState({loading: true});
        this.FB.login(this.facebookLoginStatusGot, {scope: 'public_profile'});
    };
    logout = async () => {
        this.setState({loading: true});

        await new Promise(callback => this.FB.logout(callback));
        await ServiceProxy.proxy('/logout');
        this.setState({userInfo: {}, loading: false})
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
        if (BuzzServiceApiErrorParser.isNewUser(error)) {
            let newUserId = await this.registerByFacebook(facebookUserData);
            await this.loginByFacebook(facebookUserData.id, newUserId);
        } else {
            alert('Login failed!');

            throw error;
        }
    };
    getBuzzUserData = async (facebook_id) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/by-facebook/${facebook_id}`
            }
        });
    };
    registerByFacebook = async (facebookUserInfo) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: '{config.endPoints.buzzService}/api/v1/users',
                method: 'POST',
                json: {
                    role: URLHelper.getSearchParam(window.location.search, 'role') || MemberType.Companion,
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

        this.setState({
            userInfo: res,
            loading: false
        });

        let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url') || '/';
        if (returnUrl) {
            window.location.href = returnUrl;
        }
    };

    constructor() {
        super();

        this.facebookUserInfoGot = this.facebookUserInfoGot.bind(this);
        this.doLogin = this.doLogin.bind(this);

        this.state = {
            loading: true,
            facebookConnected: false
        };

        // this.checkWechatBrowser();
    }

    checkWechatBrowser() {
        if (/MicroMessenger/.test(navigator.userAgent)) {
            alert('在微信浏览器中请使用微信登录方式');
            window.location.href = `/login/wechat/${window.location.search}`;
        }
    }

    componentDidMount() {
        loadFacebookScripts();

        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);

        let mountEvent = new Event('componentDidMount');
        document.dispatchEvent(mountEvent);

    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    render() {
        return (
            <div>
                {
                    this.state.facebookConnected &&

                    <BuzzRoundButton onClick={this.doLogin} loading={this.state.loading} disabled={this.state.loading}
                                     paddingLeft="60px">
                        <Image src="//p579tk2n2.bkt.clouddn.com/image/svg/icon_facebook.svg" alt="Facebook login"/>
                        SIGN IN WITH <strong>FACEBOOK</strong>
                    </BuzzRoundButton>
                }
            </div>
        );
    }
}