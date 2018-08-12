import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import {Link} from "react-router";
import {MemberType} from "../membership/member-type";
import './footer.css';
import CurrentUser from "../membership/user";

class Footer extends Component {
    constructor(props) {
        super(props);

        this.clickEvent = this.clickEvent.bind(this);

        this.state = {role: ''}
    }

    clickEvent(event, page) {
        Track.event('首页_点击' + page + '图标');
    }

    async componentWillMount() {
        let role = (await CurrentUser.getProfile()).role;

        this.setState({
            role: role,
        });
    }

    render() {
        return (
            <div className="footer">
                <Link to="home" style={window.location.pathname.indexOf('/home') > -1 || window.location.pathname === '/' ? {color: '#f7b52a'} : {}}
                      onClick={event => this.clickEvent(event, '首页')}>
                    <img
                        src={window.location.pathname.indexOf('/home') > -1 || window.location.pathname === '/' ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_home_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_home.svg"}
                        alt=""/>
                    <p style={window.location.pathname.indexOf('/home') > -1 || window.location.pathname === '/' ? {color: '#f7b52a'} : {}}>
                        {Resources.getInstance().footerHome}
                    </p>
                </Link>
                {
                    this.state.role === MemberType.Student &&
                    <Link to="course" style={window.location.pathname.indexOf('/course') > -1 ? {color: '#f7b52a'} : {}}
                          onClick={event => this.clickEvent(event, '淘课')}>
                        <img
                            src={window.location.pathname.indexOf('/course') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course.svg"}
                            alt=""/>
                        <p style={window.location.pathname.indexOf('/course') > -1 ? {color: '#f7b52a'} : {}}>
                            {Resources.getInstance().footerSelectCourse}
                        </p>
                    </Link>
                }
                {
                    this.state.role === MemberType.Companion &&
                    <Link to="friends" style={window.location.pathname.indexOf('/friends') > -1 ? {color: '#f7b52a'} : {}}
                          onClick={event => this.clickEvent(event, '好友')}>
                        <img
                            src={window.location.pathname.indexOf('/friends') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_friend_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_friend.svg"}
                            alt=""/>
                        <p style={window.location.pathname.indexOf('/friends') > -1 ? {color: '#f7b52a'} : {}}>
                            {Resources.getInstance().footerFriends}
                        </p>
                    </Link>
                }
                <Link to="reward" style={window.location.pathname.indexOf('/reward') > -1 ? {color: '#f7b52a'} : {}}
                      onClick={event => this.clickEvent(event, '奖励')}>
                    <img
                        src={window.location.pathname.indexOf('/reward') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_reward_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_reward.svg"}
                        alt=""/>
                    <p style={window.location.pathname.indexOf('/reward') > -1 ? {color: '#f7b52a'} : {}}>
                        {Resources.getInstance().footerReward}
                    </p>
                </Link>
                <Link to="user" style={window.location.pathname.indexOf('/user') > -1 ? {color: '#f7b52a'} : {}}
                      onClick={event => this.clickEvent(event, '我的')}>
                    <img
                        src={window.location.pathname.indexOf('/user') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_user_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_user.svg"}
                        alt=""/>
                    <p style={window.location.pathname.indexOf('/user') > -1 ? {color: '#f7b52a'} : {}}>
                        {Resources.getInstance().footerUser}
                    </p>
                </Link>
            </div>
        );
    }
}

export default Footer;
