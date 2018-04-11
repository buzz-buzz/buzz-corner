import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import ServiceProxy from '../service-proxy';
import CurrentUser from "../membership/user";
import {MemberType} from "../membership/member-type";
import './index.css';
import TimeHelper from "../common/timeHelper";
import Practice from "./practice";
import Track from "../common/track";
import RecordingModal from "../common/commonComponent/modalRecording/index";
import LoadingModal from '../common/commonComponent/loadingModal';
import Resources from '../resources';
import {Button, Form} from "semantic-ui-react";

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
                show_time: '00:00 - 00:00'
            },
            companion_name: '',
            companion_avatar: '',
            student_avatars: [],
            class_status_show_style: '',
            class_status_show_word: '',
            recording: false,
            CURRENT_TIMESTAMP: new Date(),
            role: ''
        };

        this.back = this.back.bind(this);
        this.getCompanionInfo = this.getCompanionInfo.bind(this);
        this.checkStatusAndTime = this.checkStatusAndTime.bind(this);
        this.recordingChanged = this.recordingChanged.bind(this);
        this.cancelRecording = this.cancelRecording.bind(this);
        this.finishRecording = this.finishRecording.bind(this);
        this.sendTrack = this.sendTrack.bind(this);
    }

    back() {
        window.history.back();
        browserHistory.push('/');
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
            + (new Date(classInfo.end_time).getHours() > 9 ? new Date(classInfo.end_time).getHours() : '0' + new Date(classInfo.end_time).getHours() ) + ' : '
            + (new Date(classInfo.end_time).getMinutes() > 9 ? new Date(classInfo.end_time).getMinutes() : '0' + new Date(classInfo.end_time).getMinutes() );
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

    getCompanionInfo(userId) {

    }

    checkStatusAndTime() {
        if ((new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 15 && (new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP)) > 0) {
            this.showZoom();
        } else {
            if(this.state.role === MemberType.Student){
                browserHistory.push(`/class/evaluation/${this.state.class_info.companions}/${this.state.class_id}`);
            }else if(this.state.role === MemberType.Companion){
                browserHistory.push(`/class/foreign/${this.state.class_id}`);
            }
        }
    }

    showZoom() {
        window.location.href = this.state.class_info.room_url;
    }

    async componentDidMount() {
        try {
            Track.event('课程详情_课程详情页面');

            this.setState({loadingModal: true});

            let profile = await CurrentUser.getProfile(true);

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            let studentsList = [];

            for(let i in class_info.students){
                studentsList.push(class_info.students[i].id);
            }

            let avatars = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/byUserIdlist`,
                    json: { userIdList: studentsList},
                    method: 'POST'
                }
            }) || [];

            this.setState({
                class_info: class_info,
                student_avatars: avatars,
                companion_name: class_info.companion_name || '',
                companion_avatar: class_info.companion_avatar || '',
                class_status_show_style: TimeHelper.timeDiffStyle(new Date(class_info.start_time), new Date(class_info.end_time), new Date(class_info.CURRENT_TIMESTAMP)),
                class_status_show_word: TimeHelper.timeDiff(new Date(class_info.start_time), new Date(class_info.end_time), new Date(class_info.CURRENT_TIMESTAMP), window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US'),
                chats: class_info.exercises ? JSON.parse(class_info.exercises) : [],
                loadingModal: false,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP|| new Date(),
                role: profile.role || ''
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
        }
    }

    finishRecording() {
        Track.event('课程详情_点击完成录音');

        console.log('end reply');
        if (this.practice) {
            this.practice.endReply();
        }

    }

    render() {
        return (
            <div className="class-detail">
                <div className="class-detail-header">
                    <div className="arrow">
                        <img style={{width: '20px'}}
                             src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""
                             onClick={this.back}/>
                    </div>
                    <div className="class-detail-title">课程详情</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar">
                            <img onClick={event => this.sendTrack(event, '外籍头像点击')}
                                 src={this.state.companion_avatar || "//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                 alt=""/>
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
                    <div className="class-partners-avatar">
                        {
                            this.state.student_avatars.length > 0 &&
                            this.state.student_avatars.map((item, index) => {
                                return <Link key={index} to="" onClick={event => this.sendTrack(event, '中方头像点击')}>
                                    <img
                                        src={item.avatar || "https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                        alt=""/>
                                </Link>
                            })
                        }
                    </div>
                </div>
                <div className="class-detail-practice">
                    {
                        this.state.role === MemberType.Student ?
                            <div className="class-detail-notice">
                                <p>1.在课程开始前, 你可以进行话题的模拟对话训练帮助你为今天的话题做准备。</p>
                                <p onClick={event => this.sendTrack(event, '下载ZOOM安装')}>2.下载课程必备软件ZOOM，点击<a
                                    href="http://wap.zoomcloud.cn/home/download" style={{color: '#f7b52a'}}>下载安装</a>
                                    。</p>
                            </div> :
                            <div className="class-detail-notice">
                                <p>1.Please install ZOOM before your class begins.</p>
                                <p onClick={event => this.sendTrack(event, '下载ZOOM安装')}>2.Click to <a
                                    href="http://wap.zoomcloud.cn/home/download" style={{color: '#f7b52a'}}> Install</a>
                                    。</p>
                            </div>
                    }
                    {
                        this.state.role === MemberType.Student &&
                        <Practice chats={this.state.chats} recordingChanged={this.recordingChanged}
                                  ref={p => this.practice = p}
                                  avatars={["//p579tk2n2.bkt.clouddn.com/buzz-teacher.png", "//p579tk2n2.bkt.clouddn.com/buzz-teacher.png"]}/>
                    }
                    <div className="class-detail-button">
                        <Form.Group widths='equal'
                                    style={this.state.class_info.status && this.state.class_info.status !== 'cancelled' && (new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 15 ? {} : {display: 'none'}}>
                            <Form.Field control={Button} onClick={this.checkStatusAndTime}
                                        content={(new Date(this.state.class_info.start_time) - new Date(this.state.CURRENT_TIMESTAMP)) / 60000 <= 15 && (new Date(this.state.class_info.end_time) - new Date(this.state.CURRENT_TIMESTAMP)) > 0 ?  Resources.getInstance().goToClass :Resources.getInstance().goToAssess}/>
                        </Form.Group>
                    </div>
                </div>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                {
                    this.state.role === MemberType.Student &&
                    <RecordingModal open={this.state.recording} onClose={this.cancelRecording}
                                    onOK={this.finishRecording} timeout={this.finishRecording}/>
                }
            </div>
        );
    }
}

export default classDetail;
