import React from 'react';
import {browserHistory} from 'react-router';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import './index.css';

export default class EvaluationStandards extends React.Component {
    constructor() {
        super();

        this.state = {
            levels: [
                {
                    name: 'Level 1',
                    content: 'level 1 is ...'
                },
                {
                    name: 'Level 2',
                    content: 'level 2 is ...'
                },
                {
                    name: 'Level 3',
                    content: 'level 3 is ...'
                },
                {
                    name: 'Level 4',
                    content: 'level 4 is ...'
                },
                {
                    name: 'Level 5',
                    content: 'level 5 is ...'
                },
                {
                    name: 'Level 6',
                    content: 'level 6 is ...'
                }
            ],
            active: ''
        };

        this.back = this.back.bind(this);
        this.openLevel = this.openLevel.bind(this);
    }

    back() {
        if (window.history.length > 2) {
            window.history.go(-1);
        } else {
            browserHistory.push('/');
        }
    }

    openLevel(event, index) {
        if(this.state.active !== index){
            this.setState({
                active: index
            });
        }else{
            this.setState({
                active: ''
            });
        }
    }

    render() {
        return (
            <div className="evaluation-standard">
                <HeaderWithBack goBack={this.back} title='评分标准说明'/>
                <div className="standard-big-title">
                    <p className="main-title">IELTS Speaking assessment criteria</p>
                    <p className="little-title">(band descriptors – public version)</p>
                </div>
                {
                    this.state.levels && this.state.levels.length &&
                    this.state.levels.map((item, index) => {
                        return <div className="standard-item" key={index}>
                            <div className="standard-title" onClick={(event) => this.openLevel(event, index)}>
                                <div className="tab-name">
                                    {item.name}
                                </div>
                                <div className={ index === this.state.active ? "tab-status-active" : "tab-status"}></div>
                            </div>
                            <div className="standard-content" style={{height: this.state.height || 0}}>
                                {item.content}
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}