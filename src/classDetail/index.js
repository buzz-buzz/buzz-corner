import React, {Component} from 'react';
import {Form, Button, Segment} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import {Link} from "react-router";
import './index.css';

class classDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [1, 2, 3],
                status: 2,
                show_date: 'tomorrow, is coming',
                show_time: '00:00 - 00:00'
            },
            companion_name: '',
            companion_avatar: '',
            student_avatars: []
        };

        this.back = this.back.bind(this);
        this.goConsult = this.goConsult.bind(this);
        this.getAvatar = this.getAvatar.bind(this);
        this.getCompanionInfo = this.getCompanionInfo.bind(this);
        this.showZoom = this.showZoom.bind(this);
    }

    back() {
        window.history.back();
    }

    goConsult() {
        browserHistory.push('/consult');
    }

    transformDay(day) {
        switch (day) {
            case 1:
                return 'Monday';
                break;
            case 2:
                return 'Tuesday';
                break;
            case 3:
                return 'Wednesday';
                break;
            case 4:
                return 'Thursday';
                break;
            case 5:
                return 'Friday';
                break;
            case 6:
                return 'Saturday';
                break;
            case 0:
                return 'Sunday';
                break;
            default :
                break;
        }
    }

    transformMonth(day) {
        switch (day) {
            case 0:
                return 'January';
                break;
            case 1:
                return 'February';
                break;
            case 2:
                return 'March';
                break;
            case 3:
                return 'April';
                break;
            case 4:
                return 'May';
                break;
            case 5:
                return 'June';
                break;
            case 6:
                return 'July';
                break;
            case 7:
                return 'August';
                break;
            case 8:
                return 'September';
                break;
            case 9:
                return 'October';
                break;
            case 10:
                return 'November';
                break;
            case 11:
                return 'December';
                break;
            default :
                break;
        }
    }

    handleClassInfoData(classInfo) {
        let dateClone = new Date(classInfo.start_time);
        classInfo.show_date = this.transformDay(dateClone.getDay()) + ', '
            + dateClone.getDate() + ' ' + this.transformMonth(dateClone.getMonth());
        classInfo.show_time = dateClone.getHours() + ':' + dateClone.getMinutes() + ' - '
            + new Date(classInfo.end_time).getHours() + ' : ' + new Date(classInfo.end_time).getMinutes();
        classInfo.companions = classInfo.companions.split(',')[0];

        let students = classInfo.students.split(',');
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

    async getAvatar(userId) {
        let profile = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
            }
        });

        return profile.avatar;
    }

    showZoom(){
        console.log(this.state.class_info.room_url);

        window.location.href = this.state.class_info.room_url;
    }

    async componentDidMount() {
        try {
            document.getElementById('loadingModal').style.display = 'block';

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            for(let i in class_info.students){
                let profileUser = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${class_info.students[i].id}`
                    }
                });

                if(profileUser.avatar){
                    class_info.students[i].avatar = profileUser.avatar;
                }
            }

            console.log('time ....five minutes');
            console.log(new Date(class_info.start_time) - new Date());

            this.setState({
                class_info: class_info,
                student_avatars: class_info.students,
                companion_name: class_info.companion_name || '',
                companion_avatar: class_info.companion_avatar || ''
            });

        }
        catch (ex) {
            console.log('login failed: ' + ex.toString());
        } finally {
            //console.log('login failed');
            document.getElementById('loadingModal').style.display = 'none';
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
                            <img
                                src={this.state.companion_avatar || "//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                alt=""/>
                        </div>
                        <div className="booking-item-info">
                            <p className="your-name"
                               style={{fontWeight: 'bold', fontSize: '1.2em'}}>{this.state.companion_name || "Buzz"}</p>
                            <p className="class-topic" style={{
                                color: '#f7b52a',
                                margin: '.3em 0'
                            }}>{this.state.class_info.topic || 'Sing a New song'}</p>
                            <p className="class-date"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_date}</p>
                            <p className="class-time"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_time}</p>
                        </div>
                        <div className="booking-item-status">
                            <p style={this.state.class_info.status === 1 ? {color: 'red'} : (this.state.class_info.status === 2 ? {color: 'rgb(106, 225, 8)'} : {color: '#aaa'})}>{this.state.class_info.status === 1 ? '待确认' : (this.state.class_info.status === 2 ? '7天后开始' : '已结束')}</p>
                        </div>
                    </div>
                    <div className="class-partners-avatar">
                        {
                            this.state.student_avatars.length > 0 &&
                            this.state.student_avatars.map((item, index) => {
                                return <Link key={index} to="home">
                                    <img
                                        src={item.avatar || "https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                        alt=""/>
                                </Link>
                            })
                        }
                    </div>
                </div>
                <div className="class-detail-practice">
                    <div className="class-detail-notice">
                        <p>1.在课程开始前, 你可以进行话题的模拟对话训练帮助你为今天的话题做准备。</p>
                        <p>2.下载课程必备软件ZOOM，点击<a href="http://m.zoom.cn/plus/list.php?tid=3" style={{color: '#f7b52a'}}>下载安装</a>
                            。</p>
                    </div>
                    <div className="class-detail-practice-content">
                        <div className="practise-advisor">
                            <div className="advisor-avatar">
                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                            </div>
                            <div className="advisor-word">
                                <p>How are you?</p>
                            </div>
                        </div>
                        <div className="practise-student">
                            <div className="student-word">
                                <p>I'm fine, thanks. and you?</p>
                            </div>
                            <div className="student-avatar">
                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="class-detail-button"
                         style={this.state.class_info && this.state.class_info.start_time && (new Date(this.state.class_info.start_time) - new Date())/60000 <= 1500 && (new Date(this.state.class_info.start_time) - new Date())/60000 > -1500 ? {display: 'block'} : {display: 'none'}}>
                        <Form.Group widths='equal'>
                            <Form.Field control={Button} onClick={this.showZoom}
                                        content='进入课堂'/>
                        </Form.Group>
                    </div>
                </div>
                <Segment loading={true} id='loadingModal' style={{
                    border: 'none',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 888,
                    display: 'none'
                }}>
                </Segment>
            </div>
        );
    }
}

export default classDetail;