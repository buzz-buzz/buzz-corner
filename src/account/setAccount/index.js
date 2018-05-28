import React, {Component} from 'react';
import Button50px from '../../common/commonComponent/submitButton50px';
import BuzzInput from '../../common/commonComponent/buzzInput';
import CurrentUser from "../../membership/user";
import Track from "../../common/track";
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import LoadingModal from '../../common/commonComponent/loadingModal';
import Resources from '../../resources';
import MessageModal from '../../common/commonComponent/modalMessage';
import './index.css';
import ServiceProxy from "../../service-proxy";

class UpdatePassword extends Component {
    constructor() {
        super();

        this.state = {
            data: {
                user_account: '',
                user_password: ''
            },
            update: false
        };

        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    back() {
        Track.event('设置密码页面返回');

        window.history.go(-1);
    }

    handleChange(event) {
        let clonedData = this.state.data;
        clonedData.user_password = event.target.value;

        this.setState({data: clonedData, update: true});
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
            await ServiceProxy.proxy('/user-info', {
                body: {
                    account: this.state.data.user_account,
                    password: this.state.data.user_password
                },
                method: 'PUT'
            });

            this.setState({messageModal: true, messageContent: Resources.getInstance().saveSuccess, loadingModal: false, update: false});
            this.closeMessageModal();
        } catch (ex) {
            console.error(ex);
            this.setState({messageModal: true, messageContent: Resources.getInstance().saveFailed, loadingModal: false, update: false});
            this.closeMessageModal();
        }
    }

    async componentDidMount() {
        Track.event('设置密码页面展示');

        let profile = await CurrentUser.getProfile(true);

        let clonedData = this.state.data;
        clonedData.user_account = profile.mobile || profile.email;
        clonedData.user_password = profile.password;

        this.setState({data: clonedData});
    }

    render() {
        return (
            <div className="update-password">
                <MessageModal modalName={this.state.messageName} modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().accountSetTitle}/>
                <div className="set-word">
                    <div className="user-count">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_account.svg" alt=""/>
                        <p>{this.state.data.user_account}</p>
                    </div>
                    <div className="user-password">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_password.svg" alt=""/>
                        <BuzzInput
                            type="text" placeholder={Resources.getInstance().accountInputPassword}
                            value={this.state.data.user_password}
                            onChange={this.handleChange}
                            name='user_password'
                        />
                    </div>
                    <div className="update-btn">
                        <Button50px disabled={!this.state.data.user_password || this.state.data.user_password.length < 6 || !this.state.update }
                                    text={Resources.getInstance().accountUpdateBtn} submit={this.submit}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdatePassword;