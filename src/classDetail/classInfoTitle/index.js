import React from 'react';
import moment from 'moment';
import Resources from '../../resources';
import {Flag} from "semantic-ui-react";
import ClassEndTime from "../../classDetail/class-end-time";
import './index.css';

export default class ClassInfoTitle extends React.Component {
    colorHelper(color) {
        switch (color) {
            case 'rgb(246, 180, 12)' :
                return '#ffd200';
            case 'rgb(0, 216, 90)' :
                return 'rgb(0, 216, 90)';
            case 'rgb(102, 102, 102)' :
                return '#DFDFE4';
            default :
                break;
        }
    }

    render() {
        return (
            <div className={this.props.withHalfLine ? "class-info half-line" : "class-info"}
                 onClick={this.props.onClick ? this.props.onClick : function () {
                     }}>
                <div className="avatar-new" onClick={this.props.onAvatarClick ? this.props.onAvatarClick : function () {
                    }}>
                    <img
                        src={ this.props.course_info.companion_avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}
                        alt=""/>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_course_bg.svg" alt=""
                         className="bg"/>
                </div>
                <div className="course-content">
                    <div className="name">
                        <span>{this.props.course_info.companion_name || 'BuzzBuzz'}</span>&nbsp;&nbsp;
                        <Flag
                            name={this.props.companion_country || this.props.course_info.companion_country
                                ? (this.props.companion_country || this.props.course_info.companion_country).toLowerCase() : 'united states'}/>
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
                    <div className="course-status"
                         style={!this.props.index ? {backgroundColor: this.colorHelper(this.props.course_info.class_status_show_style)} : {backgroundColor: 'white'}}>
                        <span
                            style={!this.props.index ? {color: 'white'} : {color: this.props.course_info.class_status_show_style}}>{this.props.course_info.class_status_show_word}</span>
                    </div>
                }
                {
                    this.props.types && this.props.types.Fluency && this.props.sortNum && this.props.score ?
                        <div className="medal" onClick={this.props.openRating}>
                            <div className="medal-img">
                                <img
                                    src={this.props.sortNum === 1 ? "//cdn-corner.resource.buzzbuzzenglish.com/medal-1.svg" : (
                                            this.props.sortNum === 2 ? "//cdn-corner.resource.buzzbuzzenglish.com/medal-2.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/medal-3.svg"
                                        )} alt=""/>
                            </div>
                            <span
                                className="medal-score">{Resources.getInstance().evaluationTeacherScore}{this.props.score.toFixed(1)}</span>
                        </div> : ''
                }
            </div>
        )
    }
}