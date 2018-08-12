import React, {Component} from 'react';
import {Link} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import ClassInfoTitle from '../classDetail/classInfoTitle';
import ErrorHandler from '../common/error-handler';
import './index.css';
import moment from 'moment';
import Track from "../common/track";
import Back from '../common/back';

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
                companion_name: '',
                companion_avatar: '',
                companions: ''
            },
            evaluation_list: [],
            CURRENT_TIMESTAMP: new Date(),
            companion_country: ''
        };

        this.back = this.back.bind(this);
        this.companionCenter = this.companionCenter.bind(this);
        this.track = this.track.bind(this);
    }

    back() {
        Back.back();
    }

    track() {
        Track.event('课后评价_点击任意中方进行评价');
    }

    companionCenter() {
        Track.event('课后评价_外籍头像点击');

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

    async componentWillMount() {
        try {
            Track.event('课后评价_外籍课后评价列表页面');

            this.setState({loadingModal: true});

            let userId = await CurrentUser.getUserId();

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            let companion_country = '';
            if (class_info.companions) {
                let companion_id = class_info.companions.split(',')[0];

                class_info.companions = companion_id;

                if ((userId + '') !== class_info.companions) {
                    alert(Resources.getInstance().classInfoNoAuth);
                    browserHistory.push('/');
                    return;
                }

                companion_country = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${companion_id}?t=${new Date().getTime()}`
                    }
                })).country;
            }

            //create a students evaluation list.
            let clonedEvaluationList = this.state.evaluation_list;

            if (class_info.companions && class_info.partners && class_info.partners.length > 0) {
                await window.Promise.all(class_info.partners.map(async(item, index) => {
                    let evaluationResult = (await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${userId}/evaluate/${item}`
                        }
                    })).filter(function (item) {
                        return !item.type;
                    });

                    let user_info = await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/users/${item}?t=${new Date().getTime()}`
                        }
                    });

                    clonedEvaluationList.push({
                        url: '/class/evaluation/' + item + '/' + this.state.class_id,
                        score: evaluationResult && evaluationResult[0] && evaluationResult[0].score ? evaluationResult[0].score : 0,
                        user_name: user_info.name || 'Buzz',
                        avatar: user_info.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
                    });
                }));
            }

            this.setState({
                userId: userId,
                class_info: class_info,
                loadingModal: false,
                evaluation_list: clonedEvaluationList,
                CURRENT_TIMESTAMP: class_info.CURRENT_TIMESTAMP || new Date(),
                companion_country: companion_country
            });
        } catch (ex) {
            //login error
            ErrorHandler.notify('评价-外籍评价列表页出错', ex);
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="class-detail">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().evaluationWord}/>
                <div className="class-detail-info">
                    <ClassInfoTitle course_info={this.state.class_info}
                                    companion_country={this.state.companion_country}
                    />
                </div>
                <div className="class-detail-foreign-list" style={{position: 'relative', background: '#f4f5f9'}}>
                    <div className="foreign-evaluation-title">
                        <p>{Resources.getInstance().evaluationForStudent}</p>
                    </div>
                    <div className="chinese-student-evaluation-list">
                        {this.state.evaluation_list && this.state.evaluation_list.length &&
                        this.state.evaluation_list.map((item, index) => {
                            return <Link to={item.url} key={index} onClick={this.track}>
                                <div className="evaluation-avatar">
                                    <img src={item.avatar}
                                         alt="loading"/>
                                </div>
                                <div className="evaluation-content-show">
                                    <div className="chinese-name"
                                         style={{color: '#000', fontWeight: 'bold'}}>{item.user_name}</div>
                                    <div className="evaluation-result">
                                        <p style={{color: '#868686'}}>{Resources.getInstance().evaluationTo}</p>
                                        {item.score === 0 ?
                                            <div className="result-stars">
                                                <p>{Resources.getInstance().evaluationNo}</p>
                                            </div>
                                            :
                                            <div className="result-stars">
                                                {
                                                    [1, 2, 3, 4, 5].map((i, index) => <img
                                                        src={item.score >= i ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars1.png"}
                                                        alt="star"/>)
                                                }
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