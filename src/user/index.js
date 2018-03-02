import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
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
                </div>
                <Footer />
            </div>
        );
    }
}

export default User;