import React, {Component} from 'react';
import Resources from '../../resources';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import {browserHistory} from 'react-router';
import CurrentUser from "../../membership/user";
import './index.css';
import '../../common/Icon/style.css';


function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return String(date.getFullYear()) + '-' + String(date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + String(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    } else {
        return ''
    }
}

class UserUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {}
        };
    }

    back(){
        window.history.back();
    }

    async componentWillMount(){
        let profile = this.getProfileFromUserData(await CurrentUser.getProfile(true));
        if (!profile.role) {
            browserHistory.push('/select-role');
            return;
        }

        this.setState({
            profile: profile
        });
    }

    getProfileFromUserData(userData) {
        return {
            parent_name: userData.parent_name || userData.display_name || userData.name || userData.facebook_name || userData.wechat_name || '',
            phone: userData.mobile || '',
            student_en_name: userData.name || '',
            gender: userData.gender,
            date_of_birth: getBirthDay(userData.date_of_birth),
            city: userData.city || '',
            grade: userData.grade || '',
            topics: userData.interests instanceof Array ? userData.interests : (userData.interests ? userData.interests.split(',') : []),
            user_id: userData.user_id,
            role: userData.role,
            email: userData.email || '',
            school: userData.school_name || '',
            country: userData.country || '',
            time_zone: userData.time_zone || '',
            avatar: userData.avatar || '//p579tk2n2.bkt.clouddn.com/logo-image.svg'
        };
    }

    render() {
        return (
            <div className="profile-update">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().userUpdateTitle} />
                <div className="update-body">
                    <div className="avatar-update with-half-border">
                        <div className="avatar-img">
                            <img src={this.state.profile.avatar || '//p579tk2n2.bkt.clouddn.com/logo-image.svg'} alt=""/>
                        </div>
                        <div className="update-right">
                            <span>更换</span>
                            <i className="icon-icon_back_down"/>
                        </div>
                    </div>
                    <div className="item-update with-half-border"></div>
                    <div className="item-update with-half-border"></div>
                    <div className="item-update with-half-border"></div>
                    <div className="item-update with-half-border"></div>
                    <div className="item-update with-half-border"></div>
                    <div className="item-update with-half-border"></div>
                    <div className="item-update with-half-border"></div>
                </div>
            </div>
        );
    }
}

export default UserUpdate;