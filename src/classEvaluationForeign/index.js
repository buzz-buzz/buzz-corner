import React, {Component} from 'react';
import {Link} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import './index.css';
import TimeHelper from "../common/timeHelper";

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
            evaluation_list: [],
            CURRENT_TIMESTAMP: new Date()
        };

        this.back = this.back.bind(this);
    }

    back() {
        window.history.back();
    }

    transformDay(day) {
        return TimeHelper.getWeekdayNameByIndex(day);
    }

    transformMonth(month) {
        return TimeHelper.getMonthNameByIndex(month);
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
        classInfo.partners = classInfo.students.split(',');

        return classInfo;
    }

    async componentDidMount() {
        try {
            this.setState({loadingModal: true});

            let userId = await CurrentUser.getUserId();

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            console.log(class_info);

            //create a students evaluation list.
            let clonedEvaluationList = this.state.evaluation_list;

            if (class_info.companions && class_info.partners && class_info.partners.length > 0) {
                let evaluationResult = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/feedback/${this.state.class_id}`
                    }
                });

                if(evaluationResult && evaluationResult.userInfo && evaluationResult.userInfo.length > 0){
                    for(let i in evaluationResult.userInfo){
                        clonedEvaluationList.push({
                            url: '/class/evaluation/' + evaluationResult.userInfo[i].userId + '/' + this.state.class_id,
                            score: evaluationResult.userInfo[i].score || 0,
                            user_name: evaluationResult.userInfo[i].userName || 'Buzz',
                            avatar: evaluationResult.userInfo[i].avatar || '//p579tk2n2.bkt.clouddn.com/logo-image.svg'
                        });
                    }
                }
            }

            this.setState({
                userId: userId,
                class_info: class_info,
                loadingModal: false,
                evaluation_list: clonedEvaluationList,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date()
            });
        } catch (ex) {
            //login error
            console.log("evaluation:" + ex.toString());
            this.setState({loadingModal: false});
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
                    <div className="class-detail-title">{Resources.getInstance().evaluationWord}</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar">
                            <img
                                src={this.state.class_info.companion_avatar || "//p579tk2n2.bkt.clouddn.com/logo-image.svg"}
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
                        <p>{Resources.getInstance().evaluationForStudent}</p>
                    </div>
                    <div className="chinese-student-evaluation-list">
                        {this.state.evaluation_list && this.state.evaluation_list.length &&
                        this.state.evaluation_list.map((item, index) => {
                            return <Link to={item.url} key={index}>
                                <div className="evaluation-avatar">
                                    <img src={item.avatar}
                                         alt="loading"/>
                                </div>
                                <div className="evaluation-content-show">
                                    <div className="chinese-name">{item.user_name}</div>
                                    <div className="evaluation-result">
                                        <p>{Resources.getInstance().evaluationTo}</p>
                                        {item.score === 0 ?
                                            <div className="result-stars">
                                                <p>{Resources.getInstance().evaluationNo}</p>
                                            </div>
                                            :
                                            <div className="result-stars">
                                                <img
                                                    src={item.score >= 1 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                                    alt="star"/>
                                                <img
                                                    src={item.score >= 2 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                                    alt="star"/>
                                                <img
                                                    src={item.score >= 3 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                                    alt="star"/>
                                                <img
                                                    src={item.score >= 4 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                                    alt="star"/>
                                                <img
                                                    src={item.score >= 5 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"}
                                                    alt="star"/>
                                            </div>}
                                    </div>
                                </div>
                            </Link>
                        })
                        }
                    </div>
                    <LoadingModal loadingModal={this.state.loadingModal}/>
                </div>
            </div>
        );
    }
}

export default classEvaluationForeign;