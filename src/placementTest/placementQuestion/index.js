import React from 'react';
import Resources from '../../resources';
import './index.css';

export default class PlacementQuestion extends React.Component {
    render() {
        return <div className="first placement-first">
            <div className="first-question">
                <div>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg" alt=""/>
                </div>
                <div className="first-title">
                    <p>{ this.props.questions && this.props.questions.length ? this.props.questions[this.props.step - 1].title : ''}</p>
                </div>
            </div>
            <div className="first-answer">
                <div className="answer-title"
                     style={{fontSize: '.8em'}}>{Resources.getInstance().placementSelectWord}</div>
                {
                    this.props.questions && this.props.questions.length &&
                    this.props.questions[this.props.step - 1] && this.props.questions[this.props.step - 1].items &&
                    this.props.questions[this.props.step - 1].items.length &&
                    this.props.questions[this.props.step - 1].items.map((item, index) => {
                        return <div className="answer-item" key={index}
                                    style={this.props.answers && this.props.answers.length && this.props.answers[this.props.step - 1] === (index === 0 ? 'A' : (index === 1 ? 'B' : 'C')) ? {
                                            color: 'rgb(246, 180, 12)',
                                            border: '1px solid rgb(246, 180, 12)'
                                        } : {}}>
                            <div className="item-value">
                                <p>{index === 0 ? 'A' : (index === 1 ? 'B' : 'C')}</p>
                            </div>
                            <div className="item-content">
                                <p>{item}</p>
                            </div>
                            <button className="click-event"
                                    name={this.props.step + '' + (index === 0 ? 'A' : (index === 1 ? 'B' : 'C'))}
                                    onClick={this.props.answering}>hidden
                            </button>
                        </div>
                    })
                }
            </div>
        </div>
    }
}