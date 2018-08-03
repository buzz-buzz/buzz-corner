import React from 'react';
import CourseInfo from '../courseInfo';
import {browserHistory} from 'react-router';
import WhiteSpace from '../../common/commonComponent/whiteSpace';
import './index.css';

const styleEmpty = {
    display: 'flex',
    alignItems: 'center'
};

export default class CourseList extends React.Component {
    constructor() {
        super();

        this.state = {
            courseList: []
        };

        this.goDetailCourse = this.goDetailCourse.bind(this);
    }

    goDetailCourse() {
        browserHistory.push('/course/1');
    }

    componentWillMount() {
        //get course list from DB api
    }

    render() {
        return (
            <div className="course-list" style={this.state.courseList.length > 0 ? {} : styleEmpty}>
                {
                    this.state.courseList.length > 0 &&
                    <div className="course-title">淘你喜欢</div>
                }
                {
                    this.state.courseList.length > 0 &&
                    <CourseInfo enterDetail={this.goDetailCourse}/>
                }
                {
                    this.state.courseList.length === 0 &&
                    <WhiteSpace message="课程报名火爆,  当前日期的课程都被抢完了！"
                                src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/bg_course_blank page.svg"
                                style={{background: 'white'}}
                    />
                }
                {
                    this.state.courseList.length > 0 &&
                    <div className="no-more">^_^ 没有更多了</div>
                }

            </div>
        )
    }
}