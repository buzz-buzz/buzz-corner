import React, {Component} from 'react';
import {Link} from 'react-router';
import CurrentUser from "../membership/user";
import Resources from '../resources';
import Footer from '../layout/footer';
import Track from "../common/track";
import '../common/Icon/style.css';
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
        Track.event('我的_我的页面展示');

        let profile = await CurrentUser.getProfile();

        this.setState({
            avatar: profile.avatar,
            userId: profile.user_id,
            u_name: profile.name || profile.display_name || profile.facebook_name || profile.wechat_name || 'buzz',
            class_hours: profile.class_hours || 0
        });
    }

    render() {
        return (
            <div className="user-page">
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
                                    <i className="icon-icon_back_down" />
                                </div>
                            </div>
                        </Link>
                        {/*<Link style={{display: 'none'}}>*/}
                            {/*<div className="icon">*/}
                                {/*<img src="//p579tk2n2.bkt.clouddn.com/icon_language.png" alt=""/>*/}
                                {/*<div className="name">*/}
                                    {/*{Resources.getInstance().myLanguage}*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="link">*/}
                                {/*<div className="class-numbers">中文</div>*/}
                                {/*<div className="right-icon">*/}
                                    {/*<i className="icon-icon_back_down" />*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</Link>*/}
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default User;