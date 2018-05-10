import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import QiniuDomain from '../common/systemData/qiniuUrl';
import './tablet.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

class VideoPlayTablet extends Component {
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
            <div className="video-play-tablet">
                <TabletHeader />
                <div className="video-content">
                    <div className="tablet-video-player">
                        <EmbedVideo sources={[QiniuDomain + '/Training%20video_3min.mp4']}
                                    poster={QiniuDomain + '/banner-inland.png'} />
                        <div className="video-btn" id="icon-play-video">
                            <img src={QiniuDomain + "/icon_play.png"} alt=""/>
                        </div>
                    </div>
                    <div className="tablet-video-word">
                        <div className="ad-word">
                            <p>英美少年学伴, &nbsp;最自然的交流状态</p>
                            <p>哈佛权威研发, &nbsp;有效提高英语口语</p>
                            <p>百种精彩话题, &nbsp;总有属于你的独特</p>
                        </div>
                        <div className="class-link">
                            <div className="link-title" style={{fontSize: '17px', color: '#000'}}>立刻加入我们吧</div>
                            <div className="content-list">
                                <a href="https://h5.youzan.com/v2/goods/1y44iz9a3zgsa">
                                    <div className="class-lesson-img">
                                        <img src={QiniuDomain + "/banner_buzz_youzan_2.jpg"} alt=""/>
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
                <TabletFooter />
            </div>
        );
    }
}

export default VideoPlayTablet;