import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import './index.css';
import WeChatLogin from "../login/wechat";
import {MemberTypeChinese} from "../membership/member-type";

class StudentLoginEntryPoint extends Component {
    constructor() {
        super();

        this.signInViaWechat = this.signInViaWechat.bind(this);
    }

    signInViaWechat() {
        Track.event('登录页面_点击微信登录按钮', null, {
            '用户类型': MemberTypeChinese.Student
        });
        WeChatLogin.redirectToWechatOAuthPage();
    }

    render() {
        return (
            <div className="wechat-login">
                <div className="login-logo">
                    <img src="//p579tk2n2.bkt.clouddn.com/logo_full%20name.png" alt="loading..."/>
                </div>
                <div className="login-wechat-img">
                    <img src='//p579tk2n2.bkt.clouddn.com/banner-inland.png' alt="loading..."/>
                    <div className="img-introduction">
                        <p>{Resources.getInstance().loginByWechatIntroduction}</p>
                    </div>
                </div>
                <div className="login-wechat-btn" onClick={this.signInViaWechat}>
                    <div>
                        <img src="//p579tk2n2.bkt.clouddn.com/button_WeChat.png" alt="loading..."/>
                        <p>{Resources.getInstance().loginByWechatInfo}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default StudentLoginEntryPoint;