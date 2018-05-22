import React, {Component} from 'react';
import {Form, TextArea} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import {MemberType} from "../membership/member-type";
import Avatar from '../common/commonComponent/avatar';
import './index.css';
import Track from "../common/track";
import TimeHelper from "../common/timeHelper";
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import Button50px from '../common/commonComponent/submitButton50px';
import {Flag} from "semantic-ui-react";

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
                show_time: '00:00 - 00:00',
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
            companion_country: ''
        };

        this.changeStars = this.changeStars.bind(this);
        this.evaluationItemsChange = this.evaluationItemsChange.bind(this);
        this.back = this.back.bind(this);
        this.submitEvaluation = this.submitEvaluation.bind(this);
        this.companionCenter = this.companionCenter.bind(this);

    }

    back() {
        window.history.go(-1);
    }

    companionCenter(){
        Track.event('外籍头像点击');

        if(this.state.class_info.companions){
            browserHistory.push('/user/' + this.state.class_info.companions);
        }
    }

    changeStars(event) {
        if (!this.state.evaluation_status) {
            this.setState({
                stars: Number(event.target.name)
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

    transformDay(day) {
        return TimeHelper.getWeekdayNameByIndex(day)
    }

    transformMonth(day) {
        return TimeHelper.getMonthNameByIndex(day);
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

    async submitEvaluation() {
        try {
            if (!(!this.state.stars || !this.state.evaluation_content)) {
                this.setState({loadingModal: true});

                //post data
                let evaluationData = this.validateForm();

                await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${this.state.userId}/evaluate/${this.state.to_user_id}`,
                        json: evaluationData,
                        method: 'POST'
                    }
                });

                Track.event('课后评价_课后评价完成点击');
                this.setState({evaluation_status: true, loadingModal: false});
            }
        }
        catch (ex) {
            console.log('post evaluation data err:' + ex.toString());
            this.setState({loadingModal: false});
            Track.event('错误_课后评价完成点击后提交出错', null, {"类型": "错误", "错误内容": ex.toString()});
        }
    }

    async componentDidMount() {
        //get data from DB await CurrentUser.getUserId()
        try {
            Track.event('课后评价_课后评价页面');

            this.setState({loadingModal: true});

            let profile = await CurrentUser.getProfile(true);
            let userId = profile.user_id;

            let class_info = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/` + this.state.class_id
                }
            });

            class_info = this.handleClassInfoData(class_info[0]);

            //get feed_back data
            let feed_back = await  ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${this.state.class_id}/${userId}/evaluate/${this.state.to_user_id}`
                }
            });

            let companion_country = '';
            if(profile.role === MemberType.Companion){
                //get to_user_id info
                let user_profile = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${this.state.to_user_id}?t=${new Date().getTime()}`
                    }
                });

                class_info.companion_name = user_profile.name;
                class_info.companion_avatar = user_profile.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg';
                companion_country = user_profile.country || '';
            }else{
                if(class_info.companions){
                    let companion_id = class_info.companions.split(',')[0];

                    class_info.companions = companion_id;

                    companion_country = (await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/users/${companion_id}?t=${new Date().getTime()}`
                        }
                    })).country;
                }
            }

            if (feed_back.length && feed_back[0].comment && feed_back[0].score) {
                //set state
                this.setState({
                    class_info: class_info,
                    companion_name: class_info.companion_name || '',
                    companion_avatar: class_info.companion_avatar || '',
                    stars: parseFloat(feed_back[0].score),
                    evaluation_content: feed_back[0].comment,
                    evaluation_status: true,
                    userId: userId,
                    loadingModal: false,
                    companion_country: companion_country
                });
            } else {
                //set state
                this.setState({
                    class_info: class_info,
                    companion_name: class_info.companion_name || '',
                    companion_avatar: class_info.companion_avatar || '',
                    userId: userId,
                    loadingModal: false,
                    companion_country: companion_country
                });
            }
        } catch (ex) {
            //login error
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="class-detail">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().evaluationMyWord} />
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar"  onClick={this.companionCenter}>
                            <Avatar src={this.state.companion_avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}/>
                            <Flag name={this.state.companion_country ? this.state.companion_country.toLowerCase() : 'united states'} />
                        </div>
                        <div className="booking-item-info">
                            <p className="your-name"
                               style={{fontWeight: 'bold', fontSize: '1.2em'}}>{this.state.companion_name || "Buzz"}</p>
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
                <div className="class-detail-practice" id="evaluation"
                     style={{backgroundColor: 'white', position: 'relative', padding: '1em'}}>
                    <div className="evaluation-stars">
                        <div className="img-stars">
                            <img
                                src={this.state.stars >= 1 ? "http://cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars_active.png" : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="1" alt="star"/>
                            <img
                                src={this.state.stars >= 2 ? "http://cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars_active.png" : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="2" alt="star"/>
                            <img
                                src={this.state.stars >= 3 ? "http://cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars_active.png" : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="3" alt="star"/>
                            <img
                                src={this.state.stars >= 4 ? "http://cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars_active.png" : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="4" alt="star"/>
                            <img
                                src={this.state.stars >= 5 ? "http://cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars_active.png" : "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="5" alt="star"/>
                        </div>
                        <div className="stars-word">
                            <p>{this.state.stars === 1 ? Resources.getInstance().classEvaluationStarsStatus1 : (this.state.stars === 2 ? Resources.getInstance().classEvaluationStarsStatus2 : (this.state.stars === 3 ? Resources.getInstance().classEvaluationStarsStatus3 : (this.state.stars === 4 ? Resources.getInstance().classEvaluationStarsStatus4 : (this.state.stars === 5 ? Resources.getInstance().classEvaluationStarsStatus5 : Resources.getInstance().classEvaluationStarsStatus0))))}</p>
                        </div>
                    </div>
                    <div className="evaluation-input" style={this.state.evaluation_status ? {display: 'none'} : {}}>
                        <Form>
                                        <TextArea autoHeight
                                                  placeholder={Resources.getInstance().classEvaluationSuggest} rows={7}
                                                  maxLength="200"
                                                  value={this.state.evaluation_content}
                                                  onChange={(event, data) => this.evaluationContentChange(event, data)}/>
                            <p className="text-length-notice">{this.state.evaluation_content.length + '/200'}</p>
                        </Form>
                    </div>
                    <div className="evaluation-submit"
                         style={this.state.evaluation_status === true ? {display: 'none'} : {}}>
                        <Button50px  disabled={!this.state.stars || !this.state.evaluation_content}
                                     text={Resources.getInstance().classEvaluationDone} submit={this.submitEvaluation} />
                    </div>
                    <div className="evaluation-result-show"
                         style={!this.state.evaluation_status ? {display: 'none'} : {}}>
                        <p className="result-title">{Resources.getInstance().classEvaluationEvaluate}</p>
                        <Form className="result-content">
                                        <TextArea autoHeight
                                                  rows={7}
                                                  maxLength="200"
                                                  value={this.state.evaluation_content}
                                                  readOnly={true}/>
                        </Form>
                    </div>
                    <LoadingModal loadingModal={this.state.loadingModal}/>
                </div>
            </div>
        );
    }
}

export default classEvaluation;