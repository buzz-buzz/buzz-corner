import React from 'react';
import moment from 'moment';
import {Flag} from "semantic-ui-react";
import {browserHistory} from 'react-router';
import Avatar from '../../common/commonComponent/avatar';
import ClassEndTime from "../../classDetail/class-end-time";
import Track from "../../common/track";
import './index.css';

export default class CourseInfo extends React.Component{
    constructor(){
        super();

        this.state = {
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [],
                status: "",
                show_date: 'tomorrow, is coming',
                companions: ''
            }
        };
        this.companionCenter = this.companionCenter.bind(this);
    }

    companionCenter() {
        Track.event('课程详情_外籍头像点击');

        if (this.state.class_info.companions) {
            browserHistory.push('/user/' + this.state.class_info.companions);
        }
    }

    render(){
        return (
            <div className="course-info" onClick={this.props.enterDetail}>
                {
                    1 === 1 ?
                        <div className="am-pm-show">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_sun.svg" alt=""/>
                            <div></div>
                        </div> :
                        <div className="am-pm-show">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_moon.svg" alt=""/>
                            <div style={{background: '#d0d6db'}}></div>
                        </div>
                }
                <div className="booking-item-avatar" onClick={this.companionCenter}>
                    <Avatar src="//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"/>
                    <Flag name='united states'/>
                </div>
                <div className="booking-item-info">
                    <p className="your-name">Buzz</p>
                    <p className="class-topic">No names</p>
                    <p className="class-date">{this.state.class_info.show_date}</p>
                    <p className="class-time">{moment(this.state.class_info.start_time).format('HH:mm')} - <ClassEndTime
                        classInfo={this.state.class_info}/></p>
                </div>
                <div className="booking-item-status">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_start.svg" alt=""/>
                    推荐
                </div>
            </div>
        )
    }
}