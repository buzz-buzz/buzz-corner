import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import './index.css';

class videoPlay extends Component {
    constructor() {
        super();

        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        window.history.go(-1);
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
                    <EmbedVideo sources={['//cdn-corner.resource.buzzbuzzenglish.com/interviewcollection....mp4']}
                                poster={'//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png'} />
                    <div className="video-btn" id="icon-play-video">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_play.png" alt=""/>
                    </div>
                </div>
                <div className="video-ad">
                    <div className="ad-word">
                        <p>英美少年学伴, &nbsp;最自然的交流状态</p>
                        <p>哈佛权威研发, &nbsp;有效提高英语口语</p>
                        <p>百种精彩话题, &nbsp;总有属于你的独特</p>
                    </div>
                    <div className="class-link">
                        <div className="link-title">立刻加入我们吧</div>
                        <div className="content-list">
                            <a href={"/" || "https://h5.youzan.com/v2/goods/1y44iz9a3zgsa"}>
                                <div className="class-lesson-img">
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/banner_buzz_youzan_2.jpg" alt=""/>
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