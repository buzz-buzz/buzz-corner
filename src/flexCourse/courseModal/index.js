import React from 'react';
import Button50Px from '../../common/commonComponent/submitButton50px';
import Resources from '../../resources';
import './index.css';

export default class CourseModal extends React.Component {
    render() {
        return (
            <div className="course-modal">
                {
                    this.props.type === 'result' &&
                    <div className="modal-content">
                        <div className="status-img">
                            <img
                                src={ this.props.ok ? "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_Check_finish.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Close.svg"}
                                alt=""/>
                        </div>
                        <div className="status-info">
                            <div className="title">{ this.props.ok ? Resources.getInstance().taoCourseSignSuccess : Resources.getInstance().taoCourseSignFailed}</div>
                            <div className="info">{ this.props.ok ? Resources.getInstance().taoCourseSuccessClass : this.props.err ||  Resources.getInstance().taoCourseSignSlowly}</div>
                        </div>
                        <div className="btn">
                            <Button50Px disabled={false} text={Resources.getInstance().taoCourseKnow} submit={this.props.ok ? this.props.joinSuccess : this.props.joinCancel} />
                        </div>
                    </div>
                }
                {
                    this.props.type === 'before' &&
                    <div className="modal-content">
                        <div className="status-info">
                            <div className="title">{Resources.getInstance().taoCourseSignSure}</div>
                            <div className="info-one">{Resources.getInstance().taoCourseSignInfo.replace('$', this.props.class_hours_need)}</div>
                            <div className="info-two">{ this.props.ok ? Resources.getInstance().taoCourseSignCancel : Resources.getInstance().taoCourseClassHoursNone}</div>
                        </div>
                        <div className="btn-two">
                            <div><Button50Px disabled={false} text={ this.props.ok ? Resources.getInstance().taoCourseSureSign : Resources.getInstance().taoCourseHelp}
                                             submit={this.props.ok ? this.props.joinClass : this.props.joinHelp}
                            /></div>
                            <div><Button50Px disabled={false} text={Resources.getInstance().taoCourseNotSign} submit={this.props.joinCancel}
                                             style={{background: 'white', border: '1px solid #dfdfe4', color: '#666', boxShadow: 'none'}}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}