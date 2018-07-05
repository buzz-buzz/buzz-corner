import React, {Component} from 'react';
import ServiceProxy from '../service-proxy';
import {Form, TextArea} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import QiniuDomain from '../common/systemData/qiniuUrl';
import Avatar from '../common/commonComponent/avatar';
import './index.css';
import Button50px from '../common/commonComponent/submitButton50px';
import {Flag} from "semantic-ui-react";
import Track from "../common/track";
import moment from 'moment';
import ClassEndTime from "../classDetail/class-end-time";

class classEvaluationResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            msg_id: props.location.query.msg_id,
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
        this.createPostersOfAchievement = this.createPostersOfAchievement.bind(this);
        this.closePosterModal = this.closePosterModal.bind(this);
    }

    back() {
        window.history.go(-1);
    }

    closePosterModal() {
        this.setState({
            posterModal: false
        });
    }

    createPostersOfAchievement() {
        Track.event('中方点击成就海报');

        browserHistory.push(`/poster/${this.state.from_user_id}/${this.state.to_user_id}/${this.state.class_id}`);
    }

    companionCenter() {
        Track.event('外籍头像点击');

        if (this.state.class_info.companions) {
            browserHistory.push('/user/' + this.state.class_info.companions);
        }
    }

    handleClassInfoData(classInfo) {
        let dateClone = new Date(classInfo.start_time);
        classInfo.show_date = moment(dateClone).format("dddd, MMMM Do YYYY");
        classInfo.companions = classInfo.companions.split(',')[0];
        classInfo.partners = classInfo.students.split(',');

        return classInfo;
    }

    async componentDidMount() {
        try {
            Track.event('查看学伴的评价');

            this.setState({loadingModal: true});

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            let companion_country = '';
            if (this.state.from_user_id) {
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
            if (this.state.from_user_id && this.state.to_user_id && this.state.class_id) {
                let feed_back = await  ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.from_user_id}/evaluate/${this.state.to_user_id}`
                    }
                });

                if (feed_back.length && feed_back[0].comment && feed_back[0].score) {
                    evaluation.stars = parseInt(feed_back[0].score, 10) || 0;
                    evaluation.evaluation_content = feed_back[0].comment;
                }
            }

            this.setState({
                class_info: class_info,
                loadingModal: false,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date(),
                companion_country: companion_country,
                evaluation: evaluation,
                posterModal: true
            });

            if (this.state.msg_id && this.state.msg_id !== 'undefined' && this.state.msg_id !== 'null') {
                ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/msg`,
                        json: {msg_id: this.state.msg_id, read: 1},
                        method: 'POST'
                    }
                });
            }
        } catch (ex) {
            //login error
            console.log("evaluation:" + ex.toString());
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="class-detail">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().classEvaluationResultTitle}/>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar" onClick={this.companionCenter}>
                            <Avatar src={this.state.class_info.companion_avatar || QiniuDomain + "/logo-image.svg"}/>
                            <Flag
                                name={this.state.companion_country ? this.state.companion_country.toLowerCase() : 'united states'}/>
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
                               style={{
                                   fontSize: '.8em',
                                   color: '#aaa'
                               }}>{moment(this.state.class_info.start_time).format('HH:mm')} - <ClassEndTime
                                classInfo={this.state.class_info}></ClassEndTime></p>
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
                        <div className="evaluation-submit" style={this.state.posterModal ? {display: 'none'} : {}}>
                            <Button50px text={Resources.getInstance().createPostersOfAchievement}
                                        submit={this.createPostersOfAchievement}/>
                        </div>
                        <LoadingModal loadingModal={this.state.loadingModal}/>
                    </div>
                </div>
                <div className="modal" style={this.state.posterModal ? {display: 'flex'} : {display: 'none'}}
                     onClick={this.closePosterModal}>
                    <div className="content">
                        <div>
                            <div className="welcome-title">
                                <p>{Resources.getInstance().posterModalTitle}</p>
                            </div>
                            {
                                window.navigator.language === 'zh-CN' ?
                                    (
                                        <div className="welcome-info">
                                            <p>{Resources.getInstance().posterModalContent1}</p>
                                            <p>{Resources.getInstance().posterModalContent2}</p>
                                        </div>
                                    ) :
                                    (
                                        <div className="welcome-info">
                                            <p>{Resources.getInstance().posterModalContent1 + Resources.getInstance().posterModalContent1}</p>
                                        </div>
                                    )
                            }
                            <div className="begin">
                                <div onClick={this.createPostersOfAchievement}>
                                    <p>{Resources.getInstance().createPostersOfAchievement}</p>
                                </div>
                            </div>
                            {/*<div className="skip" onClick={this.closeWelcome}>*/}
                            {/*<p>{Resources.getInstance().welcomePageSkip}</p>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default classEvaluationResult;