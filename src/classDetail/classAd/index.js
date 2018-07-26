import React from 'react';
import Resources from '../../resources';
import Client from "../../common/client";
import Track from "../../common/track";
import {MemberType} from "../../membership/member-type";
import './index.css';

export default class ClassAd extends React.Component {
    constructor(props) {
        super(props);

        this.showHtml = this.showHtml.bind(this);
    }

    sendTrack(e, eventInfo) {
        Track.event('课程详情_' + eventInfo);
    }

    showHtml(content) {
        return <div dangerouslySetInnerHTML={{__html: content}}></div>;
    }

    render() {
        return <div className="class-info-content">
            <div className="s-title">{Resources.getInstance().classDetailBeforeClassNotice}</div>
            <div className="line-middle" style={{marginBottom: '20px'}}></div>
            {
                this.props.id === 'rookie' ?
                    <div className="class-before-content">
                        <p onClick={event => this.sendTrack('下载ZOOM安装')}>1. 请尽快下载上课必备软件, 点击<a
                            href={ Client.getClient() === 'phone' ? "/zoom" : ( (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/zoomusInstaller.pkg" : ( (navigator.platform === "Win32") || (navigator.platform === "Windows") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/ZoomInstaller.exe" : "https://zoom.us/download") )}
                            style={{
                                color: '#f7b52a',
                                textDecoration: 'underline'
                            }}>下载安装</ a>。</p>
                        <p>2. 本次为免费的入门指导课, 将由你的班主任带你进行说明与指导。</p>
                    </div>
                    :
                    (
                        this.props.role === MemberType.Student ?
                            (this.props.content && this.props.content.student_notice_zh ?
                                this.showHtml( window.navigator.language.toLowerCase() === 'zh-cn' ? this.props.content.student_notice_zh : this.props.content.student_notice_) :
                                <div className="class-before-content">
                                    <p>{Resources.getInstance().classDetailBeforeWord1}</p>
                                    <p onClick={event => this.sendTrack('下载ZOOM安装')}>{Resources.getInstance().classDetailBeforeWord2}<a
                                        href={ Client.getClient() === 'phone' ? "/zoom" : ( (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/zoomusInstaller.pkg" : ( (navigator.platform === "Win32") || (navigator.platform === "Windows") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/ZoomInstaller.exe" : "https://zoom.us/download") )}
                                        style={{
                                            color: '#f7b52a',
                                            textDecoration: 'underline'
                                        }}>{Resources.getInstance().classDetailBeforeWord3}</ a>
                                        。</p>
                                </div>)
                            :
                            (this.props.content && this.props.content.companion_notice_en ?
                                this.showHtml( window.navigator.language.toLowerCase() === 'zh-cn' ? this.props.content.companion_notice_zh : this.props.content.companion_notice_en) :
                                <div className="class-before-content">
                                    <p>{Resources.getInstance().classDetailBeforeWord1}</p>
                                    <p onClick={event => this.sendTrack('下载ZOOM安装')}>{Resources.getInstance().classDetailBeforeWord2}<a
                                        href={ Client.getClient() === 'phone' ? "/zoom" : ( (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/zoomusInstaller.pkg" : ( (navigator.platform === "Win32") || (navigator.platform === "Windows") ? "https://cdn-corner.resource.buzzbuzzenglish.com/zoom/download/ZoomInstaller.exe" : "https://zoom.us/download") )}
                                        style={{
                                            color: '#f7b52a',
                                            textDecoration: 'underline'
                                        }}>{Resources.getInstance().classDetailBeforeWord3}</ a>
                                        。</p>
                                </div>)
                )
            }
        </div>
    }
}