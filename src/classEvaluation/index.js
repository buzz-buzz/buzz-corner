import React, {Component} from 'react';
import {Form, TextArea} from 'semantic-ui-react';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import './index.css';
import Track from "../common/track";
import * as time from "../common/timeHelper";
import LoadingModal from '../common/commonComponent/loadingModal';

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
                show_time: '00:00 - 00:00'
            },
            user_type: 2,
            stars: 0,
            evaluation_items: [],
            evaluation_content: '',
            to_user_id: props.params.to_user_id,
            class_id: props.params.class_id,
            evaluation_status: false
        };

        this.changeStars = this.changeStars.bind(this);
        this.evaluationItemsChange = this.evaluationItemsChange.bind(this);
        this.back = this.back.bind(this);
        this.submitEvaluation = this.submitEvaluation.bind(this);

    }

    back() {
        window.history.back();
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
        return time.getWeekdayNameByIndex(day)
    }

    transformMonth(day) {
        return time.getMonthNameByIndex(day);
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
            Track.event('错误_课后评价完成点击后提交出错',  null, {"类型" : "错误", "错误内容": ex.toString()});
        }
    }

    async componentDidMount() {
        //get data from DB await CurrentUser.getUserId()
        try {
            Track.event('课后评价_课后评价页面');

            this.setState({loadingModal: true});

            let userId = await CurrentUser.getUserId();

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

            console.log('aaaaa....');
            console.log(feed_back);
            console.log(typeof feed_back);

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
                    loadingModal: false
                });
            } else {
                //set state
                this.setState({
                    class_info: class_info,
                    companion_name: class_info.companion_name || '',
                    companion_avatar: class_info.companion_avatar || '',
                    userId: userId,
                    loadingModal: false
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
                                src={this.state.companion_avatar || "//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                alt=""/>
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
                     style={{backgroundColor: 'white', position: 'relative'}}>
                    <div className="evaluation-stars">
                        <div className="img-stars">
                            <img
                                src={this.state.stars >= 1 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="1" alt="star"/>
                            <img
                                src={this.state.stars >= 2 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="2" alt="star"/>
                            <img
                                src={this.state.stars >= 3 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="3" alt="star"/>
                            <img
                                src={this.state.stars >= 4 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="4" alt="star"/>
                            <img
                                src={this.state.stars >= 5 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"}
                                onClick={this.changeStars} name="5" alt="star"/>
                        </div>
                        <div className="stars-word">
                            <p>{this.state.stars === 1 ? Resources.getInstance().classEvaluationStarsStatus1 : (this.state.stars === 2 ? Resources.getInstance().classEvaluationStarsStatus2 : (this.state.stars === 3 ? Resources.getInstance().classEvaluationStarsStatus3 : (this.state.stars === 4 ? Resources.getInstance().classEvaluationStarsStatus4 : (this.state.stars === 5 ? Resources.getInstance().classEvaluationStarsStatus5 : Resources.getInstance().classEvaluationStarsStatus0))))}</p>
                        </div>
                    </div>
                    {
                        0 === 1 ?
                            (
                                <div className="evaluation-list"
                                     style={this.state.evaluation_status ? {display: 'none'} : {}}>
                                    <a className={this.state.evaluation_items.indexOf('a') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                       name="a" onClick={this.evaluationItemsChange}>发音不标准</a>
                                    <a className={this.state.evaluation_items.indexOf('b') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                       name="b" onClick={this.evaluationItemsChange}>语速太快听不懂</a>
                                    <a className={this.state.evaluation_items.indexOf('c') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                       name="c" onClick={this.evaluationItemsChange}>有本土化发音</a>
                                    <a className={this.state.evaluation_items.indexOf('d') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                       name="d" onClick={this.evaluationItemsChange}>我不喜欢他/她</a>
                                </div>
                            ) :
                            (
                                <div className="evaluation-title"
                                     style={this.state.evaluation_status ? {display: 'none'} : {}}>
                                    <p>{Resources.getInstance().classEvaluationEvaluate}</p>
                                </div>
                            )
                    }
                    <div className="evaluation-input" style={this.state.evaluation_status ? {display: 'none'} : {}}>
                        <Form>
                                        <TextArea autoHeight
                                                  placeholder={Resources.getInstance().classEvaluationSuggest} rows={5}
                                                  maxLength="200"
                                                  value={this.state.evaluation_content}
                                                  onChange={(event, data) => this.evaluationContentChange(event, data)}/>
                            <p className="text-length-notice">{this.state.evaluation_content.length + '/200'}</p>
                        </Form>
                    </div>
                    <div className="evaluation-submit"
                         style={this.state.evaluation_status === true ? {display: 'none'} : {}}>
                        <div className="evaluation-done" style={!this.state.stars || !this.state.evaluation_content ? {
                            color: 'rgb(255, 255, 255)',
                            background: 'rgb(223, 223, 228)'
                        } : {
                            color: 'white',
                            background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))'
                        }}
                             onClick={this.submitEvaluation}
                        >{Resources.getInstance().classEvaluationDone}
                        </div>
                    </div>
                    <div className="evaluation-result-show"
                         style={!this.state.evaluation_status ? {display: 'none'} : {}}>
                        <p className="result-title">{Resources.getInstance().classEvaluationEvaluate}</p>
                        <p className="result-content">{this.state.evaluation_content}</p>
                    </div>
                    <LoadingModal loadingModal={this.state.loadingModal}/>
                </div>
            </div>
        );
    }
}

export default classEvaluation;