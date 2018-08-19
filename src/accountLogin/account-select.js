import React, {Component} from 'react';
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
import {clearUsers} from '../redux/actions/index';

class AccountSelectLogin extends Component {
    constructor() {
        super();

        this.state = {
            login_data: {}
        };

        this.back = this.back.bind(this);
        this.submit = this.submit.bind(this);
    }

    back() {
        Track.event('账号密码登录页面返回');

        Back.back();
    }

    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
    }

    async submit(data) {
        if(!data || !data.mobile || !data.token){
            this.setState({
                messageModal: true,
                messageContent: '数据失效，请重新登录!'
            });
            this.closeMessageModal();
            return false;
        }
        this.setState({loadingModal: true});
        this.props.clearUsers();

        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/signInByMobileCode`,
                    json: data,
                    method: 'POST'
                }
            });

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

    async componentWillMount() {
        Track.event('多账号选择页面展示');

        if(!(this.props.users && this.props.users instanceof Array && this.props.users.length > 1)){
            browserHistory.push('/login/account');
        }
    }

    selectUser = (userId) => {
        let users = this.props.users, login_data ={};
        for(let i in users){
            if(userId + '' === users[i].user_id + ''){
                login_data.mobile = users[i].mobile;
                login_data.token = users[i].token;
                break;
            }
        }

        this.setState({
            login_data: login_data
        }, async() => {
            await this.submit(login_data);
        });
    };

    render() {
        return (
            <div className="account-login">
                <MessageModal modalName={this.state.messageName}
                              modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().accountSelectLogin}/>
                <AccountSelect onSelectUser={this.selectUser}/>
            </div>
        );
    }
}

export default connect(state => {
    return {
        users: state.users
    }
}, dispatch => {
    return {
        clearUsers: () => {
            dispatch(clearUsers());
        }
    }
})(AccountSelectLogin);