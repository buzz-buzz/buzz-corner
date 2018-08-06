import React from 'react';
import CourseInfo from '../courseInfo';
import {browserHistory} from 'react-router';
import WhiteSpace from '../../common/commonComponent/whiteSpace';
import Track from "../../common/track";
import Resources from '../../resources';
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
        Track.event('淘课_列表点击');

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
                    <div className="course-title">{Resources.getInstance().taoCourseLike}</div>
                }
                {
                    this.props.data.length > 0 &&
                        this.props.data.map((item, index)=><CourseInfo key={index} data={item} enterDetail={this.goDetailCourse}/>)
                }
                {
                    this.props.data.length === 0 &&
                    <WhiteSpace message={Resources.getInstance().taoCourseNone}
                                src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/bg_course_blank page.svg"
                                style={{background: 'white'}}
                    />
                }
                {
                    this.props.data.length > 0 &&
                    <div className="no-more">^_^ {Resources.getInstance().taoCourseNomore}</div>
                }
                {
                    this.props.loading &&
                    <div className="loading-course">
                        <p>{Resources.getInstance().taoCourseLoading}</p>
                    </div>
                }
            </div>
        )
    }
}