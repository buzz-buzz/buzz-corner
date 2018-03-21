import React, {Component} from 'react';
import {Icon} from 'semantic-ui-react';
import {Link} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import Footer from '../layout/footer';
import './index.css';

class User extends Component {
    constructor() {
        super();

        this.state = {
            avatar: 'https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd',
            u_name: 'buzz',
            class_hours: 0
        }
    }

    async componentDidMount() {
        try {
            //await CurrentUser.getUserId()
            let userId = await CurrentUser.getUserId();

            let profile = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                }
            });

            if (true) {
                this.setState({
                    avatar: profile.avatar,
                    userId: userId,
                    u_name: profile.name || profile.display_name || profile.facebook_name || profile.wechat_name || 'buzz',
                    class_hours: profile.class_hours || 0
                });
            }
        } catch (ex) {
            console.log(ex.toString());
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
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="Buzzbuzz Logo"/>
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
                        <Link to="class-lessons">
                            <div className="icon">
                                <img src="//p579tk2n2.bkt.clouddn.com/icon_my%20coins.png" alt=""/>
                                <div className="name">
                                    {Resources.getInstance().myCoins}
                                </div>
                            </div>
                            <div className="link">
                                <div className="class-numbers">{this.state.class_hours}</div>
                                <div className="right-icon">
                                    <img src="//p579tk2n2.bkt.clouddn.com/image/icon_back.png" alt=""/>
                                </div>
                            </div>
                        </Link>
                        <Link style={{display: 'none'}}>
                            <div className="icon">
                                <img src="//p579tk2n2.bkt.clouddn.com/icon_language.png" alt=""/>
                                <div className="name">
                                    {Resources.getInstance().myLanguage}
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
                <Footer/>
            </div>
        );
    }
}

export default User;