import React, {Component} from 'react';
import {Link} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './index.css';
import * as timeHelper from "../common/timeHelper";

class classEvaluationForeign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [1, 2, 3],
                status: 2,
                show_date: 'tomorrow, is coming',
                show_time: '00:00 - 00:00',
                companion_name: '',
                companion_avatar: ''
            },
            stars: 3
        };

        this.back = this.back.bind(this);
    }

    back() {
        window.history.back();
    }

    transformDay(day) {
        return timeHelper.getWeekdayNameByIndex(day);
    }

    transformMonth(month) {
        return timeHelper.getMonthNameByIndex(month);
    }

    handleClassInfoData(classInfo) {
        let dateClone = new Date(classInfo.start_time);
        classInfo.show_date = this.transformDay(dateClone.getDay()) + ', '
            + dateClone.getDate() + ' ' + this.transformMonth(dateClone.getMonth()) + ', ' + new Date(classInfo.end_time).getFullYear();
        classInfo.show_time = (dateClone.getHours() > 9 ? dateClone.getHours() : '0' + dateClone.getHours()) + ':'
            + (dateClone.getMinutes() > 9 ? dateClone.getMinutes() : '0' + dateClone.getMinutes()) + ' - '
            + (new Date(classInfo.end_time).getHours() > 9 ? new Date(classInfo.end_time).getHours() : '0' + new Date(classInfo.end_time).getHours() ) + ' : '
            + (new Date(classInfo.end_time).getMinutes() > 9 ? new Date(classInfo.end_time).getMinutes() : '0' + new Date(classInfo.end_time).getMinutes() );
        classInfo.companions = classInfo.companions.split(',')[0];

        return classInfo;
    }

    async componentDidMount() {
        try {
            document.getElementById('loadingModal').style.display = 'flex';

            let userId = await CurrentUser.getUserId();

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            //get student list,then get evaluation result.
            console.log(class_info);

            this.setState({
                userId: userId,
                class_info: class_info
            });

            if (document.getElementById('loadingModal')) {
                document.getElementById('loadingModal').style.display = 'none';
            }
        } catch (ex) {
            //login error
            console.log("evaluation:" + ex.toString());
            if (document.getElementById('loadingModal')) {
                document.getElementById('loadingModal').style.display = 'none';
            }
        }
    }

    render() {
        return (
            <div className="class-detail">
                <div className="class-detail-header">
                    <div className="arrow">
                        <img style={{width: '20px'}}
                             src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""
                             onClick={this.back}/>
                    </div>
                    <div className="class-detail-title">课后评价</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar">
                            <img
                                src={this.state.class_info.companion_avatar || "//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                alt=""/>
                        </div>
                        <div className="booking-item-info">
                            <p className="your-name"
                               style={{
                                   fontWeight: 'bold',
                                   fontSize: '1.2em'
                               }}>{this.state.class_info.companion_name || "Buzz"}</p>
                            <p className="class-topic" style={{
                                color: '#f7b52a',
                                margin: '.3em 0'
                            }}>{this.state.class_info.topic || 'Sing a New song'}</p>
                            <p className="class-date"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_date}</p>
                            <p className="class-time"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_time}</p>
                        </div>
                    </div>
                </div>
                <div className="class-detail-foreign-list" style={{position: 'relative'}}>
                    <div className="foreign-evaluation-title">
                        <p>对学生评价</p>
                    </div>
                    <div className="chinese-student-evaluation-list">
                        <Link to='/home'>
                            <div className="evaluation-avatar">
                                <img src="//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt="Avatar"/>
                            </div>
                            <div className="evaluation-content-show">
                                <div className="chinese-name">Advisor</div>
                                <div className="evaluation-result">
                                    <p>评价: </p>
                                    <div className="result-stars">
                                        <img
                                            src={this.state.stars >= 1 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                            onClick={this.changeStars} name="1" alt="star"/>
                                        <img
                                            src={this.state.stars >= 2 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                            onClick={this.changeStars} name="2" alt="star"/>
                                        <img
                                            src={this.state.stars >= 3 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                            onClick={this.changeStars} name="3" alt="star"/>
                                        <img
                                            src={this.state.stars >= 4 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                            onClick={this.changeStars} name="4" alt="star"/>
                                        <img
                                            src={this.state.stars >= 5 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                            onClick={this.changeStars} name="5" alt="star"/>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div id='loadingModal' style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 888,
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white'
                    }}>
                        <embed src="//p579tk2n2.bkt.clouddn.com/index.earth-globe-map-spinner.svg" width="240" height="80"
                               type="image/svg+xml"
                               pluginspage="http://www.adobe.com/svg/viewer/install/" />
                    </div>
                </div>
            </div>
        );
    }
}

export default classEvaluationForeign;