import React from 'react';
import Button50Px from '../../common/commonComponent/submitButton50px';
import './index.css';

export default class CourseDetail extends React.Component{
    constructor(){
        super();

        this.state = {
            course_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [],
                status: "",
                show_date: 'tomorrow, is coming',
                companions: ''
            }
        };

        this.joinCourse = this.joinCourse.bind(this);
    }

    joinCourse(){

    }

    componentWillMount(){

    }

    render(){
        return (
            <div className="course-detail">
                <div className="class-info">
                   <div className="avatar-new">
                       <img src="//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg" alt=""/>
                       <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_bg.svg" alt="" className="bg"/>
                   </div>
                    <div className="course-content">
                        <div className="name">SHANNON</div>
                        <div className="topic">Relationships</div>
                        <div className="date">Sat July 7th 2018</div>
                        <div className="time">19:00 - 19:25</div>
                    </div>
                    <div className="course-status">
                        今天开始
                    </div>
                </div>
                <div className="course-intro"></div>
                <div className="course-join">
                    <div className="time-left">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_time.svg" alt=""/>
                        <div className="time">
                            <div className="word">距离开始</div>
                            <div className="time-down">05d 06h 40m</div>
                        </div>
                    </div>
                    <div className="btn">
                        <Button50Px disabled={false} submit={this.joinCourse} text="报名加入"/>
                    </div>
                </div>
            </div>
        )
    }
}