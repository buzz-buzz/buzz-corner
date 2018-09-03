import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Flag} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import WechatShare from '../wechat/wechatShare';
import LoadingModal from '../common/commonComponent/loadingModal';
import ErrorHandler from '../common/error-handler';
import Track from "../common/track";
import './img.css';

class classEvaluationPoster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            from_user_id: props.params.from_user_id,
            to_user_id: props.params.to_user_id,
            user_from: {
                avatar: '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
            },
            user_to: {
                avatar: '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
            }
        };

        this.goVideoPlayPage = this.goVideoPlayPage.bind(this);
    }

    goVideoPlayPage(){
        browserHistory.push('/video-play');
    }

    async componentWillMount() {
        try {
            this.setState({loadingModal: true});

            WechatShare.init({
                title: 'BuzzBuzz English',
                desc: '分享一个学英语的秘诀我与英美同学的对话日常',
                link: window.location.href,
                imgUrl: 'https://cdn-corner.resource.buzzbuzzenglish.com/logo-1024px.png',
                success: function(){
                    Track.event('中方分享成就海报', '微信分享', { '分享状态': '成功', '分享数据': window.location.href});
                },
                cancel: function(){
                    Track.event('中方分享成就海报', '微信分享', { '分享状态': '取消', '分享数据': window.location.href});
                }
            });

            //get data

            let user_from = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.from_user_id}`
                }
            });

            let user_to =  await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.to_user_id}`
                }
            });

            let user_from_feedback = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.from_user_id}/evaluate/${this.state.to_user_id}`
                }
            });

            let user_to_feedback =  await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.to_user_id}/evaluate/${this.state.from_user_id}`
                }
            });

            this.setState({
                loadingModal: false,
                user_from: user_from,
                user_to: user_to,
                user_from_feedback: user_from_feedback,
                user_to_feedback: user_to_feedback
            });
        } catch (ex) {
            //login error
            ErrorHandler.notify('评价分享页出错', ex);
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="poster-img">
                <div className="title">
                    <p>我与"hank"一起成为了国际学伴。</p>
                    <p>我们一起讨论了"<span>Eating</span>"课题。</p>
                </div>
                <div className="content-img">
                    <div className="top-head">
                        <img src="https://cdn-corner.resource.buzzbuzzenglish.com/colorful.png" alt=""/>
                    </div>
                    <div className="letter">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/letter.png" alt="" className="letter"/>
                        <div className="info">
                            <div className="user-info">
                                <div className="u-avatar" style={{marginRight: '15px'}}>
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg" alt=""/>
                                </div>
                                <div className="u-info">
                                    <div className="country">
                                        <span>{'BuzzBuzz'}</span>&nbsp;&nbsp;
                                        <Flag name={'united states'}/>
                                    </div>
                                    <div className="grade">
                                        美国 二年级
                                    </div>
                                </div>
                            </div>
                            <div className="feedback-word" style={{marginBottom: '30px'}}>
                                Eathan is a bit hesitant to speak, but he participated. I would recommend him to be more confident in himself and don’t be shy. Overall, however……
                            </div>
                            <div className="user-info" style={{justifyContent: 'flex-end'}}>
                                <div className="u-info">
                                    <div className="country">
                                        <span>{'BuzzBuzz'}</span>&nbsp;&nbsp;
                                        <Flag name={'united states'}/>
                                    </div>
                                    <div className="grade">
                                        美国 二年级
                                    </div>
                                </div>
                                <div className="u-avatar"  style={{marginLeft: '15px'}}>
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg" alt=""/>
                                </div>
                            </div>
                            <div className="feedback-word">
                                Eathan is a bit hesitant to speak, but he participated. I would recommend him to be more confident in himself and don’t be shy. Overall, however……
                            </div>
                        </div>
                    </div>
                </div>
                <div className="qr-code">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/qr-code.svg" alt=""/>
                    <p>长按识别二维码 加入BuzzBuzz对话全球优秀少年</p>
                </div>
            </div>
        );
    }
}

export default classEvaluationPoster;