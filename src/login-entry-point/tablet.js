import React, {Component} from 'react';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import Track from "../common/track";
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";
import './tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

class LoginRole extends Component {
    constructor() {
        super();

        this.state = {
            role: URLHelper.getSearchParam(window.location.search, 'role')
        };

        if (this.state.role === MemberType.Student) {
            Track.event('登录页面_中方登录页面');
            return;
        }

        if (this.state.role === MemberType.Companion) {
            Track.event('登录页面_外方登录页面');
            return;
        }

        browserHistory.push('/select-role')
    }

    render() {
        return (
            <div className="login-entry-point">
                <TabletHeader />
                {
                    this.state.role === MemberType.Student &&
                    <div className="login-entry-content">
                        <div className="login-left-word">
                            <div className="login-word">对话英美精英少年，轻松挺高英语听说</div>
                            <div className="items">
                                <img src="//p579tk2n2.bkt.clouddn.com/tablet/icon_WeChat_active.png" alt=""/>
                            </div>
                        </div>
                        <div className="login-right-code">
                            <img src="" alt="" className="code"/>
                            <div className="code-word">使用微信扫码登录</div>
                        </div>
                    </div>
                }
                {
                    this.state.role === MemberType.Companion &&
                    <div className="login-entry-content">
                        <div className="login-left-word">
                            <div className="login-word">Make friends, earn cool rewards, learn new languages, be a leader!</div>
                            <div className="items">
                                <img src="//p579tk2n2.bkt.clouddn.com/tablet/icon_WeChat.png" alt=""/>
                                <img src="//p579tk2n2.bkt.clouddn.com/tablet/icon_facebook_active.png" alt=""/>
                            </div>
                        </div>
                        <div className="login-right-code">
                            <img src="//p579tk2n2.bkt.clouddn.com/tablet/Facebook_pc.png" alt="" className="facebook-logo"/>
                            <div className="code-word">SIGN IN WITH <b>FACEBOOK</b></div>
                            <button>LOGIN</button>
                        </div>
                    </div>
                }
                <TabletFooter />
            </div>
        );
    }
}

export default LoginRole;