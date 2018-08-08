import React from 'react';
import moment from 'moment';
import Resources from '../../resources';
import {Flag} from "semantic-ui-react";
import ClassEndTime from "../../classDetail/class-end-time";
import './index.css';

export default class ClassInfoTitle extends React.Component {
    render() {
        return (
            <div className="class-info">
                <div className="avatar-new">
                    <img
                        src={ this.props.course_info.companion_avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}
                        alt=""/>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_bg.svg" alt=""
                         className="bg"/>
                </div>
                <div className="course-content">
                    <div className="name">
                        {(this.props.course_info.companion_name || 'BuzzBuzz') + ' - '}
                        <Flag
                        name={this.props.companion_country ? this.props.companion_country.toLowerCase() : 'united states'}/>
                    </div>
                    <div className="topic">{this.props.course_info.topic || 'Relationships'}</div>
                    <div
                        className="date">{moment(this.props.course_info.start_time).format("dddd, MMMM Do YYYY")}</div>
                    <div className="time">{moment(this.props.course_info.start_time).format("HH:mm")} -
                        <ClassEndTime
                            classInfo={this.props.course_info}/></div>
                </div>
                {
                    this.props.course_info.class_status_show_word &&
                    <div className="course-status">{this.props.course_info.class_status_show_word}</div>
                }
                {
                    this.props.types && this.props.types.Fluency && this.props.sortNum && this.props.score ?
                        <div className="medal" onClick={this.props.openRating}>
                            <div className="medal-img">
                                <img
                                    src={this.props.sortNum === 1 ? "//cdn-corner.resource.buzzbuzzenglish.com/medal/number1.svg" : (
                                            this.props.sortNum === 2 ? "//cdn-corner.resource.buzzbuzzenglish.com/medal/number2.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/medal/number3.svg"
                                        )} alt=""/>
                            </div>
                            <span className="medal-score">{Resources.getInstance().evaluationTeacherScore}{this.props.score.toFixed(1)}</span>
                        </div> : ''
                }
            </div>
        )
    }
}