import React, {Component} from 'react';
import Resources from '../resources';
import moment from 'moment-timezone';
import {zones} from 'moment-timezone/data/meta/latest.json';
import {countries} from 'moment-timezone/data/meta/latest.json';
import {countryCodeMap, countryLongNameMap} from "../common/country-code-map";
import LoadingModal from '../common/commonComponent/loadingModal';
import MessageModal from '../common/commonComponent/modalMessage';
import ButtonBottom from '../common/commonComponent/submitButtonRadius10Px';
import PhoneNumber from '../my/phone-number';
import ServiceProxy from '../service-proxy';
import './index.css';

const logger = require('../common/logger');
let interval = null;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waitSec: 0,
            code: '',
            mobileValid: false,
            emailValid: false,
            profile: {
                parent_name: '',
                phone: '',
                student_en_name: '',
                city: '',
                date_of_birth: '',
                gender: '',
                grade: '',
                topics: [],
                email: '',
                school: '',
                country: '',
                time_zone: ''
            },
            mobileCountry: countryLongNameMap[zones[moment.tz.guess()].countries[0]],
            send: false,
            active_tab: 'account',
            active_form: 'code',
            hidden: true,
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.sms = this.sms.bind(this);
        this.toggleLoginStyle = this.toggleLoginStyle.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    onCountryCodeChange = (event, data) =>
        this.setState({mobileCountry: data.value});

    handleChange(event) {
        let clonedProfile = Object.assign({}, this.state.profile);

        clonedProfile[event.target.name] = event.target.value;
        this.setState({
            profile: clonedProfile,
            mobileValid: clonedProfile.phone && clonedProfile.phone.length > 0,
            emailValid: clonedProfile.email && this.state.email_reg.test(clonedProfile.email) && clonedProfile.student_en_name
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

    togglePassword(){
        this.setState({hidden: !this.state.hidden});
    }

    toggleLogin(tab) {
        if (this.state.active_tab !== tab) {
            this.setState({active_tab: tab});
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
            <div className="login-in">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName}
                              modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}
                              style={{top: '0'}}
                />
                <div className="login-intro">
                    <div className="intro-content">
                        <div className="title">BUZZBUZZ</div>
                        <div className="content">
                            <p>结识英语学伴，对话英美少年！</p>
                            <p>开启你的国际交流旅程。</p>
                        </div>
                    </div>
                </div>
                <div className="login-tab">
                    <div onClick={() => this.toggleLogin('third')}
                         className={ this.state.active_tab === 'third' ? "login-others active" : "login-others"}>第三方登陆
                    </div>
                    <div onClick={() => this.toggleLogin('account')}
                         className={ this.state.active_tab === 'account' ? "login-others active" : "login-others"}>账号密码
                    </div>
                    <div className="status"
                         style={ this.state.active_tab === 'third' ? {left: 'calc(25% - 5px)'} : {left: 'calc(75% - 5px)'} }
                    ></div>
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
                                         justifyContent: 'center',
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
                                <img src={ this.state.hidden ?  "//cdn-corner.resource.buzzbuzzenglish.com/icon_password_on.svg" :
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
                            <div className="face-book">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_facebook.svg" alt=""/>
                                <span>facebook</span>
                            </div>
                            <div className="we-chat">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_wechat.svg" alt=""/>
                                <span>微信</span>
                            </div>
                        </div>
                    }
                    <div className="toggle-login">
                        <div className="line"></div>
                        <div className="toggle-word"
                             style={this.state.active_tab === 'third' ? {textDecoration: 'none'} : {}}
                             onClick={this.toggleLoginStyle}>{ this.state.active_tab === 'third' ? '快捷登陆' : (this.state.active_form === 'code' ? '用密码登陆' : '忘记密码')}</div>
                        <div className="line"></div>
                    </div>
                </div>
            </div>
        );
    }

    formIsInvalid() {
        if (this.state.active_tab === 'account' && this.state.active_form === 'code') {
            return !this.state.mobileValid || !this.state.code || !this.state.send;
        }else if (this.state.active_tab === 'account' && this.state.active_form === 'password') {
            return !this.state.profile.phone || false;
        }
        return false;
    }

}

export default Login;