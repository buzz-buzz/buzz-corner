import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import CurrentUser from "../membership/user";
import {MemberType} from "../membership/member-type";
import './index.css';

class Consult extends Component {
    constructor() {
        super();

        this.back = this.back.bind(this);
    }

    back() {
        Track.event('顾问_顾问页面返回');

        window.history.back();
    }

    async componentDidMount() {
        Track.event('顾问_顾问页面展示');

        let profile = await CurrentUser.getProfile(true);

        this.setState({role: profile.role});
    }

    render() {
        return (
            <div className="consult-page">
                <div className="back-header">
                    <div>
                        <img onClick={this.back} style={{width: '20px'}}
                             src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""/>
                    </div>
                </div>
                <div className="consult-content">
                    <div className="consult-avatar">
                        <img src="//p579tk2n2.bkt.clouddn.com/buzz-teacher.png" alt=""/>
                    </div>
                    <div className="consult-word">
                        <p>{Resources.getInstance().advisorInfo1}</p>
                        <p>{Resources.getInstance().advisorInfo2}</p>
                    </div>
                    {
                        this.state.role === MemberType.Student ?
                            (<div className="consult-QR-code">
                                <img src="//p579tk2n2.bkt.clouddn.com/buzz_advisor_code.jpg" alt=""/>
                                <p>{Resources.getInstance().advisorInfo3}</p>
                            </div>)
                            :
                            (<div className="email-address">
                                <p className="email-info">service@buzzbuzzenglish.com</p>
                            </div>)
                    }
                </div>
            </div>
        );
    }
}

export default Consult;