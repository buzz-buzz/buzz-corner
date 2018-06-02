import React from 'react';
import Resources from '../../resources';
import Client from "../../common/client";
import './index.css';

export default class ClassAd extends React.Component {
    render() {
        return <div className="class-info-content">
            <div className="s-title">{Resources.getInstance().classDetailBeforeClassNotice}</div>
            <div className="line-middle" style={{marginBottom: '20px'}}></div>
            <div className="class-before-content">
                <p>{Resources.getInstance().classDetailBeforeWord1}</p>
                <p onClick={event => this.sendTrack('下载ZOOM安装')}>{Resources.getInstance().classDetailBeforeWord2}<a
                    href={ Client.getClient() === 'phone' ? (  !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? "https://zoom.us/download" : "https://zoom.us/download" ): ( (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/zoomusInstaller.pkg" : ( (navigator.platform === "Win32") || (navigator.platform === "Windows") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/ZoomInstaller.exe" : "https://zoom.us/download") )}
                    style={{color: '#f7b52a', textDecoration: 'underline'}}>{Resources.getInstance().classDetailBeforeWord3}</ a>
                    。</p>
            </div>
        </div>
    }
}