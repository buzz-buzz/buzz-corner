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
                        <EmbedVideo sources={[QiniuDomain + '/interviewcollection....mp4']}
                                    poster={QiniuDomain + '/banner-inland.png'} />
                        <div className="video-btn" id="icon-play-video">
                            <img src={QiniuDomain + "/icon_play.png"} alt=""/>
                        </div>
                    </div>
                </div>
                <TabletFooter />
            </div>
        );
    }
}

export default VideoPlayTablet;