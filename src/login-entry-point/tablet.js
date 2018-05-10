import React, {Component} from 'react';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import Track from "../common/track";
import Resources from '../resources';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";
import FacebookLogin from "../login/facebook";
import './tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

class LoginRole extends Component {
    constructor() {
        super();

        this.state = {
            role: URLHelper.getSearchParam(window.location.search, 'role')
        };

        this.facebookLogin = this.facebookLogin.bind(this);

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

    componentDidMount(){
        if(this.state.role === MemberType.Student){
            let script=document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js");
            let heads = document.getElementsByTagName("head");
            if(heads.length)
                heads[0].appendChild(script);
            else
                document.documentElement.appendChild(script);

            let delay = setTimeout(function(){
                if(window.WxLogin){

                    var obj = new window.WxLogin({
                        self_redirect: true,
                        id: "qrcode-wechat",
                        appid: "wx46e3b4c2a399d748",
                        scope: "snsapi_login",
                        redirect_uri: encodeURIComponent(`http://live.buzzbuzzenglish.com/wechat/oauth/redirect/${btoa(window.location.origin)}/${btoa(window.location.search)}`),
                        state: "123",
                        style: "white"
                    });
                }

                clearTimeout(delay);
            }, 5000)
        }
    }

    facebookLogin(){
        browserHistory.push(`/login/facebook${window.location.search}`);
    }

    render() {
        return (
            <div className="login-entry-point">
                <TabletHeader />
                {
                    this.state.role === MemberType.Student &&
                    <div className="login-entry-content">
                        <div className="login-left-word">
                            <div className="login-word">{Resources.getInstance().loginTabletWord}</div>
                            <div className="items">
                                <img src={QiniuDomain + "/tablet/icon_WeChat_active.png"} alt=""/>
                            </div>
                        </div>
                        <div className="login-right-code">
                            <div className="code" id="qrcode-wechat"></div>
                            <div className="code-word">使用微信扫码登录</div>
                        </div>
                        {/*<script src="//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"></script>*/}
                    </div>
                }
                {
                    this.state.role === MemberType.Companion &&
                    <div className="login-entry-content">
                        <div className="login-left-word">
                            <div className="login-word">Make friends, earn cool rewards, learn new languages, be a leader!</div>
                            <div className="items">
                                <img src={QiniuDomain + "/tablet/icon_WeChat.png"} alt=""/>
                                <img src={QiniuDomain + "/tablet/icon_facebook_active.png"} alt=""/>
                            </div>
                        </div>
                        <div className="login-right-code">
                            <img src={QiniuDomain + "/tablet/Facebook_pc.png"} alt="" className="facebook-logo"/>
                            <div className="code-word">SIGN IN WITH <b>FACEBOOK</b></div>
                            <FacebookLogin btnText="LOGIN" />
                        </div>
                    </div>
                }
                <TabletFooter />
            </div>
        );
    }
}

export default LoginRole;