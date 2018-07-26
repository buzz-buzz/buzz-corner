import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import './index.css';
import ServiceProxy from '../service-proxy';
import WechatShare from '../wechat/wechatShare';
import LoadingModal from '../common/commonComponent/loadingModal';
import Track from "../common/track";

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
            console.log("Wechat share:" + ex.toString());
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="class-poster">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <div className="poster-content">
                    <div className="avatars">
                        <div className="chinese-avatar">
                            <div className="avatar-image">
                                <img src={this.state.user_from.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'} alt=""/>
                            </div>
                            <div className="bg-image"></div>
                            <div className="country-word">{this.state.user_from.country ? this.state.user_from.country.toLocaleUpperCase() : 'USA'}</div>
                        </div>
                        <div className="companion-avatar">
                            <div className="avatar-image">
                                <img src={this.state.user_to.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'} alt=""/>
                            </div>
                            <div className="bg-image"></div>
                            <div className="country-word">{this.state.user_to.country ? this.state.user_to.country.toLocaleUpperCase() : 'USA'}</div>
                        </div>
                    </div>
                    <div className="introduce-word-image">
                        <div className="introduce">
                            我与{this.state.user_to.name || this.state.user_to.wechat_name}一起成为了国际学伴。
                            我们一起聊得很开心。
                        </div>
                        <div className="image">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/introduce-share.png" alt=""/>
                        </div>
                    </div>
                    <div className="feedback-show">
                        <div className="feedback-info" style={ this.state.user_from_feedback && this.state.user_from_feedback.length ? {} : {display: 'none'}}>
                            <div className="name">{this.state.user_from.name || this.state.user_from.wechat_name}</div>
                            <div className="city-grade">{this.state.user_from.city}</div>
                            <div className="comment">{ this.state.user_from_feedback && this.state.user_from_feedback.length ? this.state.user_from_feedback[0].comment : ''}</div>
                            <div className="image-float">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_dot.png" alt=""/>
                            </div>
                        </div>
                        <div className="feedback-label">
                            <div>评论</div>
                        </div>
                        <div className="feedback-info reverse" style={ this.state.user_to_feedback && this.state.user_to_feedback.length ? {} : {display: 'none'}} >
                            <div className="name" style={{textAlign: 'right'}}>{this.state.user_to.name || this.state.user_to.wechat_name}</div>
                            <div className="city-grade" style={{textAlign: 'right'}}>{this.state.user_from.city}</div>
                            <div className="comment" style={{textAlign: 'right'}}>{ this.state.user_to_feedback && this.state.user_to_feedback.length ? this.state.user_to_feedback[0].comment : ''}</div>
                            <div className="image-float-left">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_dot.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="class-contact">
                        <div className="how-btn">BuzzBuzz如何上课</div>
                        <div className="video-buzz">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/banner-inland.png" alt=""/>
                            <div className="video-btn" onClick={this.goVideoPlayPage}>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_play.png" alt=""/>
                            </div>
                        </div>
                        <div className="contact-info">
                            <div className="contact-title">加入BuzzBuzz</div>
                            <div className="contact-two-qrcode">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/logo_full%20name.png" alt=""/>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/poster-qrcode.png" alt=""/>
                            </div>
                            <div className="contact-footer">长按识别二维码 加入BuzzBuzz对话全球优秀少年</div>
                        </div>
                    </div>
                </div>
                <div className="share-btn">
                    <p>点击这里分享</p>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/Triangle_2.png" alt=""/>
                </div>
                <div className="share-img">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/BUZZ.png" alt=""/>
                </div>
                <div className="yellow-background"></div>
                <div className="share-img" style={{top: '550px'}}>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/BUZZ.png" alt=""/>
                </div>
                <div className="yellow-background-reverse" style={{top: '800px'}}></div>
            </div>
        );
    }
}

export default classEvaluationPoster;