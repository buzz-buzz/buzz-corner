import React from 'react';
import Button50Px from '../../common/commonComponent/submitButton50px';
import CourseModal from '../courseModal';
import './index.css';

export default class CourseDetail extends React.Component {
    constructor() {
        super();

        this.state = {
            course_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [],
                status: "",
                show_date: 'tomorrow, is coming',
                companions: ''
            },
            courseModal: false
        };

        this.joinCourse = this.joinCourse.bind(this);
    }

    joinCourse() {

    }

    componentWillMount() {

    }

    render() {
        return (
            <div className="course-detail">
                <div className="class-info">
                    <div className="avatar-new">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg" alt=""/>
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_bg.svg" alt=""
                             className="bg"/>
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
                <div className="course-intro">
                    <div className="partners">
                        <div className="partner-item">
                            <div className="avatar">
                                <img src="" alt=""/>
                            </div>
                            <div className="name">
                                <span>TONY</span>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_men.svg" alt=""/>
                            </div>
                            <div className="status">
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_Check_finish.svg"
                                     alt=""/>
                            </div>
                        </div>
                        <div className="partner-item">
                            <div className="avatar">
                                <img src="" alt=""/>
                            </div>
                            <div className="name">
                                <span>TONY</span>
                                <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_women.svg" alt=""/>
                            </div>
                        </div>
                        <div className="partner-item">
                            <div className="avatar">
                                <img src="" alt=""/>
                            </div>
                            <div className="name">
                                <span style={{color: '#d0d6db', marginRight: '0'}}>暂无</span>
                            </div>
                        </div>
                    </div>
                    <div className="intro">
                        <div className="intro-title">课程简介</div>
                        <div className="intro-content">本课程为基础课程，
                            通过课程认识家庭、长辈、亲属、好友间的关系，
                            掌握如何描述与人之间的关系与相处
                        </div>
                    </div>
                </div>
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
                {
                    this.state.courseModal &&
                    <CourseModal type="result" ok={false}/>
                }
            </div>
        )
    }
}