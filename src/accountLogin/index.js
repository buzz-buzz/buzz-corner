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
import AccountSelect from '../accountSelect/index';
import Back from '../common/back';

import {connect} from 'react-redux';
import {addUser, addUsers, clearUsers} from '../actions/index';
import {Dropdown} from "semantic-ui-react";
import {iso3166_data} from "phone";
import {countryLongNameMap} from "../common/country-code-map";
import {zones} from "moment-timezone/data/meta/latest";
import moment from "moment-timezone";

const countryList = iso3166_data.map(i => ({
    mobileLength: i.phone_number_lengths,
    mobileBeginWith: i.mobile_begin_with,
    countryName: i.country_name,
    countryLongName: i.alpha3,
    countryShortName: i.alpha2,
    countryCode: i.country_code
}));

const countryOptions = countryList.map(c => ({
    key: c.countryLongName,
    value: c.countryLongName,
    flag: c.countryShortName.toLowerCase(),
    text: `(+${c.countryCode}) ${c.countryName}`
}));


class AccountLogin extends Component {
    constructor() {
        super();

        this.state = {
            data: {
                user_account: '',
                user_password: '',
                user_id: null
            },
            title: Resources.getInstance().accountPasswordLogin,
            mobileCountry: countryLongNameMap[zones[moment.tz.guess()].countries[0]]
        };

        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.forgottenPassword = this.forgottenPassword.bind(this);

        console.log('constructing...');
    }

    back() {
        Track.event('账号密码登录页面返回');

        Back.back();
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
        this.props.clearUsers();

        console.log('state = ', this.state);

        try {
            let result = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/account-sign-in`,
                    json: {
                        account: this.state.data.user_account,
                        password: this.state.data.user_password,
                        user_id: this.state.data.user_id,
                        mobile_country: this.state.mobileCountry
                    },
                    method: 'PUT'
                }
            });

            if (result instanceof Array) {
                this.props.addUsers(result)
                this.setState({
                    loadingModal: false,
                    multipleUsers: true,
                    title: Resources.getInstance().accountSelectLogin
                })
                return;
            }

            this.setState({loadingModal: false}, () => {
                let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url')

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

    async componentDidMount() {
        Track.event('设置密码页面展示');
    }

    selectUser = (userId) => {
        this.setState({
            data: {
                ...this.state.data,
                user_id: userId
            }
        }, async () => {
            await this.submit();
        });
    };

    render() {
        return (
            <div className="account-login">
                <MessageModal modalName={this.state.messageName}
                              modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <HeaderWithBack goBack={this.back} title={this.state.title}/>
                {
                    !this.state.multipleUsers &&
                    <div className="set-word">
                        <div className="user-password">
                            <img
                                src="//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_account.svg"
                                alt=""/>

                            <Dropdown
                                placeholder={Resources.getInstance().selectCountryCode}
                                search selection options={countryOptions}
                                style={{width: '80px', marginRight: '10px', minWidth: '140px'}}
                                value={this.state.mobileCountry}
                                onChange={(event, data) =>
                                    this.setState({mobileCountry: data.value})}/>

                            <BuzzInput
                                type="text"
                                placeholder={Resources.getInstance().accountInputAccount}
                                value={this.state.data.user_account}
                                onChange={this.handleChange}
                                name='user_account'
                            />
                        </div>
                        <div className="user-password">
                            <img
                                src="//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_password.svg"
                                alt=""/>
                            <BuzzInput
                                type="password"
                                placeholder={Resources.getInstance().accountInputPasswordLogin}
                                value={this.state.data.user_password}
                                onChange={this.handleChange}
                                name='user_password'
                            />
                        </div>
                        <div className="update-btn">
                            <Button50px
                                disabled={!this.state.data.user_password || !this.state.data.user_account || this.state.data.user_password.length < 6}
                                text={Resources.getInstance().accountLogin}
                                submit={this.submit}/>
                        </div>
                        <div className="forgotten"
                             onClick={this.forgottenPassword}>
                            {Resources.getInstance().accountForgotten}
                        </div>
                        <div className="flex-end">
                            <div
                                onClick={this.forgottenPassword}>{Resources.getInstance().accountHow}</div>
                        </div>
                    </div>
                }
                {
                    this.state.multipleUsers &&
                    <AccountSelect onSelectUser={this.selectUser}/>
                }
            </div>
        );
    }
}

export default connect(null, dispatch => {
    return {
        addUser: user => {
            dispatch(addUser(user));
        },
        addUsers: users => {
            dispatch(addUsers(users));
        },
        clearUsers: () => {
            dispatch(clearUsers());
        }
    }
})(AccountLogin);
