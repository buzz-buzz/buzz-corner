import React from 'react';
import Resources from '../../resources';
import './index.css';

    export default class ClassAd extends React.Component {
    render() {
        return <div className="class-ad">
            <div className="s-title">{Resources.getInstance().classDetailBeforeClassNotice}</div>
            <div className="line-middle" style={{marginBottom: '20px'}}></div>
            <div className="ad-content">
                <p>{Resources.getInstance().classDetailBeforeWord1}</p>
                <p onClick={event => this.sendTrack('下载ZOOM安装')}>{Resources.getInstance().classDetailBeforeWord2}<a
                    href="http://wap.zoomcloud.cn/home/download"
                    style={{color: '#f7b52a', textDecoration: 'underline'}}>{Resources.getInstance().classDetailBeforeWord3}</a>
                    。</p>
            </div>
        </div>
    }
}