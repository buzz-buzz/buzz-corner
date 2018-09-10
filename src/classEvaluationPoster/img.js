import React, {Component} from 'react';
import {Flag} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import WechatShare from '../wechat/wechatShare';
import LoadingModal from '../common/commonComponent/loadingModal';
import ErrorHandler from '../common/error-handler';
import {GradeData} from "../common/systemData/gradeData";
import Track from "../common/track";
import './img.css';

const grade_list = GradeData.grade_list;

class classEvaluationPoster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingModal: false,
            class_id: props.params.class_id,
            from_user_id: props.params.from_user_id,
            to_user_id: props.params.to_user_id,
            user_from: {
                avatar: '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
            },
            user_to: {
                avatar: '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
            },
            class_info: {}
        };
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

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
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
                user_from_feedback: user_from_feedback && user_from_feedback.length ? user_from_feedback.filter(item => !item.type)[0].comment : '',
                user_to_feedback: user_to_feedback && user_to_feedback.length ? user_to_feedback.filter(item => !item.type)[0].comment : '',
                class_info: class_info
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
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <div className="share-btn">
                    <p>点击这里分享</p>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/Triangle_2.png" alt=""/>
                </div>
                <div className="title">
                    <p>我与"{ this.state.user_from.name || 'Eathan'}"一起成为了国际学伴。</p>
                    <p>我们一起讨论了"<span>{this.state.class_info.topic || 'Eating'}</span>"课题。</p>
                </div>
                <div className="content-img">
                    <div className="top-head">
                        <img src="https://cdn-corner.resource.buzzbuzzenglish.com/colorful.png" alt=""/>
                    </div>
                    <div className="letter">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/letter.png" alt="" className="letter"/>
                        <div className="info">
                            {
                                this.state.user_from_feedback &&
                                <div className="user-info">
                                    <div className="u-avatar" style={{marginRight: '15px'}}>
                                        <img src={this.state.user_from.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'} alt=""/>
                                    </div>
                                    <div className="u-info">
                                        <div className="country">
                                            <span>{'BuzzBuzz'}</span>&nbsp;&nbsp;
                                            <Flag name={this.state.user_from.country ? this.state.user_from.country.toLowerCase() : 'united states'}/>
                                        </div>
                                        <div className="grade">
                                            {this.state.user_from.country} {this.state.user_from.grade ? grade_list[parseInt(this.state.user_from.grade, 10) - 1].text : grade_list[0].text}
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.state.user_from_feedback &&
                                <div className="feedback-word" style={{marginBottom: '30px'}}>
                                    {this.state.user_from_feedback}
                                </div>
                            }
                            {
                                this.state.user_to_feedback &&
                                <div className="user-info" style={{justifyContent: 'flex-end'}}>
                                    <div className="u-info">
                                        <div className="country">
                                            <span>{'BuzzBuzz'}</span>&nbsp;&nbsp;
                                            <Flag name={this.state.user_to.country ? this.state.user_to.country.toLowerCase() : 'china'}/>
                                        </div>
                                        <div className="grade">
                                            {this.state.user_to.country} {this.state.user_to.grade ? grade_list[parseInt(this.state.user_to.grade, 10) - 1].text : grade_list[0].text}
                                        </div>
                                    </div>
                                    <div className="u-avatar"  style={{marginLeft: '15px'}}>
                                        <img src={this.state.user_to.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'} alt=""/>
                                    </div>
                                </div>
                            }
                            {
                                this.state.user_to_feedback &&
                                <div className="feedback-word">
                                    {this.state.user_to_feedback}
                                </div>
                            }
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