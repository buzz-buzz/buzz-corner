import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import {Link} from "react-router";
import './index.css';

class User extends Component {
    constructor() {
        super();

        this.state = {
            avatar: 'https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd',
            u_name: 'buzz'
        }
    }

    async componentDidMount() {
        try {
            let userId = await CurrentUser.getUserId();

            let profile = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                }
            });

            if(true){
                this.setState({
                    avatar: profile.avatar,
                    userId: userId,
                    u_name: profile.display_name || profile.name || profile.facebook_name || profile.wechat_name || 'buzz'
                });
            }
        } catch (ex) {
            //login error
            //browserHistory.push('/login-for-wechat');
        } finally {
            //browserHistory.push('/login-for-wechat');
            console.log('no user_id');
        }
    }

    render() {
        return (
            <div className="user-page">
                <div className="header-with-go-back">
                    <div className="logo-without-back">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
                <div className="user-content">
                    <div className="user-my">
                        <div className="user-avatar">
                            <img src={this.state.avatar} alt=""/>
                        </div>
                        <div className="user-info">
                            <p className="name">{this.state.u_name}</p>
                            <p className="nationality">CHINA</p>
                        </div>
                    </div>
                    <div className="user-menu">
                        <Link>
                            <div className="icon">
                                <Icon name='calendar'/>
                                <div className="name">
                                    我的课时
                                </div>
                            </div>
                            <div className="link">
                                <div className="class-numbers">4</div>
                                <div className="right-icon">
                                    <img src="//p579tk2n2.bkt.clouddn.com/image/icon_back.png" alt=""/>
                                </div>
                            </div>
                        </Link>
                        <Link>
                            <div className="icon">
                                <Icon name='globe'/>
                                <div className="name">
                                    语言系统
                                </div>
                            </div>
                            <div className="link">
                                <div className="class-numbers">中文</div>
                                <div className="right-icon">
                                    <img src="//p579tk2n2.bkt.clouddn.com/image/icon_back.png" alt=""/>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default User;