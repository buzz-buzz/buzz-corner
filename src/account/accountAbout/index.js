import React, {Component} from 'react';
import Resources from '../../resources';
import Track from "../../common/track";
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import './index.css';

class UpdatePassword extends Component {
    constructor() {
        super();

        this.back = this.back.bind(this);
    }

    back() {
        Track.event('设置密码页面返回');

        window.history.go(-1);
    }

    render() {
        return (
            <div className="account-info">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().accountAboutTitle}/>
                <div className="title">{Resources.getInstance().profileStep1Info}</div>
                <div className="picture-show">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/account_show.png" alt=""/>
                </div>
            </div>
        );
    }
}

export default UpdatePassword;