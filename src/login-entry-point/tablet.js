import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import './tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

class LoginRole extends Component {
    render() {
        return (
            <div className="login-entry-point">
                <TabletHeader />
                <div className="login-entry-content">
                    <div className="login-left-word">
                        <div className="login-word">对话英美精英少年，轻松挺高英语听说</div>
                        <div className="items">
                            <img src="" alt=""/>
                        </div>
                    </div>
                    <div className="login-right-code">
                        <img src="" alt="" className="code"/>
                        <div className="code-word">使用微信扫码登录</div>
                    </div>
                </div>
                <TabletFooter />
            </div>
        );
    }
}

export default LoginRole;