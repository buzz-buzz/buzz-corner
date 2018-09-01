import React from 'react';
import ServiceProxy from '../service-proxy';
import {Form} from 'semantic-ui-react';
import Resources from '../resources';
import CurrentUser from "../membership/user";
import moment from 'moment-timezone';
import Button50px from '../common/commonComponent/submitButtonRadius10Px';
import PhoneNumber from '../my/phone-number';
import ButtonBottom from '../common/commonComponent/submitButtonRadius10Px';
import MessageModal from '../common/commonComponent/modalMessage';
import UserItem from '../common/commonComponent/userItem';
import {zones} from 'moment-timezone/data/meta/latest.json';
import {countryCodeMap, countryLongNameMap} from "../common/country-code-map";
import TabletBindingMobile from './tabletBindingMobile';
import Client from "../common/client";
import {browserHistory} from 'react-router';
import LoadingModal from '../common/commonComponent/loadingModal';
import URLHelper from "../common/url-helper";
import '../my/my.css';

const logger = require('../common/logger');
let interval = null;

export default class WechatOAuthSuccess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            facebookUserInfo: JSON.parse(decodeURIComponent(atob(decodeURIComponent(props.params.facebookUserInfo)))),
            loadingModal: true,
            waitSec: 0,
            code: '',
            mobileValid: false,
            showModifyMobileModal: false,
            phone: '',
            mobileCountry: countryLongNameMap[zones[moment.tz.guess()].countries[0]],
            multipleUsers: [],
            active: '',
            send: false
        };

        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.sms = this.sms.bind(this);
        this.submitMobile = this.submitMobile.bind(this);
        this.onCountryCodeChange = this.onCountryCodeChange.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.selectLogin = this.selectLogin.bind(this);
    }

    async componentWillMount() {
        if (URLHelper.handleOrigin()) {
            return;
        }

        let base64QueryString = this.decodeBase64QueryString();
        this.setState({role: URLHelper.getSearchParam(base64QueryString, 'role'), base64QueryString: base64QueryString});

        await CurrentUser.signOutNoRedirect();
        try {
            //新用户-需要绑定手机号
            console.log('new--facebook---');
            this.setState({loadingModal: false, showModifyMobileModal: true});
            //如果该手机号 已有账户 且 无fb，更新该fb信息 到 原手机账户， 登陆原手机账户。
            //否则(无账户/有账户-其他fb)，创建新用户---
            //await this.loginNewUser(ex, this.state.facebookUserInfo);
        } catch (ex) {

        }
    }

    async gotoAfterLoginPage(base64QueryString) {
        let userId = await CurrentUser.getUserId();

        let profile = (await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
            }
        }));

        let returnUrl = URLHelper.getSearchParam(base64QueryString, 'return_url');
        if (returnUrl.indexOf('sign-out') !== -1 || returnUrl.indexOf('login') !== -1) {
            returnUrl = '';
        }

        if (!profile.date_of_birth || (!profile.location && !profile.city && !profile.country) || !profile.name) {
            this.completeProfile(returnUrl);
        } else {
            this.goto(returnUrl);
        }
    }

    decodeBase64QueryString() {
        try {
            let base64QueryString = URLHelper.getSearchParam(window.location.search, 'base64_query_string');
            if (base64QueryString) {
                base64QueryString = atob(base64QueryString);
            }
            return base64QueryString;
        } catch (ex) {
            console.error(ex);
            return '';
        }
    }

    goto(returnUrl) {
        let path = returnUrl || '/home';

        if (!window.parent) {
            browserHistory.push(path);
        } else {
            window.parent.location.href = path;
        }
    }

    completeProfile(returnUrl) {
        let url = `/my/info?return_url=${returnUrl}`;

        if (!window.parent) {
            browserHistory.push(url);
        } else {
            window.parent.location.href = url;
        }
    }

    handleContactChange(event) {
        if (event.target.name === 'phone') {
            this.setState({
                phone: event.target.value,
                mobileValid: event.target.value && event.target.value.length > 0
            });
        }
    }

    handleCodeChange(event) {
        this.setState({code: event.target.value});
    }

    async sms() {
        let mobile = `00${countryCodeMap[this.state.mobileCountry]}${this.state.phone}`;

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
                    interval = setInterval(() => {
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
                    interval = setInterval(() => {
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

    closeMessageModal() {
        interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    async submitMobile() {
        try {
            this.setState({loadingModal: true, showModifyMobileModal: false});

            try {
                let result = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/signInByMobileCode`,
                        json: {
                            mobile: this.state.phone,
                            code: this.state.code,
                            mobile_country: this.state.mobileCountry
                        },
                        method: 'POST'
                    }
                });

                if (result instanceof Array) {
                    result = result.filter((item) => {
                        return !item.facebook_id
                    });
                    if (result && result.length > 1) {
                        this.setState({loadingModal: false, multipleUsers: result});
                    } else if (result && result.length === 1) {
                        //login this account
                        await this.wechatLoginUpdateMobile({
                            mobile: result[0].mobile,
                            token: result[0].token
                        });
                    } else if (result && result.length === 0) {
                        //sign-in a new user
                        let newUserId = await this.registerByFacebook(this.state.facebookUserInfo, this.state.phone, this.state.mobileCountry);
                        await this.loginByFacebook(this.state.facebookUserInfo.id, newUserId);

                        browserHistory.push('/select-role');
                    }
                } else {
                    if (result && !result.facebook_id) {
                        await CurrentUser.updateProfile({
                            name: this.state.facebookUserInfo.name,
                            facebook_id: this.state.facebookUserInfo.id,
                            facebook_name: this.state.facebookUserInfo.name,
                            source: URLHelper.getSearchParam(window.location.search, 'source') + '; 使用facebook创建账号'
                        });
                    }

                    await this.gotoAfterLoginPage(this.state.base64QueryString);
                }
            } catch (ex) {
                console.log('ex');
                console.log(ex);
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

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="login-in">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                {
                    this.state.showModifyMobileModal && Client.getClient() === 'phone' &&
                    <div className="my-profile">
                        <MessageModal style={{top: '0'}}
                                      modalContent={this.state.messageContent}
                                      modalShow={this.state.messageModal}/>
                        <Form className='profile-body'>
                            <h3 className="profile-title">绑定手机号</h3>
                            <PhoneNumber profile={{phone: this.state.phone}} handleChange={this.handleContactChange}
                                         code={this.state.code} handleCodeChange={this.handleCodeChange}
                                         waitSec={this.state.waitSec} mobileValid={this.state.mobileValid}
                                         sms={this.sms} send={this.state.send}
                                         mobileCountry={this.state.mobileCountry}
                                         onCountryCodeChange={this.onCountryCodeChange}/>
                            <div className="profile-btn">
                                <ButtonBottom
                                    disabled={!this.state.send || !this.state.phone || !this.state.code}
                                    text={Resources.getInstance().profileDone}
                                    submit={this.submitMobile}/>
                            </div>
                        </Form>
                    </div>
                }
                {
                    this.state.showModifyMobileModal && Client.getClient() === 'tablet' &&
                    <TabletBindingMobile profile={{phone: this.state.phone}} handleChange={this.handleContactChange}
                                         code={this.state.code} handleCodeChange={this.handleCodeChange}
                                         waitSec={this.state.waitSec} mobileValid={this.state.mobileValid}
                                         sms={this.sms} send={this.state.send}
                                         mobileCountry={this.state.mobileCountry}
                                         onCountryCodeChange={this.onCountryCodeChange}
                                         submit={this.submitMobile}
                    />
                }
                {
                    this.state.multipleUsers && this.state.multipleUsers.length > 1 &&
                    <div className="account-select">
                        <div className='success' style={{top: '0', position: 'relative'}}>
                            {Resources.getInstance().accountSelectLoginInfo}
                        </div>
                        <div className="account-item">
                            {
                                this.state.multipleUsers.map(u =>
                                    <UserItem active={this.state.active} selectUser={this.selectUser} user={u} key={u.user_id}/>
                                )
                            }
                        </div>
                        <div className="account-btn">
                            <Button50px disabled={!this.state.active}
                                        text={Resources.getInstance().accountSelectLoginSubmit} submit={this.selectLogin}/>
                        </div>
                    </div>
                }
            </div>
        );
    }

    selectUser(event, user_id) {
        if (this.state.active !== user_id) {
            this.setState({active: user_id});
        }
    }

    onCountryCodeChange = (event, data) => {
        this.setState({mobileCountry: data.value})
    };

    async wechatLoginUpdateMobile(data) {
        if (!data || !data.mobile || !data.token) {
            this.setState({
                messageModal: true,
                messageContent: '数据失效，请重新登录!'
            });
            this.closeMessageModal();
            return false;
        }
        this.setState({loadingModal: true});

        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/signInByMobileCode`,
                    json: data,
                    method: 'POST'
                }
            });

            await this.gotoAfterLoginPage(this.state.base64QueryString);
        } catch (ex) {
            this.setState({
                messageModal: true,
                messageContent: ex.status === 500 ? Resources.getInstance().emailSendWrong : Resources.getInstance().accountLoginFailed,
                loadingModal: false
            });
            this.closeMessageModal();
        }
    }

    selectLogin = async () => {
        let userId = this.state.active;
        let users = this.state.multipleUsers, login_data = {};
        for (let i in users) {
            if (userId + '' === users[i].user_id + '') {
                login_data.mobile = users[i].mobile;
                login_data.token = users[i].token;
                break;
            }
        }

        await this.wechatLoginUpdateMobile(login_data);
    };

    registerByFacebook = async(facebookUserInfo, mobile, mobile_country) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: '{config.endPoints.buzzService}/api/v1/users',
                method: 'POST',
                json: {
                    name: facebookUserInfo.name,
                    facebook_id: facebookUserInfo.id,
                    facebook_name: facebookUserInfo.name,
                    mobile: mobile && mobile_country ? '00' + countryCodeMap[mobile_country] + mobile : null,
                    source: URLHelper.getSearchParam(window.location.search, 'source') + '; 使用facebook创建账号'
                }
            }
        });
    };
    loginByFacebook = async(facebookId, userId) => {
        let res = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/sign-in`,
                method: 'PUT',
                json: {
                    user_id: userId,
                    facebook_id: facebookId
                }
            }
        });

        this.setState({
            userInfo: res,
            loading: false
        });

        let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url') || '/';
        if (returnUrl) {
            window.location.href = returnUrl;
        }
    };
}