import React from 'react';
import {Form, TextArea} from 'semantic-ui-react';
import Resources from '../../resources';
import Button50px from '../../common/commonComponent/submitButton50px';
import './index.css';

export default class CompanionEvaluation extends React.Component{
    constructor(){
        super();

        this.state = {
            stars: 0,
            step: 1,
            evaluation_content: '',
            step2: {
                Fluency: 1,
                Vocabulary: 2,
                Grammar: 3,
                Pronunciation: 1.5
            }
        };

        this.submitEvaluation = this.submitEvaluation.bind(this);
        this.backStepOne = this.backStepOne.bind(this);
        this.goStepTwo = this.goStepTwo.bind(this);
        this.getScore = this.getScore.bind(this);
    }

    componentWillMount(){
        //evaluate fro companion

    }

    evaluationContentChange(event, data){
        this.setState({
            evaluation_content: data.value
        });
    }

    backStepOne(){
        if(this.state.step === 2){
            this.setState({
                step: 1
            });
        }
    }

    goStepTwo(){
        if(this.state.step === 1 && this.state.evaluation_content && this.state.stars){
            this.setState({
                step: 2
            });
        }
    }

    getScore(event, score, key){
        if(key === 'stars'){
            if(this.state.stars !== score - 0.5){
                this.setState({stars: score - 0.5});
            }else{
                this.setState({stars: score});
            }
        }else{
            let clonedRating = Object.assign({}, this.state.step2);

            if(clonedRating[key] !== score - 0.5){
                clonedRating[key] =  score - 0.5;
            }else{
                clonedRating[key] =  score;
            }

            this.setState({
                step2: clonedRating
            });
        }
    }

    submitEvaluation(){
        if(this.state.step === 1){
            this.setState({step: 2});
        }else if(this.state.step === 2){
            //post 提交 props.submit
        }
    }

    render(){
        return (
            <div className="companion-evaluation">
                <div className="tabs">
                    <div className={ this.state.step === 1 ?  "active" : ""} onClick={this.backStepOne}>第一步: 课堂表现</div>
                    <div className={ this.state.step === 2 ?  "active" : ""} onClick={this.goStepTwo}>第二步: 能力打分</div>
                </div>
                {
                    this.state.step === 1 &&
                    <div className="class-behavior">
                        <div className="behavior">
                            <div className="word">课堂表现: </div>
                            <div className="stars">
                                <img onClick={(event) => this.getScore(event, 1, 'stars')} src={this.state.stars >= 1 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.stars === 0.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                <img onClick={(event) => this.getScore(event, 2, 'stars')} src={this.state.stars >= 2 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.stars === 1.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                <img onClick={(event) => this.getScore(event, 3, 'stars')} src={this.state.stars >= 3 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.stars === 2.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                <img onClick={(event) => this.getScore(event, 4, 'stars')} src={this.state.stars >= 4 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.stars === 3.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                <img onClick={(event) => this.getScore(event, 5, 'stars')} src={this.state.stars >= 5 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.stars === 4.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                            </div>
                        </div>
                        <div className="stars-word">非常棒</div>
                    </div>
                }
                {
                    this.state.step === 1 &&
                    <div className="companion-word">
                        <div className="title">语伴寄语:</div>
                        <div className="evaluation-input">
                            <Form>
                                            <TextArea autoHeight
                                                      placeholder={Resources.getInstance().classEvaluationSuggest} rows={7}
                                                      maxLength="200"
                                                      value={this.state.evaluation_content}
                                                      onChange={(event, data) => this.evaluationContentChange(event, data)}/>
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
                                            <img onClick={(event) => this.getScore(event, 1, key)} src={this.state.step2[key] >= 1 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.step2[key] === 0.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                            <img onClick={(event) => this.getScore(event, 2, key)} src={this.state.step2[key] >= 2 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.step2[key] === 1.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                            <img onClick={(event) => this.getScore(event, 3, key)} src={this.state.step2[key] >= 3 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.step2[key] === 2.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                            <img onClick={(event) => this.getScore(event, 4, key)} src={this.state.step2[key] >= 4 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.step2[key] === 3.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
                                            <img onClick={(event) => this.getScore(event, 5, key)} src={this.state.step2[key] >= 5 ? "//cdn-corner.resource.buzzbuzzenglish.com/image/icon_Stars_active1.png" : (this.state.step2[key] === 4.5 ? "//cdn-corner.resource.buzzbuzzenglish.com/icon_stars_half.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/icon_Stars_grey.svg")} alt=""/>
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
                    <div className="score-introduction">
                        评分标准说明
                    </div>
                }
                <div className="companion-submit">
                    <Button50px  disabled={this.state.step === 1 ? !(this.state.evaluation_content && this.state.stars) : !(this.state.step2.Fluency && this.state.step2.Vocabulary && this.state.step2.Grammar && this.state.step2.Pronunciation)}
                                 text={this.state.step === 1 ? Resources.getInstance().profileContinue : Resources.getInstance().profileSunmitBtn} submit={this.submitEvaluation} />
                </div>
            </div>
        );
    }
}