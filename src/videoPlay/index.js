import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import './index.css';

class videoPlay extends Component {
    constructor() {
        super();

        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        browserHistory.push('/');
    }

    componentDidMount(){
        //event lister
        let videos = document.getElementsByClassName('video-react-video');
        if(videos && videos.length){
            videos[0].addEventListener('play', function(){
                if(document.getElementById('icon-play-video')){
                    document.getElementById('icon-play-video').style.display = 'none';
                }
            });

            videos[0].addEventListener('pause', function(){
                if(document.getElementById('icon-play-video')){
                    document.getElementById('icon-play-video').style.display = 'none';
                }
            });

            videos[0].addEventListener('ended', function(){
                if(document.getElementById('icon-play-video')){
                    document.getElementById('icon-play-video').style.display = 'none';
                }
            });
        }
    }

    render() {
        return (
            <div className="video-play">
                <HeaderWithBack goBack={this.goBack}/>
                <div className="video">
<<<<<<< HEAD
                    <EmbedVideo sources={[QiniuDomain + '/Training%20video_3min.mp4']}
                                poster={QiniuDomain + '/banner-inland.png'} />
                    <div className="video-btn" id="icon-play-video">
                        <img src={QiniuDomain + "/icon_play.png"} alt=""/>
=======
                    <EmbedVideo sources={['//cdn-corner.resource.buzzbuzzenglish.com/Training%20video_3min.mp4']}
                                poster={'//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png'} />
                    <div className="video-btn" id="icon-play-video">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_play.png" alt=""/>
>>>>>>> master
                    </div>
                </div>
                <div className="video-ad">
                    <div className="ad-word">
<<<<<<< HEAD
=======
                        {/*<div className="ad-title">在这里你的孩子可以获得</div>*/}
                        {/*<p className="ad-points">*/}
                            {/*<img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select_active.png" alt=""/><span> 摆脱哑巴英语困境, 学以致用。</span>*/}
                        {/*</p>*/}
                        {/*<p className="ad-points">*/}
                            {/*<img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select_active.png" alt=""/><span> 与国际学伴成为朋友, 打开国际视野。</span>*/}
                        {/*</p>*/}
>>>>>>> master
                        <p>英美少年学伴, &nbsp;最自然的交流状态</p>
                        <p>哈佛权威研发, &nbsp;有效提高英语口语</p>
                        <p>百种精彩话题, &nbsp;总有属于你的独特</p>
                    </div>
                    <div className="class-link">
                        <div className="link-title">立刻加入我们吧</div>
                        <div className="content-list">
                            <a href="https://h5.youzan.com/v2/goods/1y44iz9a3zgsa">
                                <div className="class-lesson-img">
<<<<<<< HEAD
                                    <img src={QiniuDomain + "/banner_buzz_youzan_2.jpg"} alt=""/>
=======
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/banner_buzz_youzan_2.jpg" alt=""/>
>>>>>>> master
                                </div>
                                <div className="class-lesson-info">
                                    <div className="lessons-title">标准学习包</div>
                                    <div className="lessons-price">
                                        <div className="price">280</div>
                                        <div className="yuan">元</div>
                                        <div className="discount">4课时</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default videoPlay;