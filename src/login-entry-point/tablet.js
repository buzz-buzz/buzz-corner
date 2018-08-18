import React, {Component} from 'react';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import Track from "../common/track";
import Resources from '../resources';
import {MemberType} from "../membership/member-type";
import FacebookLogin from "../login/facebook";
import './tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';
import WeChatLogin from "../login/wechat";
import RoleDesider from "./RoleDesider";
import ClientConfig from "../client-config/client-config";

class LoginRole extends Component {
    constructor() {
        super();

        this.state = {
            role: RoleDesider.getRole(),
            active: RoleDesider.getRole()
        };

        this.facebookLogin = this.facebookLogin.bind(this);
        this.changeWechatLogin = this.changeWechatLogin.bind(this);
        this.changeFacebookLogin = this.changeFacebookLogin.bind(this);

        if (this.state.role === MemberType.Student) {
            Track.event('登录页面_中方登录页面');
            return;
        }

        if (this.state.role === MemberType.Companion) {
            Track.event('登录页面_外方登录页面');
            return;
        }

        browserHistory.push('/login');
    }

    createCode() {
        new window.WxLogin({
            self_redirect: true,
            id: "qrcode-wechat",
            appid: ClientConfig.wechatAppIdForQrCode,
            scope: "snsapi_login",
            redirect_uri: ClientConfig.getWechatQrRedirectUri(window.location.origin, window.location.search),
            state: "123",
            style: "black"
        });
    }

    changeWechatLogin() {
        if (this.state.active !== MemberType.Student) {
            if (/MicroMessenger/.test(navigator.userAgent)) {
                WeChatLogin.redirectToWechatOAuthPage();
            } else {
                this.setState({
                    active: MemberType.Student
                }, this.createCode);
            }
        }
    }

    changeFacebookLogin() {
        if (this.state.active !== MemberType.Companion) {
            this.setState({
                active: MemberType.Companion
            });
        }
    }

    componentDidMount() {
        if (this.state.active === MemberType.Student) {
            this.createCode();
        }
    }

    facebookLogin() {
        browserHistory.push(`/login/facebook${window.location.search}`);
    }

    render() {
        return (
            <div className="login-entry-point">
                <TabletHeader/>
                <div className="login-entry-content">
                    <div className="login-left-word">
                        <div
                            className="login-word">{this.state.role === MemberType.Student ?
                            Resources.getInstance().loginTabletWord : 'Make friends, earn cool rewards, learn new languages, be a leader!'}</div>
                        <div className="items">
                            <img
                                src={this.state.active === MemberType.Student ? QiniuDomain + "/tablet/icon_WeChat_active.png" : QiniuDomain + "/tablet/icon_WeChat.png"}
                                alt="" onClick={this.changeWechatLogin}/>
                            {
                                this.state.role === MemberType.Companion &&
                                <img
                                    src={this.state.active === MemberType.Companion ? QiniuDomain + "/tablet/icon_facebook_active.png" : QiniuDomain + "/tablet/icon_facebook.png"}
                                    alt="" onClick={this.changeFacebookLogin}/>
                            }
                        </div>
                    </div>
                    {
                        this.state.active === MemberType.Companion &&
                        <div className="login-right-code">
                            <img src={QiniuDomain + "/tablet/Facebook_pc.png"}
                                 alt="" className="facebook-logo"/>
                            <div className="code-word">SIGN IN
                                WITH <b>FACEBOOK</b></div>
                            <FacebookLogin btnText="LOGIN"/>
                        </div>
                    }
                    {
                        this.state.active === MemberType.Student &&
                        <div className="login-right-code">
                            <div className="code" id="qrcode-wechat"></div>
                        </div>
                    }
                </div>
                <TabletFooter/>
            </div>
        );
    }
}

export default LoginRole;
