import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";

class WechatLogin extends Component {
    constructor() {
        super();

        this.state = {
            step: 1,
            role: MemberType.Student
        };

        this.signInViaWechat = this.signInViaWechat.bind(this);
    }

    signInViaWechat() {
        Track.event('登录页面_点击微信登录按钮');

        if (!/MicroMessenger/.test(navigator.userAgent)) {
            alert('请在微信浏览器中使用微信登录方式');
            return;
        } else {
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx370ed9dea414747f&redirect_uri=http%3A%2F%2Fcorner.buzzbuzzenglish.com%2Fwechat%2Foauth%2Fredirect%2F${btoa(window.location.origin)}%2F${btoa(window.location.search)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        }
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
            </div>
        );
    }
}

export default WechatLogin;
