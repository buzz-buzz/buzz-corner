import React, {Component} from 'react';
import {browserHistory} from "react-router";
import Resources from '../resources';
import moment from 'moment-timezone';
import {zones} from 'moment-timezone/data/meta/latest.json';
import {countryCodeMap, countryLongNameMap} from "../common/country-code-map";
import LoadingModal from '../common/commonComponent/loadingModal';
import MessageModal from '../common/commonComponent/modalMessage';
import ButtonBottom from '../common/commonComponent/submitButtonRadius10Px';
import PhoneNumber from '../my/phone-number';
import ServiceProxy from '../service-proxy';
import URLHelper from "../common/url-helper";
import {MemberTypeChinese} from "../membership/member-type";
import {connect} from 'react-redux';
import {addUser, addUsers, clearUsers} from '../redux/actions/index';
import WeChatLogin from "./wechat";
import FacebookLogin from "./facebook";
import Track from "../common/track";
import './login-tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

const logger = require('../common/logger');
let interval = null;

class LoginTablet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waitSec: 0,
            code: '',
            mobileValid: false,
            profile: {
                phone: '',
                email: ''
            },
            mobileCountry: countryLongNameMap[zones[moment.tz.guess()].countries[0]],
            send: false,
            active_tab: 'third',
            active_form: 'password',
            hidden: true,
            password: '',
            agreement: true
        };

        this.status = {};
        this.facebookInfo = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.sms = this.sms.bind(this);
        this.toggleLoginStyle = this.toggleLoginStyle.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.submit = this.submit.bind(this);
        this.facebookLogin = this.facebookLogin.bind(this);
        this.wechatLogin = this.wechatLogin.bind(this);
        this.facebookLoginFail = this.facebookLoginFail.bind(this);
    }

    onCountryCodeChange = (event, data) =>
        this.setState({mobileCountry: data.value});

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({
            profile: clonedProfile,
            mobileValid: clonedProfile.phone && clonedProfile.phone.length > 0
        });
    }

    handleCodeChange(event) {
        this.setState({code: event.target.value});
    }

    toggleLoginStyle() {
        if (this.state.active_form === 'code') {
            this.setState({active_form: 'password'});
        } else {
            this.setState({active_form: 'code'});
        }
    }

    togglePassword() {
        this.setState({hidden: !this.state.hidden});
    }

    toggleLogin(tab) {
        if (this.state.active_tab !== tab) {
            this.setState({active_tab: tab, facebookDisconnect: false});
        }
    }

    async submit() {
        if (this.state.active_tab === 'account' && this.state.active_form === 'password') {
            //账号密码登录
            await this.accountLogin();
        }
        if (this.state.active_tab === 'account' && this.state.active_form === 'code') {
            //随机密码登录-验证码登录
            await this.codeLogin();
        }
    }

    facebookLogin() {
        Track.event('登录页面_点击微信登录按钮', null, {
            '用户类型': MemberTypeChinese.Student
        });

        browserHistory.push(`/login/facebook${window.location.search}`);
    }

    wechatLogin() {
        Track.event('登录页面_点击微信登录按钮', null, {
            '用户类型': MemberTypeChinese.Student
        });

        if(/MicroMessenger/.test(navigator.userAgent)){
            WeChatLogin.redirectToWechatOAuthPage();
        }else{
            WeChatLogin.redirectToWechatQRcode();
        }
    }

    async sms() {
        let mobile = `00${countryCodeMap[this.state.mobileCountry]}${this.state.profile.phone}`;

        logger.fundebug.notify('发送手机验证码', mobile, {metaData: this.state});
        try {
            const phoneResult = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/mobile/sms`,
                    json: {
                        mobile: mobile,
                        mobile_country: this.state.mobileCountry
                    },
                    method: 'POST'
                }
            });

            if (phoneResult && phoneResult.error) {
                this.setState({
                    messageModal: true,
                    messageContent: Resources.getInstance().phoneSendWrong,
                    waitSec: 30,
                    send: true
                }, () => {
                    const interval = setInterval(() => {
                        if (this.state.waitSec) {
                            this.setState({waitSec: this.state.waitSec - 1});
                        } else {
                            clearInterval(interval)
                        }
                    }, 1000)
                });
            } else {
                this.setState({
                    messageModal: true,
                    messageContent: Resources.getInstance().profileSendSuccess,
                    waitSec: 60,
                    send: true
                }, () => {
                    const interval = setInterval(() => {
                        if (this.state.waitSec) {
                            this.setState({waitSec: this.state.waitSec - 1});
                        } else {
                            clearInterval(interval)
                        }
                    }, 1000)
                });
            }
        }
        catch (e) {
            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().emailSendWrong,
                waitSec: 10
            }, () => {
                const interval = setInterval(() => {
                    if (this.state.waitSec) {
                        this.setState({waitSec: this.state.waitSec - 1});
                    } else {
                        clearInterval(interval)
                    }
                }, 1000)
            });
        }
        finally {
            this.closeMessageModal();
        }
    }

    onPasswordChange(event) {
        let password = event.target.value;
        this.setState({
            password: password
        });
    }

    closeMessageModal() {
        interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    async componentWillMount(){
        await ServiceProxy.proxy('/sign-out-no-redirect');
    }

    componentWillUnmount() {
        if (interval) {
            clearTimeout(interval);
        }

        this.setState = (state, callback) => {
            return false;
        };
    }

    render() {
        return (
            <div className="login-in-tablet">
                <TabletHeader/>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName}
                              modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}
                              style={{top: '0'}}
                />
                <div className="login-intro">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/login_picture.png" alt=""/>
                    <div className="intro-content">
                        <div className="title">BUZZBUZZ</div>
                        <div className="content">
                            <p>结识英语学伴，对话英美少年！</p>
                            <p>开启你的国际交流旅程。</p>
                        </div>
                    </div>
                </div>
                <div className="login-tab">
                    <div className="tab-container">
                        <div onClick={() => this.toggleLogin('third')}
                             className={ this.state.active_tab === 'third' ? "login-others active" : "login-others"}>第三方登录
                        </div>
                        <div className="line"></div>
                        <div onClick={() => this.toggleLogin('account')}
                             className={ this.state.active_tab === 'account' ? "login-others active" : "login-others"}>账号密码
                        </div>
                    </div>
                    <div className="login-form">
                        {
                            this.state.active_tab === 'account' &&
                            <PhoneNumber profile={this.state.profile} handleChange={this.handleChange}
                                         code={this.state.code} handleCodeChange={this.handleCodeChange}
                                         waitSec={this.state.waitSec} mobileValid={this.state.mobileValid}
                                         sms={this.sms} send={this.state.send}
                                         mobileCountry={this.state.mobileCountry}
                                         onCountryCodeChange={this.onCountryCodeChange}
                                         codeModalNone={this.state.active_form !== 'code'}
                                         dropDownStyle={{
                                             width: '100px',
                                             marginRight: '5px',
                                             minWidth: '120px',
                                             whiteSpace: 'nowrap',
                                             display: 'flex',
                                             paddingLeft: '15px',
                                             alignItems: 'center'
                                         }}/>
                        }
                        {
                            this.state.active_tab === 'account' && this.state.active_form === 'password' &&
                            <div className="login-password">
                                <input type={ this.state.hidden ? "password" : "text"} className="login-password"
                                       placeholder="请输入密码" onChange={this.onPasswordChange}
                                       value={this.state.password} name='password'
                                />
                                <div className="eye" onClick={this.togglePassword}>
                                    <img
                                        src={ this.state.hidden ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_password_on.svg" :
                                            "//cdn-corner.resource.buzzbuzzenglish.com/icon_password_off.svg"} alt=""/>
                                </div>
                            </div>
                        }
                        {
                            this.state.active_tab === 'account' &&
                            <div className="btn">
                                <ButtonBottom
                                    disabled={this.formIsInvalid()}
                                    text={Resources.getInstance().accountLogin}
                                    submit={this.submit}/>
                            </div>
                        }
                        {
                            this.state.active_tab === 'third' &&
                            <div className="third-login">
                                {
                                    !/MicroMessenger/.test(navigator.userAgent) &&
                                    <FacebookLogin btnText="facebook" mobileFacebookUI={true}
                                                   LoginFail={this.facebookLoginFail}/>
                                }
                                {
                                    !/MicroMessenger/.test(navigator.userAgent) &&
                                    <div className="facebook-status" ref={div => {
                                        this.facebookInfo = div;
                                    }} style={this.state.facebookDisconnect ? {height: '32px'} : {height: '0'}}>
                                        Facebook连接失败，请检查您的网络连接
                                    </div>
                                }
                                <div className="we-chat" onClick={this.wechatLogin}>
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_wechat.svg" alt=""/>
                                    <span>微信</span>
                                </div>
                                <div className="agreement">
                                    <img
                                        src={this.state.agreement === true ? "//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_select_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_select.svg"}
                                        alt=""/>
                                    <span>{Resources.getInstance().profileAgreement}</span>
                                </div>
                            </div>
                        }
                        {
                            this.state.active_tab === 'account' &&
                            <div className="toggle-login">
                                <div className="line"></div>
                                <div className="toggle-word"
                                     style={this.state.active_tab === 'third' ? {textDecoration: 'none'} : {}}
                                     onClick={this.toggleLoginStyle}>{this.state.active_form === 'code' ? '用密码登录' : '忘记密码'}</div>
                                <div className="line"></div>
                            </div>
                        }
                    </div>
                </div>
                <TabletFooter/>
            </div>
        );
    }

    formIsInvalid() {
        if (this.state.active_tab === 'account' && this.state.active_form === 'code') {
            return !this.state.mobileValid || !this.state.code || !this.state.send;
        } else if (this.state.active_tab === 'account' && this.state.active_form === 'password') {
            return !this.state.profile.phone || !this.state.password;
        } else {
            return false;
        }
    }

    async accountLogin() {
        this.setState({loadingModal: true});
        this.props.clearUsers();

        try {
            let result = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/account-sign-in`,
                    json: {
                        account: this.state.profile.phone,
                        password: this.state.password,
                        mobile_country: this.state.mobileCountry
                    },
                    method: 'PUT'
                }
            });

            if (result instanceof Array) {
                this.props.addUsers(result);
                this.setState({loadingModal: false}, () => {
                    let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');
                    if(returnUrl.indexOf('sign-out') !== -1 || returnUrl.indexOf('login') !== -1 ){
                        browserHistory.push('/login-select');
                    }else{
                        browserHistory.push(`/login-select?return_url=${returnUrl}`);
                    }
                });
                return;
            }

            this.setState({loadingModal: false}, () => {
                let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');

                if (returnUrl && decodeURIComponent(returnUrl).indexOf('sign-out') <= -1) {
                    window.location.href = decodeURIComponent(returnUrl);
                } else {
                    browserHistory.push('/');
                }
            });
        } catch (ex) {
            this.setState({
                messageModal: true,
                messageContent: ex.status === 500 ? Resources.getInstance().emailSendWrong : Resources.getInstance().accountLoginFailed,
                loadingModal: false
            });
            this.closeMessageModal();
        }
    }

    async codeLogin() {
        try {
            this.setState({loadingModal: true});
            this.props.clearUsers();

            try {
                let result = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/signInByMobileCode`,
                        json: {
                            mobile: this.state.profile.phone,
                            code: this.state.code,
                            mobile_country: this.state.mobileCountry
                        },
                        method: 'POST'
                    }
                });

                if (result instanceof Array) {
                    this.props.addUsers(result);
                    this.setState({loadingModal: false}, () => {
                        browserHistory.push('/login-select');
                    });
                    return;
                }

                this.setState({loadingModal: false}, () => {
                    let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');

                    if (returnUrl) {
                        window.location.href = decodeURIComponent(returnUrl);
                    } else {
                        browserHistory.push('/');
                    }
                });
            } catch (ex) {
                this.setState({
                    messageModal: true,
                    messageContent: ex.status === 500 ? Resources.getInstance().emailSendWrong : Resources.getInstance().accountLoginFailed,
                    loadingModal: false
                });
                this.closeMessageModal();
            }
        }
        catch (ex) {
            this.setState({
                messageModal: true,
                messageContent: ex.status === 500 ? Resources.getInstance().emailSendWrong : Resources.getInstance().codeLoginFailed,
                loadingModal: false
            });
            this.closeMessageModal();
        }
    }

    facebookLoginFail() {
        this.setState({facebookDisconnect: true});
        this.facebookInfo.style.animation = 'facebook-info-show-tablet .3s linear';
    }

}


const mapStateToProps = store => ({
    users: store.users
});

const mapDispatchToProps = dispatch => ({
    addUser: user => {
        dispatch(addUser(user));
    },
    addUsers: users => {
        dispatch(addUsers(users));
    },
    clearUsers: () => {
        dispatch(clearUsers());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginTablet);