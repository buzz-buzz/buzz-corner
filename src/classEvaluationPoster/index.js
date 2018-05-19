import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import './index.css';
import WechatShare from '../wechat/wechatShare';

class classEvaluationPoster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            from_user_id: props.params.from_user_id,
            to_user_id: props.params.to_user_id
        };

        this.goVideoPlayPage = this.goVideoPlayPage.bind(this);
    }

    goVideoPlayPage(){
        browserHistory.push('/video-play');
    }

    async componentDidMount() {
        try {
            WechatShare.init({
                title: 'BuzzBuzz English',
                desc: '分享一个学英语的秘诀我与英美同学的对话日常',
                link: window.location.href,
                imgUrl: '//cdn-corner.resource.buzzbuzzenglish.com/logo-1024px.png'
            });
        } catch (ex) {
            //login error
            console.log("evaluation:" + ex.toString());
        }
    }

    render() {
        return (
            <div className="class-poster">
                <div className="poster-content">
                    <div className="avatars">
                        <div className="chinese-avatar">
                            <div className="avatar-image"></div>
                            <div className="bg-image"></div>
                            <div className="country-word"></div>
                        </div>
                        <div className="companion-avatar">
                            <div className="avatar-image"></div>
                            <div className="bg-image"></div>
                            <div className="country-word"></div>
                        </div>
                    </div>
                    <div className="introduce-word-image">
                        <div className="introduce">
                            我与“外籍英文名”一起成为了国际学伴。
                            我们一起讨论了“
                            <span>主题名</span>
                            ”课题。
                        </div>
                        <div className="image">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/introduce-share.png" alt=""/>
                        </div>
                    </div>
                    <div className="feedback-show">
                        <div className="feedback-info">
                            <div className="name">Hank</div>
                            <div className="city-grade">shanghai/2年级</div>
                            <div className="comment">帅气的boy, nice!</div>
                            <div className="image-float">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_dot.png" alt=""/>
                            </div>
                        </div>
                        <div className="feedback-label">
                            <div>评论</div>
                        </div>
                        <div className="feedback-info reverse">
                            <div className="name" style={{textAlign: 'right'}}>Hank</div>
                            <div className="city-grade" style={{textAlign: 'right'}}>shanghai/2年级</div>
                            <div className="comment" style={{textAlign: 'right'}}>帅气的boy, nice!</div>
                            <div className="image-float-left">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_dot.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="class-contact">
                        <div className="how-btn">BuzzBuzz如何上课</div>
                        <div className="video-buzz">
                            <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png" alt=""/>
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
            </div>
        );
    }
}

export default classEvaluationPoster;