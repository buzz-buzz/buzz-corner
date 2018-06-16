import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import ServiceProxy from '../service-proxy';
import CurrentUser from "../membership/user";
import {MemberType} from "../membership/member-type";
import './index.css';
import TimeHelper from "../common/timeHelper";
import Practice from "./practice";
import Track from "../common/track";
import RecordingModal from "../common/commonComponent/modalRecording/index";
import LoadingModal from '../common/commonComponent/loadingModal';
import ClassPartners from './classPartnersAvatars';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import ClassBeginModal from '../common/commonComponent/modalClassBegin';
import Avatar from '../common/commonComponent/avatar';
import ClassAd from './classAd';
import Resources from '../resources';
import {Button, Form, Flag} from "semantic-ui-react";
import Client from "../common/client";

class classDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [],
                status: "",
                show_date: 'tomorrow, is coming',
                show_time: '00:00 - 00:00',
                companions: ''
            },
            companion_name: '',
            companion_avatar: '',
            student_avatars: [],
            class_status_show_style: '',
            class_status_show_word: '',
            recording: false,
            CURRENT_TIMESTAMP: new Date(),
            role: '',
            left: '',
            classBeginModal: false,
            companion_country: '',
            interval: setInterval(() => {
                if (this.state.left !== '' && this.state.left !== null && this.state.left !== undefined && !isNaN(this.state.left)) {
                    let left_new = this.state.left - 1;
                    this.setState({left: left_new});
                }
            }, 1000),
            class_content_tab: ''
        };

        this.back = this.back.bind(this);
        this.checkStatusAndTime = this.checkStatusAndTime.bind(this);
        this.recordingChanged = this.recordingChanged.bind(this);
        this.cancelRecording = this.cancelRecording.bind(this);
        this.finishRecording = this.finishRecording.bind(this);
        this.sendTrack = this.sendTrack.bind(this);
        this.closeClassBegin = this.closeClassBegin.bind(this);
        this.companionCenter = this.companionCenter.bind(this);
        this.classContentOne = this.classContentOne.bind(this);
        this.classContentTwo = this.classContentTwo.bind(this);
        this.lookFile = this.lookFile.bind(this);
    }

    closeClassBegin() {
        this.setState({classBeginModal: false});
    }

    back() {
        window.history.go(-1);
    }

    companionCenter() {
        Track.event('课程详情_外籍头像点击');

        if (this.state.class_info.companions) {
            browserHistory.push('/user/' + this.state.class_info.companions);
        }
    }

    classContentOne() {
        if (this.state.class_content_tab !== 'practice') {
            this.setState({class_content_tab: 'practice'});
        }
    }

    classContentTwo() {
        if (this.state.class_content_tab !== 'class_file') {
            this.setState({class_content_tab: 'class_file'});
        }
    }

    fileLink(item) {
        if (item.indexOf('.pdf') <= -1) {
            return item;
        } else {
            return 'https://buzz-corner.user.resource.buzzbuzzenglish.com/pdf/web/viewer.html?file=' + encodeURIComponent(item);
        }
    }

    lookFile(e, item) {
        if (item.indexOf('.pdf') <= -1) {
            window.location.href = item;
        } else {
            window.location.href = 'https://buzz-corner.user.resource.buzzbuzzenglish.com/pdf/web/viewer.html?file=' + encodeURIComponent(item);
        }
    }

    sendTrack(e, eventInfo) {
        Track.event('课程详情_' + eventInfo);
    }

    transformDay(day) {
        return TimeHelper.getWeekdayNameByIndex(day);
    }

    transformMonth(monthIndex) {
        return TimeHelper.getMonthNameByIndex(monthIndex);
    }

    handleClassInfoData(classInfo) {
        let dateClone = new Date(classInfo.start_time);
        classInfo.show_date = this.transformDay(dateClone.getDay()) + ', '
            + dateClone.getDate() + ' ' + this.transformMonth(dateClone.getMonth()) + ', ' + dateClone.getFullYear();
        classInfo.show_time = (dateClone.getHours() > 9 ? dateClone.getHours() : '0' + dateClone.getHours()) + ':'
            + (dateClone.getMinutes() > 9 ? dateClone.getMinutes() : '0' + dateClone.getMinutes()) + ' - '
            + (new Date(classInfo.end_time).getHours() > 9 ? new Date(classInfo.end_time).getHours() : '0' + new Date(classInfo.end_time).getHours()) + ' : '
            + (new Date(classInfo.end_time).getMinutes() > 9 ? new Date(classInfo.end_time).getMinutes() : '0' + new Date(classInfo.end_time).getMinutes());
        classInfo.companions = classInfo.companions ? classInfo.companions.split(',')[0] : '';

        let students = classInfo.students ? classInfo.students.split(',') : [];
        let newStudents = [];
        for (let i in students) {
            if (students[i]) {
                newStudents.push({
                    id: students[i]
                });
            }
        }
        classInfo.students = newStudents;

        return classInfo;
    }

    checkStatusAndTime() {
        if ((new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 15 && (new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP)) > 0) {
            Track.event('课程详情_进入课程点击');

            this.showZoom();
        } else {
            if (new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP) <= 0) {
                Track.event('课程详情_课后评价点击');

                if (this.state.role === MemberType.Student) {
                    browserHistory.push(`/class/evaluation/${this.state.class_info.companions}/${this.state.class_id}`);
                } else if (this.state.role === MemberType.Companion) {
                    browserHistory.push(`/class/foreign/${this.state.class_id}`);
                }
            }
        }
    }

    showZoom() {
        //URL Scheme
        const ua_info = require("ua_parser").userAgent(window.navigator.userAgent);
        let zoom_number = this.state.class_info.room_url.split('/')[this.state.class_info.room_url.split('/').length - 1] || '';

        if (/MicroMessenger/.test(navigator.userAgent)) {
            //提示在浏览器中打开
            browserHistory.push(`/zoom-join?zoom_number=${zoom_number}&user_name=${this.state.user_name}`);
        } else if (ua_info && ua_info.platform === 'mobile') {
            //window.location.href = this.state.class_info.room_url;
            window.location.href = `zoomus://zoom.us/join?confno=${zoom_number}&zc=0&uname=${this.state.user_name}`;
            setTimeout(function () {
                window.location.href = 'https://zoom.us/download';
            }, 2000);
        } else {
            window.location.href = `zoommtg://zoom.us/join?confno=${zoom_number}&zc=0&uname=${this.state.user_name}`;
            setTimeout(function () {
                window.location.href = 'https://zoom.us/download';
            }, 2000);
        }
    }

    componentWillUnmount() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }

        this.setState({loadingModal: false});
        this.setState = (state, callback) => {
            return;
        };
    }

    componentWillMount() {
        //如果是tablet 并且不在微信中  跳转至https
        if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0 && window.location.host !== 'localhost') {
            window.location.href = window.location.href.replace('http', 'https');
        }
    }

    async componentDidMount() {
        try {
            Track.event('课程详情_课程详情页面');

            this.setState({loadingModal: true});

            let profile = await CurrentUser.getProfile(true);

            let class_info = this.handleClassInfoData((await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            }))[0]), studentsList = [], classBegin = false;

            for (let i in class_info.students) {
                studentsList.push(class_info.students[i].id);
            }

            //if User is not in this class
            if (class_info.companions && class_info.students && class_info.companions !== (profile.user_id + '') && studentsList.indexOf(profile.user_id + '') <= -1) {
                alert(Resources.getInstance().classInfoNoAuth);
                browserHistory.push('/');
                return;
            }

            let avatars = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/byUserIdlist`,
                    json: {userIdList: studentsList},
                    method: 'POST'
                }
            }) || [];

            if ((new Date(class_info.start_time) - new Date(class_info.CURRENT_TIMESTAMP)) / 60000 < 0 && (new Date(class_info.end_time) - new Date(class_info.CURRENT_TIMESTAMP)) > 0) {
                classBegin = true;
            }

            let companion_country = '';
            if (class_info.companions) {
                class_info.companions = class_info.companions.split(',')[0];

                companion_country = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${class_info.companions}?t=${new Date().getTime()}`
                    }
                })).country || 'united states';
            }

            //get exercise
            let class_content = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/content/getByClassAndUser`,
                    qs: {
                        module: class_info.module || null,
                        topic: class_info.topic || null,
                        topic_level: class_info.topic_level || null,
                        level: profile.level || null
                    }
                }
            }) || {};

            this.setState({
                class_info: class_info,
                student_avatars: avatars,
                companion_name: class_info.companion_name || '',
                companion_avatar: class_info.companion_avatar || '',
                class_status_show_style: TimeHelper.timeDiffStyle(new Date(class_info.start_time), new Date(class_info.end_time), new Date(class_info.CURRENT_TIMESTAMP)),
                class_status_show_word: TimeHelper.timeDiff(new Date(class_info.start_time), new Date(class_info.end_time), new Date(class_info.CURRENT_TIMESTAMP), window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US'),
                chats: class_content.exercises ? class_content.exercises : [],
                loadingModal: false,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date(),
                role: profile.role || '',
                left: Math.floor((new Date(class_info.start_time).getTime() - new Date(class_info.CURRENT_TIMESTAMP).getTime()) / 1000),
                classBeginModal: classBegin,
                companion_country: companion_country,
                class_content_tab: profile.role === MemberType.Student ? 'practice' : 'class_file',
                class_content: class_content,
                user_name: profile.name || profile.wechat_name || profile.display_name || profile.facebook_name || 'BuzzBuzz'
            });
        }
        catch (ex) {
            console.log(ex.toString());
            Track.event('错误_课程详情页面报错', null, {"类型": "错误", "错误内容": ex.toString()});
            this.setState({loadingModal: false});
        }
    }

    recordingChanged(recordingStatus) {
        console.log('recording status = ', recordingStatus);
        this.setState({recording: recordingStatus})
    }

    cancelRecording() {
        Track.event('课程详情_点击取消录音');

        if (this.practice) {
            this.practice.cancelReply();
        } else if (this.tabletPractice) {
            this.tabletPractice.cancelReply();
        }
    }

    finishRecording() {
        Track.event('课程详情_点击完成录音');

        console.log('end reply');
        if (this.practice) {
            this.practice.endReply();
        } else if (this.tabletPractice) {
            this.tabletPractice.endReply();
        }

    }

    getCountDown() {
        let days, hours, minutes, seconds;
        days = Math.floor(this.state.left / (3600 * 24));
        hours = Math.floor((this.state.left - days * 3600 * 24) / 3600);
        minutes = Math.floor((this.state.left - days * 3600 * 24 - hours * 3600) / 60);
        seconds = Math.floor(this.state.left - days * 3600 * 24 - hours * 3600 - minutes * 60);

        if (days === 0) {
            return (hours > 9 ? hours : '0' + hours) + ':' + (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds);
        } else {
            return '';
        }
    }

    render() {
        return (
            <div className="class-detail">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().classDetailTitle}/>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar" onClick={this.companionCenter}>
                            <Avatar
                                src={this.state.companion_avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}/>
                            <Flag
                                name={this.state.companion_country ? this.state.companion_country.toLowerCase() : 'united states'}/>
                        </div>
                        <div className="booking-item-info">
                            <p className="your-name"
                               style={{fontWeight: 'bold', fontSize: '1.2em'}}>{this.state.companion_name || "Buzz"}</p>
                            <p className="class-topic" style={{
                                color: '#f7b52a',
                                margin: '.3em 0'
                            }}>{this.state.class_info.topic || this.state.class_info.name || 'No names'}</p>
                            <p className="class-date"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_date}</p>
                            <p className="class-time"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_time}</p>
                        </div>
                        <div className="booking-item-status">
                            <p style={{color: this.state.class_status_show_style}}>{this.state.class_status_show_word}</p>
                        </div>
                    </div>
                    <ClassPartners student_avatars={this.state.student_avatars} sendTrack={this.sendTrack}/>
                    <ClassAd/>
                </div>
                <div className="class-detail-practice"
                     style={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 60 * 24 ? {marginBottom: '50px'} : {}}>
                    {
                        this.state.role === MemberType.Student &&
                        <div>
                            <div className="class-detail-tab"
                                 style={this.state.class_content && (this.state.class_content.student_textbook || this.state.class_content.tutor_textbook) ? {} : {display: 'none'}}>
                                <div className={this.state.class_content_tab === 'practice' ? "active" : ""}
                                     onClick={this.classContentOne}>{Resources.getInstance().classDetailBeforeClassExercise}</div>
                                <div className={this.state.class_content_tab === 'class_file' ? "active" : ""}
                                     onClick={this.classContentTwo}>{Resources.getInstance().classDetailBeforeClassContent}</div>
                            </div>
                            <div className="line-middle"></div>
                        </div>
                    }
                    {
                        this.state.role === MemberType.Companion &&
                        <div>
                            <div className="class-detail-tab">
                                <div className={this.state.class_content_tab === 'class_file' ? "active" : ""}
                                >{Resources.getInstance().classDetailBeforeClassContent}</div>
                            </div>
                            <div className="line-middle"></div>
                        </div>
                    }
                    {
                        this.state.role === MemberType.Student && this.state.class_content_tab === 'practice' &&
                        <Practice chats={this.state.chats.filter(c => c !== '')}
                                  recordingChanged={this.recordingChanged}
                                  ref={p => this.practice = p}
                                  avatars={["//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg", "//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg"]}/>
                    }
                    {
                        this.state.class_content_tab === 'class_file' &&
                        <div className="class_content_file">
                            {
                                this.state.role === MemberType.Student &&
                                this.state.class_content && this.state.class_content.student_textbook &&
                                this.state.class_content.student_textbook.length &&
                                this.state.class_content.student_textbook.map((item, index) => {
                                    return <a className="class_content_file_item" key={index}
                                              href={this.fileLink(item)} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={item.indexOf('.pdf') <= -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_jpeg.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_PDF.svg"}
                                            alt=""/>
                                        <span
                                            className="file_name">{decodeURIComponent(item).split('/')[decodeURIComponent(item).split('/').length - 1].split('.')[0]}</span>
                                    </a>
                                })
                            }
                            {
                                this.state.role === MemberType.Companion &&
                                this.state.class_content && this.state.class_content.tutor_textbook &&
                                this.state.class_content.tutor_textbook.length &&
                                this.state.class_content.tutor_textbook.map((item, index) => {
                                    return <a className="class_content_file_item" key={index}
                                              href={this.fileLink(item)} rel="noopener noreferrer">
                                        <img
                                            src={item.indexOf('.pdf') <= -1 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_jpeg.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_PDF.svg"}
                                            alt=""/>
                                        <span
                                            className="file_name">{decodeURIComponent(item).split('/')[decodeURIComponent(item).split('/').length - 1].split('.')[0]}</span>
                                    </a>
                                })
                            }
                        </div>
                    }
                </div>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <ClassBeginModal modal={this.state.classBeginModal} closeModal={this.closeClassBegin}
                                 title={Resources.getInstance().classBeginModalTitle}
                                 content1={Resources.getInstance().classBeginModalContent1}
                                 content2={Resources.getInstance().classBeginModalContent2}
                                 begin={this.checkStatusAndTime} btnWord={Resources.getInstance().classBeginModalBtn}/>
                {
                    this.state.role === MemberType.Student &&
                    <RecordingModal open={this.state.recording} onClose={this.cancelRecording}
                                    onOK={this.finishRecording} timeout={this.finishRecording}/>
                }
                <div className="class-detail-button"
                     style={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 60 * 24 ? {} : {display: 'none'}}>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} onClick={this.checkStatusAndTime}
                                    content={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 15 ? ((new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP)) > 0 ? Resources.getInstance().goToClass : Resources.getInstance().goToAssess) : (this.getCountDown() === '' ? '' : Resources.getInstance().classDetailLeft + '  ' + this.getCountDown())}
                                    style={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 15 ? {
                                        color: 'white',
                                        background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))',
                                        borderRadius: '0',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        letterSpacing: '1px'
                                    } : {
                                        color: 'white',
                                        background: '#dfdfe4',
                                        borderRadius: '0',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        letterSpacing: '1px'
                                    }}
                        />
                    </Form.Group>
                </div>
            </div>
        );
    }
}

export default classDetail;
