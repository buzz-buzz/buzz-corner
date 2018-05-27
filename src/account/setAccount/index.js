import React, {Component} from 'react';
import Button50px from '../../common/commonComponent/submitButton50px';
import BuzzInput from '../../common/commonComponent/buzzInput';
import CurrentUser from "../../membership/user";
import Track from "../../common/track";
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import LoadingModal from '../../common/commonComponent/loadingModal';
import Resources from '../../resources';
import './index.css';
import ServiceProxy from "../../service-proxy";

class UpdatePassword extends Component {
    constructor() {
        super();

        this.state = {
            data: {
                user_account: '13061710755',
                user_password: ''
            }
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

        this.setState({data: clonedData});
    }

    async submit() {
        this.setState({loadingModal: true});
        try {
            let result = await ServiceProxy.proxy('/user-info', {
                body: {
                    account: this.state.data.user_account,
                    password: this.state.data.user_password
                },
                method: 'PUT'
            });
            console.log('====');
            console.log(result);
        } catch (ex) {
            console.error(ex);
        } finally {
            this.setState({loadingModal: false});
        }
    }

    async componentDidMount() {
        Track.event('设置密码页面展示');

        let profile = await CurrentUser.getProfile(true);

        let clonedData = this.state.data;
        clonedData.user_account = profile.mobile || profile.email;

        this.setState({data: clonedData});
    }

    render() {
        return (
            <div className="update-password">
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
                        <Button50px disabled={!this.state.data.user_password}
                                    text={Resources.getInstance().accountLogin} submit={this.submit}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdatePassword;