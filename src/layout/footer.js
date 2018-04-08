import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import {Link} from "react-router";
import './footer.css';

class Footer extends Component {
    constructor() {
        super();

        this.state = {
            url: window.location.href
        };

        this.clickEvent = this.clickEvent.bind(this);
    }

    clickEvent(event, page){
        Track.event('首页_点击' + page + '图标');
    }

    componentDidMount() {
        let url = window.location.href;

        if (this.state.url !== url) {
            this.setState({
                url: url
            });
        }
    }

    render() {
        return (
            <div className="footer">
                <Link to="home" style={this.state.url.indexOf('/home') > -1 ? {color: '#f7b52a'} : {}} onClick={event => this.clickEvent(event, '首页')}>
                    <img
                        src={this.state.url.indexOf('/home') > -1 ? "//p579tk2n2.bkt.clouddn.com/Icon_home_active.png" : "//p579tk2n2.bkt.clouddn.com/Icon_home.png"}
                        alt=""/>
                    <p>
                        {Resources.getInstance().footerHome}
                    </p>
                </Link>
                <Link to="friends" style={this.state.url.indexOf('/friends') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '好友')}>
                    <img
                        src={this.state.url.indexOf('/friends') > -1 ? "//p579tk2n2.bkt.clouddn.com/icon_Friend_active.png" : "//p579tk2n2.bkt.clouddn.com/icon_Friend.png"}
                        alt=""/>
                    <p>
                        {Resources.getInstance().footerFriends}
                    </p>
                </Link>
                <Link to="reward" style={this.state.url.indexOf('/reward') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '奖励')}>
                    <img
                        src={this.state.url.indexOf('/reward') > -1 ? "//p579tk2n2.bkt.clouddn.com/Icon_Reward_active.png" : "//p579tk2n2.bkt.clouddn.com/Icon_Reward.png"}
                        alt=""/>
                    <p>
                        {Resources.getInstance().footerReward}
                    </p>
                </Link>

                <Link to="user" style={this.state.url.indexOf('/user') > -1 ? {color: '#f7b52a'} : {}}  onClick={event => this.clickEvent(event, '我的')}>
                    <img
                        src={this.state.url.indexOf('/user') > -1 ? "//p579tk2n2.bkt.clouddn.com/icon_user_active.png" : "//p579tk2n2.bkt.clouddn.com/icon_user.png"}
                        alt=""/>
                    <p>
                        {Resources.getInstance().footerUser}
                    </p>
                </Link>
            </div>
        );
    }
}

export default Footer;
