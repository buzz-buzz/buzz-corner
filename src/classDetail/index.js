import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import ServiceProxy from '../service-proxy';
import CurrentUser from "../membership/user";
import {MemberType} from "../membership/member-type";
import TimeHelper from "../common/timeHelper";
import Practice from "./practice";
import Track from "../common/track";
import RecordingModal from "../common/commonComponent/modalRecording/index";
import LoadingModal from '../common/commonComponent/loadingModal';
import ClassPartners from './classPartnersAvatars';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import ClassBeginModal from '../common/commonComponent/modalClassBegin';
import ModalClassPractiseWord from '../common/commonComponent/modalClassPractiseWord';
import ClassInfoTitle from './classInfoTitle';
import ErrorHanlder from '../common/error-handler';
import ClassAd from './classAd';
import Resources from '../resources';
import {Button, Form} from "semantic-ui-react";
import Back from '../common/back';
import Client from "../common/client";
import moment from 'moment';
import './index.css';

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
                    let end_left_new = this.state.end_left - 1;
                    if (left_new > 300) {
                        this.setState({left: left_new, end_left: end_left_new});
                    } else if (left_new <= 300 && end_left_new > 0) {
                        this.setState({
                            classBeginNow: true,
                            end_left: end_left_new,
                            left: left_new
                        });
                    } else if (end_left_new <= 0) {
                        this.setState({
                            classBeginNow: false,
                            end_left: end_left_new,
                            left: left_new,
                            classEndNow: true
                        });
                        clearInterval(this.state.interval);
                    }
                }
            }, 1000),
            class_content_tab: '',
            classBeginNow: false,
            classEndNow: false
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
        this.closePractiseWord = this.closePractiseWord.bind(this);
        this.openPractiseWord = this.openPractiseWord.bind(this);
    }

    closeClassBegin() {
        this.setState({classBeginModal: false});
    }

    back() {
        if (this.props.location.query.back) {
            browserHistory.push('/' + this.props.location.query.back);
        } else {
            Back.back();
        }
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

    checkOfficeName(item){
        let rex = /\.(?:doc|docx|docm|dotx|dotm|xlsx|xlsm|xltx|xltm|xlsb|xlam|pptx|pptm|potx|ppt|potm|ppt|pdf)$/i;
        return rex.test(item);
    }

    fileLink(item) {
        if (!this.checkOfficeName(item)) {
            return item;
        } else if(item.indexOf('.pdf') > -1){
            return 'https://buzz-corner.user.resource.buzzbuzzenglish.com/pdf/web/viewer.html?file=' + encodeURIComponent(item);
        } else{
            return 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(item);
        }
    }

    lookFile(e, item) {
        if (item.indexOf('.pdf') <= -1) {
            window.location.href = item;
        } else {
            window.location.href = 'https://buzz-corner.user.resource.buzzbuzzenglish.com/pdf/web/viewer.html?file=' + encodeURIComponent(item);
        }
    }

    closePractiseWord() {
        this.setState({practiseModal: false});
    }

    openPractiseWord(event, i) {
        if (i !== undefined && this.state.chats.length && this.state.chats[i]) {
            let chat = this.state.chats[i].replace('｜', '|'),
                chat_word = '';

            if (chat.indexOf('|') > -1 && chat.split('|').length >= 3) {
                chat_word = chat.split('|')[2];
            }

            if (chat_word) {
                this.setState({
                    practiseModal: true,
                    practiseWord: chat_word || 'Too easy...'
                });
            }
        } else {
            this.setState({practiseModal: true, practiseWord: 'Too easy...'});
        }
    }

    sendTrack(e, eventInfo) {
        Track.event('课程详情_' + eventInfo);
    }

    handleClassInfoData(classInfo) {
        let dateClone = new Date(classInfo.start_time);
        classInfo.show_date = moment(dateClone).format("dddd, MMMM Do YYYY");
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

    async checkStatusAndTime() {
        if (this.state.classBeginNow && !this.state.classEndNow) {
            Track.event('课程详情_进入课程点击');

            this.showZoom();
        } else {
            if (this.state.classEndNow) {
                Track.event('课程详情_课后评价点击');

                if (this.state.role === MemberType.Student) {
                    //get result
                    let feed_back = await  ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.user_id}/evaluate/${this.state.class_info.companions}`
                        }
                    });

                    if (feed_back && feed_back.length && feed_back[0] && feed_back[0].score) {
                        browserHistory.push(`/evaluation/${this.state.class_info.companions}/${this.state.user_id}/${this.state.class_id}`);
                    }else{
                        browserHistory.push(`/class/evaluation/${this.state.class_info.companions}/${this.state.class_id}`);
                    }
                } else if (this.state.role === MemberType.Companion) {
                    browserHistory.push(`/class/foreign/${this.state.class_id}`);
                }
            }
        }
    }

    showZoom() {
        if (this.state.class_info.room_url) {
            let zoom_number = this.state.class_info.room_url.split('/')[this.state.class_info.room_url.split('/').length - 1] || '';

            window.location.href = `/zoom-join?zoom_number=${zoom_number}&user_name=${this.state.user_name}
            &zc=${this.state.class_info.zc || '0'}&user_id=${this.state.user_id}&class_id=${this.state.class_id}`;
        } else {
            alert('缺少Zoom教室链接');
        }
    }

    componentWillUnmount() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
    }

    getClassApiUri(user_id) {
        return this.state.class_id !== 'rookie' && this.state.class_id !== 'observation' ?
            `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
            :
            `{config.endPoints.buzzService}/api/v1/class-schedule/${this.state.class_id}?user_id=${user_id}`
    }

    async componentWillMount() {
        try {
            //如果是tablet 并且不在微信中  跳转至https
            if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0 && window.location.host !== 'localhost') {
                window.location.href = window.location.href.replace('http', 'https');
            }

            Track.event('课程详情_课程详情页面');

            this.setState({loadingModal: true});

            let profile = await CurrentUser.getProfile();

            let class_info = this.handleClassInfoData((await ServiceProxy.proxyTo({
                body: {
                    uri: this.getClassApiUri(profile.user_id)
                }
            }))[0]), studentsList = [];

            for (let i in class_info.students) {
                studentsList.push(class_info.students[i].id);
            }

            //if User is not in this class
            if (class_info.companions && class_info.students && class_info.companions !== (profile.user_id + '')
                && studentsList.indexOf(profile.user_id + '') <= -1
                && (!class_info.subscribers || (class_info.subscribers.split(',').indexOf(profile.user_id + '') === -1))
            ) {
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

            let companion_country = '';
            if (class_info.companions) {
                class_info.companions = class_info.companions.split(',')[0];

                companion_country = (await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/users/${class_info.companions}?t=${new Date().getTime()}`
                        }
                    })).country || 'united states';
                class_info.companion_country = companion_country;
                class_info.class_status_show_word = TimeHelper.timeDiff(new Date(class_info.start_time), new Date(class_info.end_time), new Date(class_info.CURRENT_TIMESTAMP), window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US');
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
                chats: class_content.exercises ? class_content.exercises.filter(item => {
                        return !!item;
                    }) : [],
                loadingModal: false,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date(),
                role: class_info.companions.indexOf(profile.user_id) > -1 ? MemberType.Companion : MemberType.Student,
                left: Math.floor((new Date(class_info.start_time).getTime() - new Date(class_info.CURRENT_TIMESTAMP).getTime()) / 1000),
                end_left: Math.floor((new Date(class_info.end_time).getTime() - new Date(class_info.CURRENT_TIMESTAMP).getTime()) / 1000),
                classBeginNow: Math.floor((new Date(class_info.start_time).getTime() - new Date(class_info.CURRENT_TIMESTAMP).getTime()) / 1000) <= 300 && Math.floor((new Date(class_info.end_time).getTime() - new Date(class_info.CURRENT_TIMESTAMP).getTime()) / 1000) > 0,
                classEndNow: Math.floor((new Date(class_info.end_time).getTime() - new Date(class_info.CURRENT_TIMESTAMP).getTime()) / 1000) <= 0,
                classBeginModal: false,
                companion_country: companion_country,
                class_content_tab: profile.role === MemberType.Student && class_content.exercises && class_content.exercises.filter(item => {
                    return !!item;
                }).length ? 'practice' : 'class_file',
                class_content: class_content,
                user_name: profile.name || profile.wechat_name || profile.display_name || profile.facebook_name || 'BuzzBuzz',
                user_id: profile.user_id
            });
        }
        catch (ex) {
            ErrorHanlder.notify('错误_课程详情页面报错', ex);
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
                <HeaderWithBack goBack={this.back}
                                title={Resources.getInstance().classDetailTitle}/>
                <ModalClassPractiseWord modal={this.state.practiseModal}
                                        closeModal={this.closePractiseWord}
                                        title="你可以说"
                                        content={this.state.practiseWord}
                                        btnText="我知道啦"/>
                <div className="class-detail-info">
                    <ClassInfoTitle course_info={this.state.class_info} onAvatarClick={this.companionCenter}
                                    companion_country={this.state.companion_country}
                    />
                    <ClassPartners student_avatars={this.state.student_avatars} sendTrack={this.sendTrack}/>
                    <ClassAd id={this.state.class_id} content={this.state.class_content} role={this.state.role}/>
                </div>
                <div className="class-detail-practice">
                    {
                        this.state.role === MemberType.Student &&
                        <div>
                            <div className="class-detail-tab">
                                <div className={this.state.class_content_tab === 'practice' ? "active" : ""}
                                     onClick={this.classContentOne}
                                     style={this.state.chats && this.state.chats.length ? {} : {display: 'none'}}
                                >
                                    {Resources.getInstance().classDetailBeforeClassExercise}
                                </div>
                                <div className={this.state.class_content_tab === 'class_file' ? "active" : ""}
                                     onClick={this.classContentTwo}
                                     style={this.state.class_content && (this.state.class_content.student_textbook || this.state.class_content.tutor_textbook) ? {} : {display: 'none'}}
                                >
                                    {Resources.getInstance().classDetailBeforeClassContent}
                                </div>
                            </div>
                            <div className="line-middle"></div>
                        </div>
                    }
                    {
                        this.state.role === MemberType.Companion &&
                        <div>
                            <div className="class-detail-tab">
                                <div
                                    className={this.state.class_content_tab === 'class_file' ? "active" : ""}
                                >{Resources.getInstance().classDetailBeforeClassContent}</div>
                            </div>
                            <div className="line-middle"></div>
                        </div>
                    }
                    {
                        this.state.role === MemberType.Student && this.state.class_content_tab === 'practice' &&
                        this.state.chats && this.state.chats.length > 0 &&
                        <Practice chats={this.state.chats.filter(c => c !== '')}
                                  recordingChanged={this.recordingChanged}
                                  ref={p => this.practice = p}
                                  openPractiseWord={this.openPractiseWord}
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
                                    return <a
                                        className="class_content_file_item"
                                        key={index}
                                        href={this.fileLink(item)}
                                        target="_blank"
                                        rel="noopener noreferrer">
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
                <ClassBeginModal modal={this.state.classBeginModal}
                                 closeModal={this.closeClassBegin}
                                 title={Resources.getInstance().classBeginModalTitle}
                                 content1={Resources.getInstance().classBeginModalContent1}
                                 content2={Resources.getInstance().classBeginModalContent2}
                                 begin={this.checkStatusAndTime}
                                 btnWord={Resources.getInstance().classBeginModalBtn}/>
                {
                    this.state.role === MemberType.Student &&
                    <RecordingModal open={this.state.recording}
                                    onClose={this.cancelRecording}
                                    onOK={this.finishRecording}
                                    timeout={this.finishRecording}/>
                }
                <div className="class-detail-button"
                     style={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 >= 60 * 24
                     || !this.state.class_info.room_url
                     || ((this.state.class_id === 'rookie' || this.state.class_info.evaluate_disabled) && new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP) <= 0)
                         ? {display: 'none'} : {}}>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button}
                                    onClick={this.checkStatusAndTime}
                                    content={this.state.classBeginNow || this.state.classEndNow ? (this.state.classBeginNow && !this.state.classEndNow ? Resources.getInstance().goToClass : Resources.getInstance().goToAssess) : (this.getCountDown() === '' ? '' : Resources.getInstance().classDetailLeft + '  ' + this.getCountDown())}
                                    style={this.state.classBeginNow || this.state.classEndNow ? {
                                            color: 'white',
                                            background: '#ffd200',
                                            borderRadius: '0',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            letterSpacing: '1px',
                                            boxShadow: '0 -2px 10px 0 rgba(237, 174, 0, 0.4)'
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
                <div className="offset-footer"
                     style={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 >= 60 * 24
                     || !this.state.class_info.room_url
                     || ((this.state.class_id === 'rookie' || this.state.class_info.evaluate_disabled) && new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP) <= 0)
                         ? {display: 'none'} : {}}></div>
            </div>
        );
    }
}

export default classDetail;
