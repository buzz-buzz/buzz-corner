import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";
import {Button, Divider, Icon} from "semantic-ui-react";
import {browserHistory} from "react-router";
import FacebookLogin from "../login/facebook";
import WeChatLogin from "../login/wechat";

class LoginEntryPoint extends Component {
    constructor() {
        super();

        this.state = {
            step: 1,
            role: MemberType.Student
        };

        this.signInViaWechat = this.signInViaWechat.bind(this);
        this.signInViaFacebook = this.signInViaFacebook.bind(this);
    }

    signInViaWechat() {
        Track.event('登录页面_点击微信登录按钮');
        WeChatLogin.redirectToWechatOAuthPage();
    }

    signInViaFacebook() {
        Track.event('登录页面_点击 Facebook 按钮');

        browserHistory.push(`/login/facebook${window.location.search}`);
    }

    componentDidMount() {
        Track.event('登录页面_中方微信登录页面');
        this.setState({
            role: URLHelper.getSearchParam(window.location.search, 'role')
        })
    }

    render() {
        return (
            <div className="wechat-login">
                <div className="login-logo">
                    <img src="//p579tk2n2.bkt.clouddn.com/logo_full%20name.png" alt="loading..."/>
                </div>
                <div className="login-wechat-img">
                    <img src='//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png' alt="loading..."/>
                    <div className="img-introduction">
                        <p>{Resources.getInstance().loginByWechatIntroduction}</p>
                    </div>
                </div>
                <div className="login-wechat-btn" onClick={this.signInViaWechat}>
                    <div>
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/button_WeChat.png" alt="loading..."/>
                        <p>{Resources.getInstance().loginByWechatInfo}</p>
                    </div>
                </div>
                <FacebookLogin/>
                <Divider horizontal/>
            </div>
        );
    }
}

export default LoginEntryPoint;
