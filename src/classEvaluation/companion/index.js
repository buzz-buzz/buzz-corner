import React from 'react';
import {Form, TextArea} from 'semantic-ui-react';
import {browserHistory} from "react-router";
import Resources from '../../resources';
import EvaluationStatusHelper from '../../common/evaluationStatusHelper';
import Button50px from '../../common/commonComponent/submitButton50px';
import './index.css';
import ErrorHandler from "../../common/error-handler";
import ServiceProxy from "../../service-proxy";
import CurrentUser from "../../membership/user";

export default class CompanionEvaluation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stars: this.props.evaluationContent.stars || 0,
            step: 1,
            evaluation_content: this.props.evaluationContent.evaluation_content || '',
            step2: this.handleTypes(this.props.types),
            evaluation_status: this.props.evaluation_status
        };

        this.submitEvaluation = this.submitEvaluation.bind(this);
        this.backStepOne = this.backStepOne.bind(this);
        this.goStepTwo = this.goStepTwo.bind(this);
        this.getScore = this.getScore.bind(this);
        this.evaluationStandards = this.evaluationStandards.bind(this);
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

    evaluationStandards() {
        browserHistory.push('/evaluation/standards');
    }

    evaluationContentChange(event, data) {
        this.setState({
            evaluation_content: data.value
        });
    }

    backStepOne() {
        if (this.state.step === 2) {
            this.setState({
                step: 1
            });
        }
    }

    goStepTwo() {
        if (this.state.step === 1 && this.state.evaluation_content && this.state.stars) {
            this.setState({
                step: 2
            });
        }
    }

    getScore(event, score, key) {
        if (this.state.evaluation_status) {
            return;
        }

        if (key === 'stars') {
            if (this.state.stars !== score) {
                this.setState({stars: score});
            }
        } else {
            let clonedRating = Object.assign({}, this.state.step2);

            if (clonedRating[key] !== score ) {
                clonedRating[key] = score;
                this.setState({
                    step2: clonedRating
                });
            }
        }
    }

    async submitEvaluation() {
        const {to_user_id, class_id} = this.props.parentProps.params;
        const from_user_id = await CurrentUser.getUserId();
        let feedbackUrl = `{config.endPoints.buzzService}/api/v2/class-feedback/${class_id}/${from_user_id}/evaluate/${to_user_id}`;

        if (this.state.step === 1) {
            this.setState({step: 2});
        } else if (this.state.step === 2 && this.state.step2.Fluency && this.state.step2.Vocabulary && this.state.step2.Grammar && this.state.step2.Pronunciation) {
            try {
                this.props.setModalSubmitStatus('a', 1);

                await ServiceProxy.proxyTo({
                    body: {
                        uri: feedbackUrl,
                        method: 'POST',
                        json: Object.keys(this.state.step2).map(dimension => ({
                            score: this.state.step2[dimension],
                            type: dimension,
                            comment: ''
                        })).concat([{score: this.state.stars, comment: this.state.evaluation_content}])
                    }
                });

                this.setState({evaluation_status: true}, () => {
                    this.props.setModalSubmitStatus('a', 2);

                    if(sessionStorage.getItem('evaluation')){
                        sessionStorage.setItem('evaluation', null);
                    }
                });
            } catch (ex) {
                ErrorHandler.notify('保存能力打分出错：', ex);

                this.props.setModalSubmitStatus('a', 3);
            }
        }
    }

    componentWillMount(){
        if(!this.props.evaluation_status){
          let data = sessionStorage.getItem('evaluation');
          if(data){
              try{
                  data = JSON.parse(data);

                  this.setState({
                      stars: data.stars || 0,
                      evaluation_content: data.evaluation_content || '',
                  });
              }
              catch (ex){
                 console.log('--獲取緩存的評價數據出錯--');
              }
          }
        }
    }

    componentWillUnmount(){
        //save data to sessionStorage
        let data = {
            stars: this.state.stars || 0,
            evaluation_content: this.state.evaluation_content || '',
        };

        sessionStorage.setItem('evaluation', JSON.stringify(data));
    }

    render() {
        return (
            <div className="companion-evaluation">
                <div className="tabs">
                    <div className={this.state.step === 1 ? "active" : ""} onClick={this.backStepOne}>{Resources.getInstance().evaluationStandardStep1}</div>
                    <div className={this.state.step === 2 ? "active" : ""} onClick={this.goStepTwo}>{Resources.getInstance().evaluationStandardStep2}</div>
                </div>
                {
                    this.state.step === 1 &&
                    <div className="class-behavior">
                        <div className="behavior">
                            <div className="word">{Resources.getInstance().classPerformance}</div>
                            <div className="stars">
                                {
                                    [1, 2, 3, 4, 5].map((item, index) => {
                                        return <img onClick={(event) => this.getScore(event, item, 'stars')} key={index}
                                                    src={this.state.stars >= item ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_active.svg" : (this.state.stars === item - 0.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")}
                                                    alt=""/>
                                    })
                                }
                            </div>
                        </div>
                        <div className="stars-word" style={{color: EvaluationStatusHelper.getStyleByStars(this.state.stars)}}>{EvaluationStatusHelper.getStatusByStars(this.state.stars)}</div>
                    </div>
                }
                {
                    this.state.step === 1 &&
                    <div className="companion-word">
                        <div className="title">{Resources.getInstance().partnersWord}</div>
                        <div className="evaluation-input">
                            <Form>
                                            <TextArea autoHeight
                                                      placeholder={Resources.getInstance().classEvaluationSuggest}
                                                      rows={7}
                                                      maxLength="200"
                                                      value={this.state.evaluation_content}
                                                      readOnly={this.state.evaluation_status}
                                                      onChange={(event, data) => this.evaluationContentChange(event, data)}/>
                                <p className="text-length-notice">{this.state.evaluation_content.length + '/200'}</p>
                            </Form>
                        </div>
                    </div>
                }
                {
                    this.state.step === 2 &&
                    <div className="step_two_stars">
                        {
                            Object.keys(this.state.step2).map(key => {
                                return <div className="star-item" key={key}>
                                    <div className="item-left">
                                        <div className="item-name">{key}:</div>
                                        <div className="item-stars">
                                            {
                                                [1, 2, 3, 4 ,5].map((item, index) => {
                                                    return <div className="img-container" key={index}>
                                                        <img src={this.state.step2[key] >= item - 0.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_yellow_left.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_none_left.svg"}
                                                             onClick={(event) => this.getScore(event, item - 0.5, key)} alt=""/>
                                                        <img src={this.state.step2[key] >= item ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_yellow_right.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_none_right.svg"}
                                                             onClick={(event) => this.getScore(event, item, key)} alt=""/>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="item-score">{this.state.step2[key]}</div>
                                </div>
                            })
                        }
                    </div>
                }
                {
                    this.state.step === 2 &&
                    <div className="score-introduction" onClick={this.evaluationStandards}>
                        {Resources.getInstance().evaluationStandard}
                    </div>
                }
                <div className="companion-submit" style={this.state.evaluation_status ? {display: 'none'} : {}}>
                    <Button50px
                        disabled={this.state.step === 1 ? !(this.state.evaluation_content && this.state.stars) : !(this.state.step2.Fluency && this.state.step2.Vocabulary && this.state.step2.Grammar && this.state.step2.Pronunciation)}
                        text={this.state.step === 1 ? Resources.getInstance().profileContinue : Resources.getInstance().profileSunmitBtn}
                        submit={this.submitEvaluation}/>
                </div>
            </div>
        );
    }
}