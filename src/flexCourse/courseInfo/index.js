import React from 'react';
import moment from 'moment';
import {Flag} from "semantic-ui-react";
import Avatar from '../../common/commonComponent/avatar';
import Resources from '../../resources';
import ClassEndTime from "../../classDetail/class-end-time";
import './index.css';

export default class CourseInfo extends React.Component {
    render() {
        return (
            <div className="course-info" onClick={(event)=>this.props.enterDetail(event, this.props.data.class_id)}>
                {
                    parseInt(moment(this.props.data.start_time).format('HH'), 10) < 18 ?
                        <div className="am-pm-show">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_sun.svg" alt=""/>
                            <div></div>
                        </div> :
                        <div className="am-pm-show">
                            <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_moon.svg" alt=""/>
                            <div style={{background: '#d0d6db'}}></div>
                        </div>
                }
                <div className="booking-item-avatar">
                    <Avatar
                        src={ this.props.data.companion_avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}/>
                    <Flag name='united states'/>
                </div>
                <div className="booking-item-info">
                    <p className="your-name">{this.props.data.companion_name}</p>
                    <p className="class-topic">{this.props.data.topic}</p>
                    <p className="class-date">{moment(this.props.data.start_time).format("dddd, MMMM Do YYYY")}</p>
                    <p className="class-time">{moment(this.props.data.start_time).format('HH:mm')} - <ClassEndTime
                        classInfo={this.props.data}/></p>
                </div>
                {
                    this.props.data.recommend &&
                    <div className="booking-item-status">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_start.svg" alt=""/>
                        {Resources.getInstance().taoCourseRecommend}
                    </div>
                }
            </div>
        )
    }
}