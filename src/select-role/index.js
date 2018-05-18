import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import QiniuDomain from '../common/systemData/qiniuUrl';
import './index.css';
import Track from "../common/track";
import {Message} from "semantic-ui-react";
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";

class SelectRole extends Component {
    constructor() {
        super();

        this.state = {};

        this.chineseChildEntrance = this.chineseChildEntrance.bind(this);
        this.foreignChildEntrance = this.foreignChildEntrance.bind(this);
        this.goVideoPlayPage = this.goVideoPlayPage.bind(this);
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
            <div className="login-entrance">
                {
                    this.state.error &&
                    <Message warning>
                        <p>{this.state.message}</p>
                    </Message>
                }
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <div className="entrance-logo">
                    <div className="logo">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/logo_full%20name.png" alt="Buzzbuzz Logo"/>
                    </div>
                    <div className="entrance-word">
                        <p>{Resources.getInstance().welcomePageIntroductionLineOne}</p>
                        <p>{Resources.getInstance().welcomePageIntroductionLineTwo}</p>
                    </div>
                </div>
                <div className="entrance-choose">
                    <div onClick={this.foreignChildEntrance}>
                        <div className="image">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_girl.png" alt=""/>
                        </div>
                        <div className="choseBtn">{Resources.getInstance().welcomePageForeignChild}</div>
                    </div>
                    <div onClick={this.chineseChildEntrance}>
                        <div className="image">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_boy.png" alt=""/>
                        </div>
                        <div className="choseBtn">{Resources.getInstance().welcomePageChineseChild}</div>
                    </div>
                </div>
                <div className="preview-video">
                    <p>{Resources.getInstance().welcomePageBtnWord}</p>
                    <div className="preview-video-btn" onClick={this.goVideoPlayPage}>
                        <div className="btn-circle">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_play.png" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectRole;
