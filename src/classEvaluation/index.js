import React, {Component} from 'react';
import {Form, TextArea} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import {MemberType} from "../membership/member-type";
import './index.css';
import Track from "../common/track";
import Back from "../common/back";
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import Button50px from '../common/commonComponent/submitButtonBottom';
import ModalSubmit from '../common/commonComponent/modalSubmitInfo';
import ErrorHandler from "../common/error-handler";
import EvaluationStatusHelper from '../common/evaluationStatusHelper';
import ClassInfoTitle from '../classDetail/classInfoTitle';
import CompanionModal from './companion';
import moment from 'moment';

class classEvaluation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [1, 2, 3],
                status: 2,
                show_date: 'tomorrow, is coming',
                companions: ''
            },
            user_type: 2,
            stars: 0,
            evaluation_items: [],
            evaluation_content: '',
            to_user_id: props.params.to_user_id,
            class_id: props.params.class_id,
            evaluation_status: false,
            CURRENT_TIMESTAMP: new Date(),
            companion_country: '',
            evaluationContent: {
                stars: 0,
                evaluation_content: ''
            },
            types: []
        };

        this.changeStars = this.changeStars.bind(this);
        this.evaluationItemsChange = this.evaluationItemsChange.bind(this);
        this.back = this.back.bind(this);
        this.submitEvaluation = this.submitEvaluation.bind(this);
        this.companionCenter = this.companionCenter.bind(this);
        this.setModalSubmitStatus = this.setModalSubmitStatus.bind(this);
    }

    setModalSubmitStatus(event, status) {
        this.setState({
            modalSubmitStatus: status,
            modalSubmit: true
        });

        if (status !== 1) {
            this.closeModalSubmitInfo();
        }
    }

    back() {
        Back.back();
    }

    companionCenter() {
        Track.event('外籍头像点击');

        if (this.state.class_info.companions) {
            browserHistory.push('/user/' + this.state.class_info.companions);
        }
    }

    changeStars(event, score) {
        if (!this.state.evaluation_status) {
            this.setState({
                stars: score
            });
        }
    }

    evaluationContentChange(event, data) {
        if (!this.state.evaluation_status) {
            this.setState({
                evaluation_content: data.value
            });
        }
    }

    evaluationItemsChange(event) {
        let clonedItems = this.state.evaluation_items;

        if (clonedItems.indexOf(event.target.name) > -1) {
            let newItems = [];
            for (let i in clonedItems) {
                if (clonedItems[i] !== event.target.name) {
                    newItems.push(clonedItems[i]);
                }
            }

            clonedItems = newItems;
        } else {
            clonedItems.push(event.target.name);
        }

        this.setState({
            evaluation_items: clonedItems
        });
    }

    handleClassInfoData(classInfo) {
        let dateClone = new Date(classInfo.start_time);
        classInfo.show_date = moment(dateClone).format("dddd, MMMM Do YYYY");
        classInfo.companions = classInfo.companions.split(',')[0];

        return classInfo;
    }

    validateForm() {
        return [{
            class_id: this.state.class_id,
            from_user_id: this.state.userId,
            to_user_id: this.state.to_user_id,
            feedback_time: new Date(),
            score: this.state.stars,
            comment: this.state.evaluation_content
        }];
    }

    closeModalSubmitInfo() {
        if (this.state.modalSubmit) {
            const interval = setTimeout(() => {
                if (this.state.modalSubmit) {
                    this.setState({modalSubmit: false});
                }

                clearTimeout(interval);
            }, 2000)
        }
    }

    async submitEvaluation() {
        try {
            if (!(!this.state.stars || !this.state.evaluation_content)) {
                this.setState({modalSubmit: true, modalSubmitStatus: 1});

                //post data
                let evaluationData = this.validateForm();

                await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.userId}/evaluate/${this.state.to_user_id}`,
                        json: evaluationData,
                        method: 'POST'
                    }
                });

                Track.event(this.state.role === MemberType.Student ? '课后评价_中方课后评价完成点击' : '课后评价_外籍课后评价完成点击');
                this.setState({evaluation_status: true, modalSubmit: true, modalSubmitStatus: 2}, () => {
                    this.closeModalSubmitInfo();
                });
            }
        }
        catch (ex) {
            ErrorHandler.notify('错误_课后评价完成点击后提交出错', ex);
            this.setState({modalSubmit: true, modalSubmitStatus: 3}, () => {
                this.closeModalSubmitInfo();
            });
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

    async componentWillMount() {
        //get data from DB await CurrentUser.getUserId()
        try {
            this.setState({loadingModal: true});

            let profile = await CurrentUser.getProfile(true);
            let userId = profile.user_id;

            Track.event(profile.role === MemberType.Student ? '课后评价_中方课后评价页面' : '课后评价_外籍课后评价页面');

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            //class if end
            if (new Date(class_info.end_time) - new Date(class_info.CURRENT_TIMESTAMP) > 0) {
                alert('此课程还未结束不能评价, 请稍后再来哦');
                Back.back();
                return false;
            }

            //auth check
            if (class_info.companions && class_info.students && class_info.companions !== (userId + '') && class_info.students.indexOf(userId + '') <= -1) {
                alert(Resources.getInstance().classInfoNoAuth);
                Back.back();
                return false;
            }

            //get feed_back data
            let feed_back = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${userId}/evaluate/${this.state.to_user_id}`
                }
            });

            let companion_country = '';
            if (class_info.companions.indexOf(userId) > -1) {
                //get to_user_id info
                let user_profile = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.to_user_id}?t=${new Date().getTime()}`
                    }
                });

                class_info.companion_name = user_profile.name;
                class_info.companion_avatar = user_profile.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg';
                companion_country = user_profile.country || '';
            } else {
                if (class_info.companions) {
                    class_info.companions = class_info.companions.split(',')[0];

                    companion_country = (await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/users/${class_info.companions}?t=${new Date().getTime()}`
                        }
                    })).country;
                }
            }

            if (feed_back.length && feed_back[0].score) {
                //set state
                feed_back = this.handleFeedBack(feed_back);

                this.setState({
                    class_info: class_info,
                    companion_name: class_info.companion_name || '',
                    companion_avatar: class_info.companion_avatar || '',
                    stars: parseFloat(feed_back[0].score),
                    evaluation_content: feed_back[0].comment,
                    evaluation_status: true,
                    userId: userId,
                    loadingModal: false,
                    companion_country: companion_country,
                    role: profile.role,
                    evaluationContent: {
                        stars: parseFloat(feed_back[0].score),
                        evaluation_content: feed_back[0].comment
                    },
                    types: feed_back.filter(function (item) {
                        return item.type
                    })
                });
            } else {
                //set state
                this.setState({
                    class_info: class_info,
                    companion_name: class_info.companion_name || '',
                    companion_avatar: class_info.companion_avatar || '',
                    userId: userId,
                    loadingModal: false,
                    companion_country: companion_country,
                    role: profile.role,
                    types: []
                });
            }
        } catch (ex) {
            //login error
            ErrorHandler.notify('课后评价页面出错', ex)
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="class-detail">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().evaluationMyWord}/>
                <div className="class-detail-info">
                    <ClassInfoTitle course_info={this.state.class_info}
                                    companion_country={this.state.companion_country}
                    />
                </div>
                {
                    this.state.role === MemberType.Student &&
                    <div className="class-detail-practice" id="evaluation"
                         style={{backgroundColor: 'white', position: 'relative', padding: '1em 1em 50px 1em'}}>
                        <div className="evaluation-stars">
                            <div className="img-stars">
                                {
                                    [1, 2, 3, 4, 5].map((item, index) => <img key={index}
                                        src={this.state.stars >= item ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars_active.png"
                                            : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars.png"}
                                        onClick={(event) => this.changeStars(event, item)} alt="star"/>)
                                }
                            </div>
                            <div className="stars-word">
                                <p style={{color: EvaluationStatusHelper.getStyleByStars(this.state.stars)}}>{EvaluationStatusHelper.getStatusByStars(this.state.stars)}</p>
                            </div>
                        </div>
                        {
                            this.state.evaluation_status !== true &&
                            <div className="evaluation-input">
                                <Form>
                                        <TextArea autoHeight
                                                  placeholder={Resources.getInstance().classEvaluationSuggest} rows={7}
                                                  maxLength="200"
                                                  value={this.state.evaluation_content}
                                                  onChange={(event, data) => this.evaluationContentChange(event, data)}/>
                                    <p className="text-length-notice">{this.state.evaluation_content.length + '/200'}</p>
                                </Form>
                            </div>
                        }
                        {
                            this.state.evaluation_status !== true &&
                            <div className="evaluation-submit">
                                <Button50px disabled={!this.state.stars || !this.state.evaluation_content}
                                            text={Resources.getInstance().classEvaluationDone}
                                            submit={this.submitEvaluation}/>
                            </div>
                        }
                        {
                            this.state.evaluation_status &&
                            <div className="evaluation-result-show">
                                <p className="result-title">{Resources.getInstance().classEvaluationEvaluate}</p>
                                <Form className="result-content">
                                        <TextArea autoHeight
                                                  rows={7}
                                                  maxLength="200"
                                                  value={this.state.evaluation_content}
                                                  readOnly={true}/>
                                </Form>
                            </div>
                        }
                    </div>
                }
                {
                    this.state.role === MemberType.Companion &&
                    <CompanionModal parentProps={this.props}
                                    setModalSubmitStatus={this.setModalSubmitStatus}
                                    evaluationContent={this.state.evaluationContent}
                                    evaluation_status={this.state.evaluation_status} types={this.state.types}
                    />
                }
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <ModalSubmit status={this.state.modalSubmitStatus} modal={this.state.modalSubmit}/>
            </div>
        );
    }
}

export default classEvaluation;