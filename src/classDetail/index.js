import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './index.css';

class classDetail extends Component {
    constructor() {
        super();

        this.state = {
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [1, 2, 3],
                status: 2
            }
        };

        this.back = this.back.bind(this);
        this.goConsult = this.goConsult.bind(this);
    }

    back(){
        window.history.back();
    }

    goConsult(){
        browserHistory.push('/consult');
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="class-detail">
                <div className="class-detail-header">
                    <div className="arrow">
                        <img style={{width: '20px'}} src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt="" onClick={this.back} />
                    </div>
                    <div className="class-detail-title">课程详情</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar">
                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                        </div>
                        <div className="booking-item-info">
                            <p className="your-name" style={{fontWeight: 'bold', fontSize: '1.2em'}}>SEAN</p>
                            <p className="class-topic" style={{color: '#f7b52a', margin: '.3em 0'}}>Sing a New song</p>
                            <p className="class-date" style={{fontSize: '.8em', color: '#aaa'}}>Today, Friday 29 December</p>
                            <p className="class-time" style={{fontSize: '.8em', color: '#aaa'}}>11:00 - 12:00</p>
                        </div>
                        <div className="booking-item-status">
                            <p style={this.state.class_info.status === 1 ? {color: 'red'} : (this.state.class_info.status === 2 ? {color: 'rgb(106, 225, 8)'} : {color: '#aaa'})}>{this.state.class_info.status === 1 ? '待确认' : (this.state.class_info.status === 2 ? '7天后开始' : '已结束')}</p>
                        </div>
                    </div>
                    <div className="class-partners-avatar">
                        <div>
                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                        </div>
                        <div>
                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                        </div>
                        <div>
                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="class-detail-practice">
                    <div className="class-detail-notice">
                        <p>1.在课程开始前, 你可以进行话题的模拟对话训练帮助你为今天的话题做准备。</p>
                        <p>2.下载课程必备软件ZOOM，点击<a href="http://m.zoom.cn/plus/list.php?tid=3" style={{color: '#f7b52a'}}>下载安装</a> 。</p>
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
                    <div className="class-detail-button" style={this.state.class_info.status === 2 ? {} : {display: 'none'}}>
                        <Form.Group widths='equal'>
                            <Form.Field control={Button} onClick={this.signUp}
                                        content='进入课堂'/>
                        </Form.Group>
                    </div>
                </div>
            </div>
        );
    }
}

export default classDetail;