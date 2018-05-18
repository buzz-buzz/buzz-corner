import React, {Component} from 'react';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import Track from "../common/track";
import Resources from '../resources';
import {MemberType} from "../membership/member-type";
<<<<<<< HEAD
=======
import URLHelper from "../common/url-helper";
>>>>>>> master
import FacebookLogin from "../login/facebook";
import './tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';
import RoleDesider from "./RoleDesider";

class LoginRole extends Component {
    constructor() {
        super();

        this.state = {
            role: RoleDesider.getRole(),
            active: MemberType.Student
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

        browserHistory.push('/select-role');
    }

    createCode() {
        new window.WxLogin({
            self_redirect: true,
            id: "qrcode-wechat",
            appid: "wx46e3b4c2a399d748",
            scope: "snsapi_login",
            redirect_uri: encodeURIComponent(`http://live.buzzbuzzenglish.com/wechat/oauth/redirect/${btoa(window.location.origin)}/${btoa(window.location.search)}`),
            state: "123",
            style: "white"
        });
    }

    changeWechatLogin() {
<<<<<<< HEAD
        if (this.state.active !== MemberType.Student) {
            this.setState({
                active: MemberType.Student
=======
        if (this.state.active !== 's') {
            this.setState({
                active: 's'
>>>>>>> master
            }, this.createCode);
        }
    }

    changeFacebookLogin() {
<<<<<<< HEAD
        if (this.state.active !== MemberType.Companion) {
            this.setState({
                active: MemberType.Companion
=======
        if (this.state.active !== 'c') {
            this.setState({
                active: 'c'
>>>>>>> master
            });
        }
    }

    componentDidMount() {
        if (window.WxLogin) {
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
                        <div className="login-word">{this.state.role === MemberType.Student ?
                            Resources.getInstance().loginTabletWord : 'Make friends, earn cool rewards, learn new languages, be a leader!'}</div>
                        <div className="items">
                            <img
<<<<<<< HEAD
                                src={this.state.active === MemberType.Student ? QiniuDomain + "/tablet/icon_WeChat_active.png" : QiniuDomain + "/tablet/icon_WeChat.png"}
=======
                                src={this.state.active === 's' ? QiniuDomain + "/tablet/icon_WeChat_active.png" : QiniuDomain + "/tablet/icon_WeChat.png"}
>>>>>>> master
                                alt="" onClick={this.changeWechatLogin}/>
                            {
                                this.state.role === MemberType.Companion &&
                                <img
<<<<<<< HEAD
                                    src={this.state.active === MemberType.Companion ? QiniuDomain + "/tablet/icon_facebook_active.png" : QiniuDomain + "/tablet/icon_facebook.png"}
=======
                                    src={this.state.active === 'c' ? QiniuDomain + "/tablet/icon_facebook_active.png" : QiniuDomain + "/tablet/icon_facebook.png"}
>>>>>>> master
                                    alt="" onClick={this.changeFacebookLogin}/>
                            }
                        </div>
                    </div>
                    {
<<<<<<< HEAD
                        this.state.active === MemberType.Companion &&
=======
                        this.state.active === 'c' &&
>>>>>>> master
                        <div className="login-right-code">
                            <img src={QiniuDomain + "/tablet/Facebook_pc.png"} alt="" className="facebook-logo"/>
                            <div className="code-word">SIGN IN WITH <b>FACEBOOK</b></div>
                            <FacebookLogin btnText="LOGIN"/>
                        </div>
                    }
                    {
<<<<<<< HEAD
                        this.state.active === MemberType.Student &&
=======
                        this.state.active === 's' &&
>>>>>>> master
                        <div className="login-right-code">
                            <div className="code" id="qrcode-wechat"></div>
                            <div className="code-word">{Resources.getInstance().loginWechatScanQr}</div>
                        </div>
                    }
                </div>
                <TabletFooter/>
            </div>
        );
    }
}

export default LoginRole;