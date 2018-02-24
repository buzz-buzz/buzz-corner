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
                status: 1
            }
        };

        this.back = this.back.bind(this);
    }

    back(){
        window.history.back();
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="class-detail">
                <div className="class-detail-header">
                    <div className="arrow">
                        <Icon name='arrow left' onClick={this.back} />
                    </div>
                    <div className="class-detail-title">课程详情</div>
                    <div className="class-order">
                        <p>预约需求</p>
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
                            <p style={this.state.class_info.status === 1 ? {color: 'red'} : (this.state.class_info.status === 2 ? {color: 'rgb(106, 225, 8)'} : {color: '#aaa'})}>{this.state.class_info.status === 1 ? '待确认' : (this.state.class_info.status === 2 ? '7天后' : '已结束')}</p>
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
                <div className="class-detail-practice"></div>
            </div>
        );
    }
}

export default classDetail;