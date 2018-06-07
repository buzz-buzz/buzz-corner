import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import QiniuDomain from '../common/systemData/qiniuUrl';
import './tablet.css';
import Track from "../common/track";
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

class SelectRoleTablet extends Component {
    constructor() {
        super();

        this.state = {};

        this.chineseChildEntrance = this.chineseChildEntrance.bind(this);
        this.foreignChildEntrance = this.foreignChildEntrance.bind(this);
        this.goVideoPlayPage = this.goVideoPlayPage.bind(this);
        this.loginAccount = this.loginAccount.bind(this);
    }

    loginAccount() {
        browserHistory.push(`/login/account?return_url=${URLHelper.getSearchParam(window.location.search, 'return_url')}`);
    }

    async chineseChildEntrance() {
        this.setState({loadingModal: true});
        Track.event('注册/登录_点击中方');
        browserHistory.push(`/sign-in?role=${MemberType.Student}&return_url=${URLHelper.getSearchParam(window.location.search, 'return_url')}`);
    }

    foreignChildEntrance() {
        this.setState({loadingModal: true});
        Track.event('注册/登录_点击外籍');
        browserHistory.push(`/sign-in?role=${MemberType.Companion}&return_url=${URLHelper.getSearchParam(window.location.search, 'return_url')}`)
    }

    goVideoPlayPage() {
        Track.event('注册/登录_点击查看案例');
        browserHistory.push('/video-play');
    }

    componentDidMount() {
        Track.event('注册/登录_欢迎页');
    }

    render() {
        return (
            <div className="login-entrance-tablet">
                <TabletHeader/>
                <div className="entrance-tablet">
                    <div className="role-choose-tablet">
                        <div className="btn-content">
                            <div className="btn-title">{Resources.getInstance().welcomePageIntroductionLineOne}</div>
                            <div className="btns">
                                <button
                                    onClick={this.foreignChildEntrance}>{Resources.getInstance().welcomePageForeignChild}</button>
                                <button
                                    onClick={this.chineseChildEntrance}>{Resources.getInstance().welcomePageChineseChild}</button>
                                <span style={{
                                    color: '#4a90e2',
                                    fontSize: '10px',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                                      onClick={this.loginAccount}>{Resources.getInstance().accountPasswordLogin}</span>
                            </div>
                        </div>
                    </div>
                    <div className="role-choose-video">
                        <img src={QiniuDomain + "/tablet/header-bg.png"} alt=""/>
                        <div className="icon-play" onClick={this.goVideoPlayPage}>
                            <img src={QiniuDomain + "/tablet/icon_video.png"} alt=""/>
                        </div>
                    </div>
                </div>
                <TabletFooter/>
            </div>
        );
    }
}

export default SelectRoleTablet;
