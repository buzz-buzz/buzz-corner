import React from 'react';
import ImageModal from '../imageSelect';
import PlacementRecorder from '../placementRecord';
import './index.css';

export default class PlacementQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pressing: false,
        };

        this.touchEnd = this.touchEnd.bind(this);
    }

    touchStart(index) {
        this.setState({
            pressing: index
        });
    }

    touchEnd() {
        this.setState({
            pressing: "no"
        });
    }

    renderWord(word) {
        let info = word.split('英语');
        return info.length === 2 ?
            <p>{info[0]}<span style={{color: '#f7b52a'}}>英语</span>{info[1]}</p>
            :
            <p>{word}</p>
    }

    render() {
        return <div className="first placement-first">
            <div className="first-question" style={this.props.step <= 4 ? {borderBottom: '.5px solid #dfdfe4'} : {}}>
                <div>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg" alt=""/>
                </div>
                <div className="first-title">
                    {
                        this.props.step === 5 || this.props.step === 6 ?
                        this.renderWord(this.props.questions && this.props.questions.length ? this.props.questions[this.props.step - 1].title : '')
                            : this.props.questions[this.props.step - 1].title
                    }
                </div>
            </div>
            <div className="first-answer">
                {
                    this.props.step <= 3 &&
                    this.props.questions && this.props.questions.length &&
                    this.props.questions[this.props.step - 1] && this.props.questions[this.props.step - 1].items &&
                    this.props.questions[this.props.step - 1].items.length &&
                    this.props.questions[this.props.step - 1].items.map((item, index) => {
                        return <div className={  this.state.pressing === index ? "answer-item pressing" : "answer-item"}
                                    key={index}
                                    onTouchStart={() => this.touchStart(index)} onTouchEnd={this.touchEnd}
                                    onClick={(event) => this.props.saveAnswer(event, this.props.step - 1, item)}
                                    style={this.props.answers && this.props.answers.length && this.props.answers[this.props.step - 1] === item ? {
                                            color: 'white',
                                            border: '1px solid #ffd200',
                                            background: '#ffd200',
                                            fontWeight: '600'
                                        } : {}}>
                            <div className="item-content">
                                <p>{item}</p>
                            </div>
                        </div>
                    })
                }
                {
                    this.props.step === 4 && this.props.questions && this.props.questions.length &&
                    this.props.questions[3] && this.props.questions[3].title &&
                    <ImageModal select={this.props.saveAnswer} step={this.props.step} answers={this.props.answers}/>
                }
                {
                    this.props.step === 5 && this.props.questions && this.props.questions.length &&
                    this.props.questions[this.props.step - 1] && this.props.questions[this.props.step - 1].title &&
                    <PlacementRecorder step={this.props.step} answers={this.props.answers}
                                       open={this.props.open} onClose={this.props.onClose}
                                       avatar={this.props.avatar} handleUploadUrl={this.props.handleUploadUrl}
                                       setMessage={this.props.setMessage}
                    />
                }
                {
                    this.props.step === 6 && this.props.questions && this.props.questions.length &&
                    this.props.questions[this.props.step - 1] && this.props.questions[this.props.step - 1].title &&
                    <PlacementRecorder step={this.props.step} answers={this.props.answers}
                                       open={this.props.open} onClose={this.props.onClose}
                                       avatar={this.props.avatar} handleUploadUrl={this.props.handleUploadUrl}
                                       setMessage={this.props.setMessage}
                    />
                }
            </div>
        </div>
    }
}