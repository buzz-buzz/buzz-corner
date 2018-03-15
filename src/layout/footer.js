import React, {Component} from 'react';
import {Container, Icon} from "semantic-ui-react";
import { browserHistory } from 'react-router';
import {Link} from "react-router";
import './footer.css';

class Footer extends Component {
    constructor() {
        super();

        this.state = {
            url: window.location.href
        };

        this.linkTo = this.linkTo.bind(this);
    }

    linkTo(url){
        if(this.state.url.indexOf(url) === -1){
            //browserHistory.push(url);
        }
    }

    componentDidMount() {
        let url = window.location.href;

        if(this.state.url !== url){
            this.setState({
                url: url
            });
        }
    }

    render() {
        return (
            <div className="footer">
                <Link to="home" style={this.state.url.indexOf('/home') > -1 ? {color: '#f7b52a'} : {}}>
                    <img src={ this.state.url.indexOf('/home') > -1 ? "//p579tk2n2.bkt.clouddn.com/Icon_home_active.png" : "//p579tk2n2.bkt.clouddn.com/Icon_home.png"} alt=""/>
                    <p>
                        主页
                    </p>
                </Link>
                <Link to="friends" style={this.state.url.indexOf('/friends') > -1 ? {color: '#f7b52a'} : {}}>
                    <img src={ this.state.url.indexOf('/friends') > -1 ? "//p579tk2n2.bkt.clouddn.com/icon_Friend_active.png" : "//p579tk2n2.bkt.clouddn.com/icon_Friend.png"} alt=""/>
                    <p>
                        好友
                    </p>
                </Link>
                <Link to="reward"  style={this.state.url.indexOf('/reward') > -1 ? {color: '#f7b52a'} : {}}>
                    <img src={ this.state.url.indexOf('/reward') > -1 ? "//p579tk2n2.bkt.clouddn.com/Icon_Reward_active.png" : "//p579tk2n2.bkt.clouddn.com/Icon_Reward.png"} alt=""/>
                    <p>
                        奖励
                    </p>
                </Link>

                <Link to="user" style={this.state.url.indexOf('/user') > -1 ? {color: '#f7b52a'} : {}} >
                    <img src={ this.state.url.indexOf('/user') > -1 ? "//p579tk2n2.bkt.clouddn.com/icon_user_active.png" : "//p579tk2n2.bkt.clouddn.com/icon_user.png"} alt=""/>
                    <p>
                        我的
                    </p>
                </Link>
            </div>
        );
    }
}

export default Footer;
