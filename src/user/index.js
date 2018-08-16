import React, {Component} from 'react';
import {Link} from 'react-router';
import CurrentUser from "../membership/user";
import Resources from '../resources';
import Footer from '../layout/footer';
import Track from "../common/track";
import {MemberType} from "../membership/member-type";
import {browserHistory} from "react-router";
import '../common/Icon/style.css';
import './index.css';
import {Button} from "semantic-ui-react";
import ServiceProxy from "../service-proxy";
import Index from '../common/commonComponent/ConfirmationModal/index';

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg',
            u_name: 'buzz',
            class_hours: 0,
            country: 'china',
            switchToUserId: 0,
            role: '',
            password: false,
            ios: false
        };

        this.handleUserIdChange = this.handleUserIdChange.bind(this);
        this.switchToOtherUser = this.switchToOtherUser.bind(this);
        this.showUserInfo = this.showUserInfo.bind(this);
        this.signOut = this.signOut.bind(this);
        this.closePopModal = this.closePopModal.bind(this);
        this.openPopModal = this.openPopModal.bind(this);
        this.goUpdateProfile = this.goUpdateProfile.bind(this);
    }

    showUserInfo() {
        browserHistory.push('/user/' + this.state.userId);
    }

    signOut() {
        Track.event('我的_点击切换账号');

        this.setState({signOutModal: false}, () => {
            browserHistory.push('/sign-out');
        });
    }

    closePopModal() {
        this.setState({signOutModal: false});
    }

    openPopModal() {
        this.setState({signOutModal: true});
    }

    goUpdateProfile() {
        Track.event('我的_编辑个人信息按钮点击');

        browserHistory.push('/user-profile');
    }

    async componentWillMount() {
        Track.event('我的_我的页面展示');

        //TitleSet.setTitle(Resources.getInstance().footerUser);

        let profile = await CurrentUser.getProfile(true) || {};
        const ua_info = require("ua_parser").userAgent(window.navigator.userAgent);

        console.log(ua_info);

        this.setState({
            avatar: profile.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg',
            userId: profile.user_id,
            u_name: profile.name || profile.display_name || profile.facebook_name || profile.wechat_name || 'buzz',
            class_hours: (profile.class_hours || 0) + (profile.booked_class_hours || 0),
            country: profile.country || 'china',
            isSuper: await CurrentUser.isSuper(),
            role: profile.role || '',
            password: !!profile.password,
            ios: !!ua_info.os.ios
        });
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        };
    }

    render() {
        return (
            <div className="user-page">
                <Index cancel={this.closePopModal} sure={this.signOut} modal={this.state.signOutModal}
                       sureText={Resources.getInstance().popSure} cancelText={Resources.getInstance().popCancel}
                       info={Resources.getInstance().popInfo} title={Resources.getInstance().popTitle}
                />
                <div className="user-content">
                    <div className="user-my">
                        <div className="user-avatar" onClick={this.showUserInfo}>
                            <img src={this.state.avatar} alt=""/>
                        </div>
                        <div className="user-info">
                            <p className="name">{this.state.u_name}</p>
                            <p className="nationality">{this.state.country}</p>
                        </div>
                        <div className="edit-img" onClick={this.goUpdateProfile}>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_sign.svg" alt=""/>
                        </div>
                        <div className="sign-out" onClick={this.openPopModal}>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_switch.svg" alt=""/>
                        </div>
                    </div>
                    <div className="user-menu">
                        {
                            this.state.role === MemberType.Student &&
                            <Link to="class-lessons" className="after-line">
                                <div className="icon">
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_course.svg" alt=""/>
                                    <div className="name">
                                        {Resources.getInstance().myCoins}
                                    </div>
                                </div>
                                <div className="link">
                                    <div className="class-numbers">{this.state.class_hours || 0}</div>
                                    <div className="right-icon">
                                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                                    </div>
                                </div>
                            </Link>
                        }
                        {
                            this.state.isSuper &&
                            <Link to="" className="after-line">
                                <div className="icon">
                                    <div className="name">
                                        <span>切换成其他用户(id):</span>
                                        <input type="number" name="switchToUserId"
                                                           onChange={this.handleUserIdChange}
                                                           value={this.state.switchToUserId}/>
                                        <Button onClick={this.switchToOtherUser}>切换</Button>
                                    </div>
                                </div>
                                <div className="link">
                                    <div className="right-icon">
                                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                                    </div>
                                </div>
                            </Link>
                        }
                        <Link to="account/set">
                            <div className="icon">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/user/icon_password.svg" alt=""/>
                                <div className="name">
                                    {Resources.getInstance().myAccount}
                                </div>
                            </div>
                            <div className="link">
                                <div
                                    className="class-numbers">{this.state.password ? Resources.getInstance().accountSet : Resources.getInstance().accountUnset}</div>
                                <div className="right-icon">
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_right_turn.svg" alt=""/>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

    handleUserIdChange(event) {
        this.setState({switchToUserId: event.target.value})
    }

    async switchToOtherUser() {
        await ServiceProxy.proxy(`/switch-to-user/${this.state.switchToUserId}`);
        window.location.reload()
    }
}

export default User;
