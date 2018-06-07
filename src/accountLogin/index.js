import React, {Component} from 'react';
import Button50px from '../common/commonComponent/submitButton50px';
import BuzzInput from '../common/commonComponent/buzzInput';
import Track from "../common/track";
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import LoadingModal from '../common/commonComponent/loadingModal';
import {browserHistory} from "react-router";
import Resources from '../resources';
import './index.css';
import MessageModal from '../common/commonComponent/modalMessage';
import ServiceProxy from "../service-proxy";
import URLHelper from "../common/url-helper";

class AccountLogin extends Component {
    constructor() {
        super();

        this.state = {
            data: {
                user_account: '',
                user_password: ''
            }
        };

        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.forgottenPassword = this.forgottenPassword.bind(this);
    }

    back() {
        Track.event('账号密码登录页面返回');

        window.history.go(-1);
    }

    forgottenPassword() {
        browserHistory.push('/account/about');
    }

    handleChange(event) {
        let clonedData = this.state.data;

        clonedData[event.target.name] = event.target.value;

        this.setState({data: clonedData});
    }

    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    async submit() {
        this.setState({loadingModal: true});
        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/account-sign-in`,
                    json: {
                        account: this.state.data.user_account,
                        password: this.state.data.user_password
                    },
                    method: 'PUT'
                }
            });

            this.setState({loadingModal: false}, () => {
                let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url')

                if (returnUrl) {
                    window.location.href = returnUrl;
                } else {
                    browserHistory.push('/');
                }
            });
        } catch (ex) {
            console.error(ex);
            this.setState({
                messageModal: true,
                messageContent: Resources.getInstance().accountLoginFailed,
                loadingModal: false
            });
            this.closeMessageModal();
        }
    }

    async componentDidMount() {
        Track.event('设置密码页面展示');
    }

    render() {
        return (
            <div className="account-login">
                <MessageModal modalName={this.state.messageName} modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().accountPasswordLogin}/>
                <div className="set-word">
                    <div className="user-password">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_account.svg" alt=""/>
                        <BuzzInput
                            type="text" placeholder={Resources.getInstance().accountInputAccount}
                            value={this.state.data.user_account}
                            onChange={this.handleChange}
                            name='user_account'
                        />
                    </div>
                    <div className="user-password">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_password.svg" alt=""/>
                        <BuzzInput
                            type="password" placeholder={Resources.getInstance().accountInputPasswordLogin}
                            value={this.state.data.user_password}
                            onChange={this.handleChange}
                            name='user_password'
                        />
                    </div>
                    <div className="update-btn">
                        <Button50px
                            disabled={!this.state.data.user_password || !this.state.data.user_account || this.state.data.user_password.length < 6}
                            text={Resources.getInstance().accountLogin} submit={this.submit}/>
                    </div>
                    <div className="forgotten" onClick={this.forgottenPassword}>
                        {Resources.getInstance().accountForgotten}
                    </div>
                    <div className="flex-end">
                        <div onClick={this.forgottenPassword}>{Resources.getInstance().accountHow}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountLogin;