import React from 'react';
import {Image} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import URLHelper from "../common/url-helper";
import BuzzRoundButton from "../common/commonComponent/buttons/buzz-round-button";
import ModalMessage from "../common/commonComponent/modalMessage/index";
import Resources from "../resources";
import './index.css';

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
        // js.src = "https://connect.facebook.net/en_US/sdk.js";
        js.src = "https://cdn-corner.resource.buzzbuzzenglish.com/facebook-sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

export default class FacebookLogin extends React.Component {
    initializeFacebookLogin = () => {
        this.FB = window.FB;
        this.FB.getLoginStatus(() => {
            this.setState({
                loading: false,
                facebookConnected: true
            })
        });
    };
    facebookLoginStatusGot = response => {
        this.setState({
            loading: false,
            facebookConnected: true
        });

        if (response.status === 'connected') {
            this.FB.api('/me', this.facebookUserInfoGot);
        }
    };
    doLogin = () => {
        //this.facebookUserInfoGot({name: "Xiaopeng Han", id: "285519065597484"});
        if (!this.state.facebookConnected) {
            this.setState({modalShow: true});
            if(this.props.LoginFail){
                this.props.LoginFail();
            }
            return;
        }

        this.setState({loading: true});
        this.FB.login(this.facebookLoginStatusGot, {scope: 'public_profile'});
    };
    logout = async() => {
        this.setState({loading: true});

        await new Promise(callback => this.FB.logout(callback));
        await ServiceProxy.proxy('/sign-out');
        this.setState({userInfo: {}, loading: false})
    };
    facebookUserInfoGot = async(facebookUserData) => {
        try {
            await this.loginOldUser(facebookUserData);
        } catch (error) {
            //新用户-需要绑定手机号 调至登陆成功处
            window.location.href = `/facebook/oauth/success/${this.getParameters(facebookUserData, window.btoa(window.location.origin), window.btoa(window.location.search))}`;
            //await this.loginNewUser(error, facebookUserData);
        }
    };
    getParameters = (msg, base64_callback_origin, base64_query_string) => {

        return `${msg.id}/${msg.name}?callback_origin=${base64_callback_origin}&base64_query_string=${base64_query_string}`;
    };
    loginOldUser = async(facebookUserData) => {
        let buzzUserData = await this.getBuzzUserData(facebookUserData.id);

        await this.loginByFacebook(facebookUserData.id, buzzUserData.user_id);
    };
    getBuzzUserData = async(facebook_id) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/by-facebook/${facebook_id}`
            }
        });
    };
    loginByFacebook = async(facebookId, userId) => {
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
        if (returnUrl && returnUrl.indexOf('login') === -1 && returnUrl.indexOf('sign') === -1) {
            window.location.href = returnUrl;
        }else {
            window.location.href = '/';
        }
    };

    constructor() {
        super();

        this.facebookUserInfoGot = this.facebookUserInfoGot.bind(this);
        this.doLogin = this.doLogin.bind(this);

        this.state = {
            facebookConnected: false
        };
    }

    componentDidMount() {
        loadFacebookScripts();

        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);

        let mountEvent = new Event('componentDidMount');
        document.dispatchEvent(mountEvent);

    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);

        this.setState = (state, callback) => {
            return false;
        };
    }

    render() {
        return (
            <div>
                <ModalMessage modalName="error" modalShow={this.state.modalShow}
                              modalContent={Resources.getInstance().connectionError}
                              style={{position: 'fixed', top: '0'}} duration={'long'}/>
                <ModalMessage modalName="error" modalShow={this.state.wechatModalShow}
                              modalContent={Resources.getInstance().pleaseUseWechatToLogin}
                              style={{position: 'fixed'}} duration={'long'}/>
                {
                    this.props.mobileFacebookUI ? <div className="face-book" onClick={this.doLogin}>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_facebook.svg" alt=""/>
                            <span>FACEBOOK</span>
                        </div> :
                        <BuzzRoundButton onClick={this.doLogin} loading={this.state.loading}
                                         disabled={this.state.loading}
                                         paddingLeft="60px">
                            <Image src="//cdn-corner.resource.buzzbuzzenglish.com/image/svg/icon_facebook.svg"
                                   alt="Facebook login"/>
                            {Resources.getInstance('en-US').signInWith('FACEBOOK')}
                        </BuzzRoundButton>
                }
            </div>
        );
    }
}
