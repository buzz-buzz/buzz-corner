import React, {Component} from 'react';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import {Form, TextArea} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import QiniuDomain from '../common/systemData/qiniuUrl';
import Avatar from '../common/commonComponent/avatar';
import './index.css';
import TimeHelper from "../common/timeHelper";
import Button50px from '../common/commonComponent/submitButton50px';
import {Flag} from "semantic-ui-react";
import Track from "../common/track";

class classEvaluationResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            from_user_id: props.params.from_user_id,
            to_user_id: props.params.to_user_id,
            companion_country: '',
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [1, 2, 3],
                status: 2,
                show_date: 'tomorrow, is coming',
                show_time: '00:00 - 00:00',
                companion_name: '',
                companion_avatar: '',
                companions: ''
            },
            evaluation: {
                stars: 0,
                evaluation_content: ''
            }
        };

        this.back = this.back.bind(this);
        this.companionCenter = this.companionCenter.bind(this);
        this.goMyFeedback = this.goMyFeedback.bind(this);
    }

    back() {
        window.history.back();
    }

    goMyFeedback(){
        browserHistory.push(`/class/evaluation/${this.state.from_user_id}/${this.state.class_id}`);
    }

    companionCenter(){
        Track.event('外籍头像点击');

        if(this.state.class_info.companions){
            browserHistory.push('/user/' + this.state.class_info.companions);
        }
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

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            let companion_country = '';
            if(this.state.from_user_id){
                class_info.companions = this.state.from_user_id;

                let companion_info = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.from_user_id}?t=${new Date().getTime()}`
                    }
                }));

                companion_country = companion_info.country;
                class_info.companion_avatar = companion_info.avatar;
                class_info.companion_name = companion_info.name || companion_info.display_name;
            }

            //get evaluation result
            let evaluation = {};
            if(this.state.from_user_id && this.state.to_user_id && this.state.class_id){
                let feed_back = await  ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.from_user_id}/evaluate/${this.state.to_user_id}`
                    }
                });

                if(feed_back.length && feed_back[0].comment && feed_back[0].score){
                    evaluation.stars = parseInt(feed_back[0].score, 10) || 0;
                    evaluation.evaluation_content = feed_back[0].comment;
                }
            }

            this.setState({
                class_info: class_info,
                loadingModal: false,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date(),
                companion_country: companion_country,
                evaluation: evaluation
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
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().classEvaluationResultTitle} />
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar" onClick={this.companionCenter}>
                            <Avatar src={this.state.class_info.companion_avatar || QiniuDomain + "/logo-image.svg"}/>
                            <Flag name={this.state.companion_country ? this.state.companion_country.toLowerCase() : 'united states'} />
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
                    <div className="class-detail-practice" id="evaluation"
                         style={{backgroundColor: 'white', position: 'relative', padding: '1em'}}>
                        <div className="evaluation-stars">
                            <div className="img-stars">
                                <img
                                    src={this.state.evaluation.stars >= 1 ? QiniuDomain + "/image/icon_stars_active.png" : QiniuDomain + "/image/icon_stars.png"}
                                    name="1" alt="star"/>
                                <img
                                    src={this.state.evaluation.stars >= 2 ? QiniuDomain + "/image/icon_stars_active.png" : QiniuDomain + "/image/icon_stars.png"}
                                    name="2" alt="star"/>
                                <img
                                    src={this.state.evaluation.stars >= 3 ? QiniuDomain + "/image/icon_stars_active.png" : QiniuDomain + "/image/icon_stars.png"}
                                    name="3" alt="star"/>
                                <img
                                    src={this.state.evaluation.stars >= 4 ? QiniuDomain + "/image/icon_stars_active.png" : QiniuDomain + "/image/icon_stars.png"}
                                    name="4" alt="star"/>
                                <img
                                    src={this.state.evaluation.stars >= 5 ? QiniuDomain + "/image/icon_stars_active.png" : QiniuDomain + "/image/icon_stars.png"}
                                    name="5" alt="star"/>
                            </div>
                            <div className="stars-word">
                                <p>{this.state.evaluation.stars === 1 ? Resources.getInstance().classEvaluationStarsStatus1 : (this.state.evaluation.stars === 2 ? Resources.getInstance().classEvaluationStarsStatus2 : (this.state.evaluation.stars === 3 ? Resources.getInstance().classEvaluationStarsStatus3 : (this.state.evaluation.stars === 4 ? Resources.getInstance().classEvaluationStarsStatus4 : (this.state.evaluation.stars === 5 ? Resources.getInstance().classEvaluationStarsStatus5 : Resources.getInstance().classEvaluationStarsStatus6))))}</p>
                            </div>
                        </div>
                        <div className="evaluation-result-show">
                            <p className="result-title">{Resources.getInstance().classEvaluationResultContent}</p>
                            <Form className="result-content">
                                        <TextArea autoHeight
                                                  rows={7}
                                                  maxLength="200"
                                                  value={this.state.evaluation.evaluation_content}
                                                  readOnly={true}/>
                            </Form>
                        </div>
                        <div className="evaluation-submit">
                            <Button50px  text={Resources.getInstance().classEvaluationMy} submit={this.goMyFeedback} />
                        </div>
                        <LoadingModal loadingModal={this.state.loadingModal}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default classEvaluationResult;