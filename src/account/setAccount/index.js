import React, {Component} from 'react';
import Back from '../../common/back';
import Button50px from '../../common/commonComponent/submitButtonRadius10Px';
import CurrentUser from "../../membership/user";
import Track from "../../common/track";
import LoadingModal from '../../common/commonComponent/loadingModal';
import ErrorHandler from '../../common/error-handler';
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
            update: false,
            hidden: true
        };

        this.back = this.back.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.toggleHidden = this.toggleHidden.bind(this);
    }

    back() {
        Track.event('设置密码页面返回');

        Back.back();
    }

    handleChange(event) {
        let clonedData = this.state.data;
        clonedData.user_password = event.target.value;

        this.setState({data: clonedData, update: true});
    }

    toggleHidden(){
        this.setState({hidden: !this.state.hidden});
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
            this.setState({loadingModal: false, update: false});
            ErrorHandler.notify( Resources.getInstance().saveFailed, ex);
        }
    }

    async componentWillMount() {
        Track.event('设置密码页面展示');

        let profile = await CurrentUser.getProfile();

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
                <div className="title">{Resources.getInstance().accountSetTitle}</div>
                <div className="set-word">
                    <div className="user-count">
                        <p className="label">{Resources.getInstance().accountAccount}</p>
                        <p className="info">{this.state.data.user_account}</p>
                    </div>
                    <div className="user-password">
                        <p className="label">{Resources.getInstance().accountPassword}</p>
                        <div className="input-container">
                            <input
                                type={this.state.hidden ? 'password' : 'text'} placeholder={Resources.getInstance().accountInputPassword}
                                value={this.state.data.user_password}
                                onChange={this.handleChange}
                            />
                            <div className="status" onClick={this.toggleHidden}>
                                <img src={this.state.hidden ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_password_on.svg" :
                                    "//cdn-corner.resource.buzzbuzzenglish.com/icon_password_off.svg" } alt=""/>
                            </div>
                        </div>
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