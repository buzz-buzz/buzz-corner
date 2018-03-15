import React, {Component} from 'react';
import Resources from '../resources';
import './index.css';

class WechatLogin extends Component {
    constructor() {
        super();

        this.state = {
            step: 1
        };

        this.signUp = this.signUp.bind(this);
    }

    signUp() {
        if (!/MicroMessenger/.test(navigator.userAgent)) {
            alert('请在微信浏览器中使用微信登录方式');
            return;
        } else {
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx370ed9dea414747f&redirect_uri=http%3A%2F%2Fcorner.buzzbuzzenglish.com%2Fwechat%2Foauth%2Fredirect%2F${(btoa(window.location.origin))}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        }
    }

    render() {
        return (
            <div className="wechat-login">
                <div className="login-logo">
                    <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="加载中..."/>
                </div>
                <div className="login-wechat-img">
                    <img src='//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png' alt="加载中..."/>
                    <div className="img-introduction">
                        <p>{Resources.getInstance().loginByWechatIntroduction}</p>
                    </div>
                </div>
                <div className="login-wechat-btn" onClick={this.signUp}>
                    <div>
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/button_WeChat.png" alt=""/>
                        <p>{Resources.getInstance().loginByWechatInfo}</p>
                    </div>
                </div>
                <div className="login-attention">

                </div>
            </div>
        );
    }
}

export default WechatLogin;
