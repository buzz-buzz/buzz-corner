import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import {Link} from "react-router";
import {MemberType} from "../membership/member-type";
import './footer.css';

class Footer extends Component {
    constructor() {
        super();

        this.clickEvent = this.clickEvent.bind(this);
    }

    clickEvent(event, page){
        Track.event('首页_点击' + page + '图标');
    }

    componentWillMount(){
        let path_name = window.location.pathname;

        this.setState({
            role: localStorage.getItem('role') || this.props.role,
            path_name: path_name
        });
    }

    render() {
        return (
            <div className="footer">
                <Link to="home" style={this.state.path_name.indexOf('/home') > -1 || this.state.path_name === '/' ? {color: '#f7b52a'} : {}} onClick={event => this.clickEvent(event, '首页')}>
                    <img
                        src={this.state.path_name.indexOf('/home') > -1 || this.state.path_name === '/' ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_home_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_home.svg"}
                        alt=""/>
                    <p  style={this.state.path_name.indexOf('/home') > -1 || this.state.path_name === '/' ? {color: '#f7b52a'} : {}}>
                        {Resources.getInstance().footerHome}
                    </p>
                </Link>
                {
                    this.state.role === MemberType.Student ?
                        <Link to="course" style={this.state.path_name.indexOf('/course') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '淘课')}>
                            <img
                                src={this.state.path_name.indexOf('/course') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course.svg"}
                                alt=""/>
                            <p style={this.state.path_name.indexOf('/course') > -1 ? {color: '#f7b52a'} : {}}>
                                {Resources.getInstance().footerSelectCourse}
                            </p>
                        </Link>
                        :
                        <Link to="friends" style={this.state.path_name.indexOf('/friends') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '好友')}>
                            <img
                                src={this.state.path_name.indexOf('/friends') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_friend_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_friend.svg"}
                                alt=""/>
                            <p style={this.state.path_name.indexOf('/friends') > -1 ? {color: '#f7b52a'} : {}}>
                                {Resources.getInstance().footerFriends}
                            </p>
                        </Link>
                }
                <Link to="reward" style={this.state.path_name.indexOf('/reward') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '奖励')}>
                    <img
                        src={this.state.path_name.indexOf('/reward') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_reward_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/Icon_reward.svg"}
                        alt=""/>
                    <p  style={this.state.path_name.indexOf('/reward') > -1 ? {color: '#f7b52a'} : {}}>
                        {Resources.getInstance().footerReward}
                    </p>
                </Link>
                <Link to="user" style={this.state.path_name.indexOf('/user') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '我的')}>
                    <img
                        src={this.state.path_name.indexOf('/user') > -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_user_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/footer/icon_user.svg"}
                        alt=""/>
                    <p style={this.state.path_name.indexOf('/user') > -1 ? {color: '#f7b52a'} : {}}>
                        {Resources.getInstance().footerUser}
                    </p>
                </Link>
            </div>
        );
    }
}

export default Footer;
