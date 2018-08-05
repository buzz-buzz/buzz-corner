import React from 'react';
import CourseInfo from '../courseInfo';
import {browserHistory} from 'react-router';
import WhiteSpace from '../../common/commonComponent/whiteSpace';
import Track from "../../common/track";
import './index.css';

const styleEmpty = {
    display: 'flex',
    alignItems: 'center'
};

export default class CourseList extends React.Component {
    constructor() {
        super();

        this.goDetailCourse = this.goDetailCourse.bind(this);
    }

    goDetailCourse(event, course_id) {
        Track.event('点击淘课详情');

        browserHistory.push(`/course/${course_id}`);
    }

    componentWillMount() {
        //get course list from DB api
    }

    render() {
        return (
            <div className="course-list" style={this.props.data.length > 0 ? {} : styleEmpty}>
                {
                    this.props.data.length > 0 &&
                    <div className="course-title">淘你喜欢</div>
                }
                {
                    this.props.data.length > 0 &&
                        this.props.data.map((item, index)=><CourseInfo key={index} data={item} enterDetail={this.goDetailCourse}/>)
                }
                {
                    this.props.data.length === 0 &&
                    <WhiteSpace message="课程报名火爆/当前日期的课程都被抢完了！"
                                src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/bg_course_blank page.svg"
                                style={{background: 'white'}}
                    />
                }
                {
                    this.props.data.length > 0 &&
                    <div className="no-more">^_^ 没有更多了</div>
                }

            </div>
        )
    }
}