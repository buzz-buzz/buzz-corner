import React, {Component} from 'react';
import ServiceProxy from '../service-proxy';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import './index.css';
import Button50px from '../common/commonComponent/submitButtonBottom';
import EvaluationStatusHelper from '../common/evaluationStatusHelper';
import ErrorHandler from '../common/error-handler';
import ClassInfoTitle from '../classDetail/classInfoTitle';
import CapacityRating from './capacityRating';
import Track from "../common/track";
import Back from '../common/back';
import moment from 'moment';

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
            },
            evaluationMe: {
                stars: 0,
                evaluation_content: ''
            },
            ratingModal: false
        };

        this.back = this.back.bind(this);
        this.companionCenter = this.companionCenter.bind(this);
        this.createPostersOfAchievement = this.createPostersOfAchievement.bind(this);
        this.closePosterModal = this.closePosterModal.bind(this);
        this.openRating = this.openRating.bind(this);
        this.getScore = this.getScore.bind(this);
        this.closeRating = this.closeRating.bind(this);
    }

    back() {
        Back.back();
    }

    getScore(arr) {
        try {
            return (arr.Fluency + arr.Grammar + arr.Vocabulary + arr.Pronunciation) / 4;
        }
        catch (ex) {
            return 0;
        }
    }

    handleFeedBack(feedback) {
        let result = [];

        for (let i in feedback) {
            if (!feedback[i].type) {
                result.push(feedback[i]);
                break;
            }
        }

        for (let i in feedback) {
            feedback[i].type && result.push(feedback[i]);
        }

        return result;
    }

    openRating() {
        //open the rating map
        this.setState({ratingModal: true});
    }

    closeRating() {
        //open the rating map
        this.setState({ratingModal: false});
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

    handleTypes(types) {
        if (types.length) {
            let result = {};
            for (let i in types) {
                result[types[i].type] = types[i].score;
            }

            return result;
        } else {
            return {
                Fluency: 0,
                Vocabulary: 0,
                Grammar: 0,
                Pronunciation: 0
            };
        }
    }

    async sortFeedback(class_info) {
        let result = [];
        await window.Promise.all(class_info.partners.map(
            async(item, index) => {
                let feed_back = (await  ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${class_info.companions}/evaluate/${item}`
                    }
                })).filter(function (item) {
                    return item.type
                });

                let sum = 0;

                for (let i in feed_back) {
                    sum = sum + feed_back[i].score
                }

                result.push({
                    user_id: item,
                    score: sum / 4
                });
            }
        ));

        return result.sort(function (a, b) {
            return a.score - b.score;
        });
    }

    async componentWillMount() {
        try {
            Track.event('查看学伴的评价');

            this.setState({loadingModal: true});

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            let sortResult = await this.sortFeedback(class_info);

            let companion_country = '';
            if (this.state.from_user_id) {
                class_info.companions = this.state.from_user_id;

                let companion_info = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.from_user_id}?t=${new Date().getTime()}`
                    }
                }));

                companion_country = companion_info.country || 'united states';
                class_info.companion_avatar = companion_info.avatar;
                class_info.companion_name = companion_info.name || companion_info.display_name;
            }

            //get evaluation result
            let evaluation = {}, feed_back = [], evaluationMe = {}, feed_back_me = [];
            if (this.state.from_user_id && this.state.to_user_id && this.state.class_id) {
                feed_back = await  ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.from_user_id}/evaluate/${this.state.to_user_id}`
                    }
                });

                if (feed_back && feed_back.length) {
                    feed_back = this.handleFeedBack(feed_back);
                    evaluation.stars = parseInt(feed_back[0].score, 10) || 0;
                    evaluation.evaluation_content = feed_back[0].comment || '';
                }

                feed_back_me = await  ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.to_user_id}/evaluate/${this.state.from_user_id}`
                    }
                });

                if (feed_back_me && feed_back_me.length) {
                    feed_back_me = this.handleFeedBack(feed_back_me);
                    evaluationMe.stars = parseInt(feed_back_me[0].score, 10) || 0;
                    evaluationMe.evaluation_content = feed_back_me[0].comment || '';
                }
            }

            let types = this.handleTypes(feed_back.filter(function (item) {
                return item.type
            }));
            let argScore = this.getScore(types);

            this.setState({
                class_info: class_info,
                loadingModal: false,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date(),
                companion_country: companion_country,
                evaluation: evaluation,
                evaluationMe: evaluationMe,
                posterModal: evaluation.stars >= 4,
                types: types,
                sortNum: (sortResult.filter(function (item) {
                    return item.score > argScore;
                })).length + 1
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
            ErrorHandler.notify('获取评价结果出错：', ex);
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="class-detail" style={{background: '#f4f5f9', paddingBottom: '50px'}}>
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().classEvaluationResultTitle}/>
                <div className="class-detail-info">
                    <ClassInfoTitle course_info={this.state.class_info} types={this.state.types}
                                    companion_country={this.state.companion_country}
                                    sortNum={this.state.sortNum} openRating={this.openRating}
                                    score={ this.state.types ? this.getScore(this.state.types) : 0}
                    />
                    <div className="evaluation-item">
                        <div className="title-info">
                            <div
                                style={{position: 'relative', zIndex: '2'}}>{Resources.getInstance().partnersWord}</div>
                            <div className="shadow"></div>
                        </div>
                        <div className="content">{this.state.evaluation.evaluation_content}</div>
                        <div className="class-behavior">
                            <div className="behavior">
                                <div className="stars">
                                    {
                                        [1, 2, 3, 4, 5].map((item, index) => <img key={index}
                                                                                  src={this.state.evaluation.stars >= item ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg"}
                                                                                  alt=""/>)
                                    }
                                </div>
                            </div>
                            <div
                                className="stars-word" style={{color: EvaluationStatusHelper.getStyleByStars(this.state.evaluation.stars)}}>{EvaluationStatusHelper.getStatusByStars(this.state.evaluation.stars)}</div>
                        </div>
                    </div>
                    <div className="evaluation-item">
                        <div className="title-info">
                            <div style={{position: 'relative', zIndex: '2'}}>{Resources.getInstance().myWord}</div>
                            <div className="shadow"></div>
                        </div>
                        <div className="content">{this.state.evaluationMe.evaluation_content}</div>
                        <div className="class-behavior">
                            <div className="behavior">
                                <div className="stars">
                                    {
                                        [1, 2, 3, 4, 5].map((item, index) => <img key={index}
                                                                                  src={this.state.evaluationMe.stars >= item ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg"}
                                                                                  alt=""/>)
                                    }
                                </div>
                            </div>
                            <div
                                className="stars-word" style={{color: EvaluationStatusHelper.getStyleByStars(this.state.evaluationMe.stars)}}>{EvaluationStatusHelper.getStatusByStars(this.state.evaluationMe.stars)}</div>
                        </div>
                    </div>
                    <div className="evaluation-submit" style={this.state.posterModal ? {display: 'none'} : {}}>
                        <Button50px text={Resources.getInstance().createPostersOfAchievement}
                                    submit={this.createPostersOfAchievement}/>
                    </div>
                    <LoadingModal loadingModal={this.state.loadingModal}/>
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
                        </div>
                    </div>
                </div>
                <CapacityRating modal={this.state.ratingModal} close={this.closeRating} rating={this.state.types}/>
            </div>
        );
    }
}

export default classEvaluationResult;