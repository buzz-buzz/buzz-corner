import React from 'react';
import Button50Px from '../../common/commonComponent/submitButton50px';
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
                            <div className="title">{ this.props.ok ? '参加成功' : '参加失败'}</div>
                            <div className="info">{ this.props.ok ? '该课程已加入你的学习列表' : this.props.err ||  '手慢了,该课程人数已满，请挑选其他班级'}</div>
                        </div>
                        <div className="btn">
                            <Button50Px disabled={false} text="我知道了" submit={this.props.ok ? this.props.joinSuccess : this.props.joinCancel} />
                        </div>
                    </div>
                }
                {
                    this.props.type === 'before' &&
                    <div className="modal-content">
                        <div className="status-info">
                            <div className="title">报名确认</div>
                            <div className="info-one">参加该课程需要扣除1个课时</div>
                            <div className="info-two">{ this.props.ok ? '淘课确认后则无法取消课程' : '您当前的课时数不足'}</div>
                        </div>
                        <div className="btn-two">
                            <div><Button50Px disabled={false} text={ this.props.ok ? "确认参加" : '咨询购买'}
                                             submit={this.props.ok ? this.props.joinClass : this.props.joinHelp}
                            /></div>
                            <div><Button50Px disabled={false} text="暂不参加" submit={this.props.joinCancel}
                                             style={{background: 'white', border: '1px solid #dfdfe4', color: '#666'}}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}