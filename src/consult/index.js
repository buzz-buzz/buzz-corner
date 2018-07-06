import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import CurrentUser from "../membership/user";
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import {MemberType} from "../membership/member-type";
import './index.css';

class Consult extends Component {
    constructor() {
        super();

        this.state = {
            role: ''
        };

        this.back = this.back.bind(this);
    }

    back() {
        Track.event('顾问_顾问页面返回');

        browserHistory.push('/home');
    }

    async componentDidMount() {
        Track.event('顾问_顾问页面展示');

        let profile = await CurrentUser.getProfile(true);

        this.setState({role: profile.role});
    }

    render() {
        return (
            <div className="consult-page">
                <HeaderWithBack goBack={this.back} title='none' />
                {
                    this.state.role === MemberType.Student &&
                    <div className="consult-content">
                        <div className="consult-avatar">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg" alt=""/>
                        </div>
                        <div className="consult-word">
                            <p>{Resources.getInstance().advisorInfo1}</p>
                            <p>{Resources.getInstance().advisorInfo2}</p>
                        </div>
                        <div className="consult-QR-code">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/buzz_advisor_code.jpg" alt=""/>
                            <p>{Resources.getInstance().advisorInfo3}</p>
                        </div>
                    </div>
                }
                {
                    this.state.role === MemberType.Companion &&
                    <div className="consult-content">
                        <div className="consult-avatar">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg" alt=""/>
                        </div>
                        <div className="consult-word-foreign">
                            <p>I am your private advisor</p>
                        </div>
                        <div className="email">
                            <p className="email-title">1.  You can send mail to contact us</p>
                            <div  className="email-address">
                                <p>
                                    <img style={{height: '15px'}} src= { QiniuDomain + "/icon_mail.svg"} alt=""/>
                                    <a style={{verticalAlign: 'super', marginLeft: '10px', color: '#666'}} href="mailto:peertutor@buzzbuzzenglish.com" >peertutor@buzzbuzzenglish.com</a>
                                </p>
                            </div>
                        </div>
                        <p className="email-title">2. You can use wechat and <span style={{color: '#edae00'}}>scan the QR code</span></p>
                        <div className="consult-QR-code" style={{width: '40%'}}>
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/companion_advisor.jpg" alt=""/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Consult;