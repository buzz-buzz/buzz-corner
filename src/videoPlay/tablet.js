import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import QiniuDomain from '../common/systemData/qiniuUrl';
import {browserHistory} from 'react-router';
import './index.css';
import TabletHeader from '../layout/tabletHeader';
import TabletFooter from '../layout/tabletFooter';

class VideoPlayTablet extends Component {
    render() {
        return (
            <div className="video-play-tablet">
                <TabletHeader />
                <TabletFooter />
            </div>
        );
    }
}

export default VideoPlayTablet;