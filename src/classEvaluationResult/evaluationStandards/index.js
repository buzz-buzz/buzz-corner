import React from 'react';
import Back from '../../common/back';
import Resources from '../../resources';
import HeaderWithBack from '../../common/commonComponent/headerWithBack';
import './index.css';

export default class EvaluationStandards extends React.Component {
    constructor() {
        super();

        this.state = {
            active: ''
        };

        this.back = this.back.bind(this);
        this.openLevel = this.openLevel.bind(this);
    }

    back() {
        Back.back();
    }

    openLevel(event, index) {
        if (this.state.active !== index) {
            this.setState({
                active: index
            });
        } else {
            this.setState({
                active: ''
            });
        }
    }

    render() {
        return (
            <div className="evaluation-standard">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().evaluationStandard}/>
                <div className="standard-big-title">
                    <p className="main-title">IELTS Speaking assessment criteria</p>
                    <p className="little-title">(band descriptors – public version)</p>
                </div>
                <div className="standard-item">
                    <div className="standard-title" onClick={(event) => this.openLevel(event, 1)}
                         style={{borderLeft: '3px solid #ffd200'}}
                    >
                        <div className="tab-name">
                            Level 1
                        </div>
                        <div className={this.state.active === 1 ? "tab-status-active" : "tab-status"}></div>
                    </div>
                    {
                        this.state.active === 1 &&
                        <div className="line-middle"></div>
                    }
                    <div className="standard-content" style={{height: this.state.active === 1 ? 'auto' : 0}}>
                        <div className="content" style={{margin: '20px 0'}}>
                            <p>• No communication possible</p>
                            <p>• No rateable language</p>
                        </div>
                    </div>
                </div>
                <div className="standard-item">
                    <div className="standard-title" onClick={(event) => this.openLevel(event, 2)}
                         style={{borderLeft: '3px solid #6cd1fc'}}
                    >
                        <div className="tab-name">
                            Level 2
                        </div>
                        <div className={this.state.active === 2 ? "tab-status-active" : "tab-status"}></div>
                    </div>
                    {
                        this.state.active === 2 &&
                        <div className="line-middle"></div>
                    }
                    <div className="standard-content" style={{height: this.state.active === 2 ? 'auto' : 0}}>
                        <div className="title">Fluency and coherence</div>
                        <div className="content">
                            <p>• Pauses lengthily before most words</p>
                            <p>• Little communication possible</p>
                        </div>
                        <div className="title">Lexical resource</div>
                        <div className="content">
                             <p>• Only produces isolated words or memorised utterances</p>
                        </div>
                        <div className="title">Grammatical range and accuracy</div>
                        <div className="content">
                            <p>• Cannot produce basic sentence forms</p>
                        </div>
                        <div className="title">Pronunciation</div>
                        <div className="content">
                            <p>• Speech is often unintelligible</p>
                        </div>
                    </div>
                </div>
                <div className="standard-item">
                    <div className="standard-title" onClick={(event) => this.openLevel(event, 3)}
                         style={{borderLeft: '3px solid #f66d7a'}}
                    >
                        <div className="tab-name">
                            Level 3
                        </div>
                        <div className={this.state.active === 3 ? "tab-status-active" : "tab-status"}></div>
                    </div>
                    {
                        this.state.active === 3 &&
                        <div className="line-middle"></div>
                    }
                    <div className="standard-content" style={{height: this.state.active === 3 ? 'auto' : 0}}>
                        <div className="title">Fluency and coherence</div>
                        <div className="content">
                            <p>• Speaks with long pauses</p>
                            <p>• Has limited ability to link simple sentences</p>
                            <p>• Gives only simple responses and is frequently unable to convey basic message</p>
                        </div>
                        <div className="title">Lexical resource</div>
                        <div className="content">
                            <p>• Uses simple vocabulary to convey personal information</p>
                            <p>• Has insufficient vocabulary for less familiar topics</p>
                        </div>
                        <div className="title">Grammatical range and accuracy</div>
                        <div className="content">
                            <p>• Attempts basic sentence forms but with limited success, or relies on apparently memorised utterances</p>
                            <p>• Makes numerous errors except in memorised expressions</p>
                        </div>
                        <div className="title">Pronunciation</div>
                        <div className="content">
                            <p>• Shows some of the features of band 2 and some, but not all, of the positive features of band 4</p>
                        </div>
                    </div>
                </div>
                <div className="standard-item">
                    <div className="standard-title" onClick={(event) => this.openLevel(event, 4)}
                         style={{borderLeft: '3px solid #6ae108'}}
                    >
                        <div className="tab-name">
                            Level 4
                        </div>
                        <div className={this.state.active === 4 ? "tab-status-active" : "tab-status"}></div>
                    </div>
                    {
                        this.state.active === 4 &&
                        <div className="line-middle"></div>
                    }
                    <div className="standard-content" style={{height: this.state.active === 4 ? 'auto' : 0}}>
                        <div className="title">Fluency and coherence</div>
                        <div className="content">
                            <p>• Cannot respond without noticeable pauses and may speak slowly, with frequent repetition and self-correction</p>
                            <p>• Links basic sentences but with repetitious use of simple connectives and some breakdowns in coherence</p>
                        </div>
                        <div className="title">Lexical resource</div>
                        <div className="content">
                            <p>• Is able to talk about familiar topics but can only convey basic meaning on unfamiliar topics and makes frequent errors in word choice</p>
                            <p>• Rarely attempts paraphrase</p>
                        </div>
                        <div className="title">Grammatical range and accuracy</div>
                        <div className="content">
                            <p>• Produces basic sentence forms and some correct simple sentences but subordinate structures are rare</p>
                            <p>• Errors are frequent and may lead to misunderstanding</p>
                        </div>
                        <div className="title">Pronunciation</div>
                        <div className="content">
                            <p>• Uses a limited range of pronunciation features</p>
                            <p>• Attempts to control features but lapses are frequent</p>
                            <p>• Mispronunciations are frequent and cause some difficulty for the listener</p>
                        </div>
                    </div>
                </div>
                <div className="standard-item">
                    <div className="standard-title" onClick={(event) => this.openLevel(event, 5)}
                         style={{borderLeft: '3px solid #ffb117'}}
                    >
                        <div className="tab-name">
                            Level 5
                        </div>
                        <div className={this.state.active === 5 ? "tab-status-active" : "tab-status"}></div>
                    </div>
                    {
                        this.state.active === 5 &&
                        <div className="line-middle"></div>
                    }
                    <div className="standard-content" style={{height: this.state.active === 5 ? 'auto' : 0}}>
                        <div className="title">Fluency and coherence</div>
                        <div className="content">
                            <p>• Usually maintains flow of speech but uses repetition, self-correction and/or slow speech to keep going</p>
                            <p>• May over-use certain connectives and discourse markers</p>
                            <p>• Produces simple speech fluently, but more complex communication causes fluency problems</p>
                        </div>
                        <div className="title">Lexical resource</div>
                        <div className="content">
                            <p>• Manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility</p>
                            <p>• Attempts to use paraphrase but with mixed success</p>
                        </div>
                        <div className="title">Grammatical range and accuracy</div>
                        <div className="content">
                            <p>• Produces basic sentence forms with reasonable accuracy</p>
                            <p>• Uses a limited range of more complex structures, but these usually contain errors and may cause some comprehension problems</p>
                        </div>
                        <div className="title">Pronunciation</div>
                        <div className="content">
                            <p>• Shows all the positive features of band 4 and some, but not all, of the positive features of band 6</p>
                        </div>
                    </div>
                </div>
                <div className="standard-item">
                    <div className="standard-title" onClick={(event) => this.openLevel(event, 6)}
                         style={{borderLeft: '3px solid #813dfd'}}
                    >
                        <div className="tab-name">
                            Level 6
                        </div>
                        <div className={this.state.active === 6 ? "tab-status-active" : "tab-status"}></div>
                    </div>
                    {
                        this.state.active === 6 &&
                        <div className="line-middle"></div>
                    }
                    <div className="standard-content" style={{height: this.state.active === 6 ? 'auto' : 0}}>
                        <div className="title">Fluency and coherence</div>
                        <div className="content">
                            <p>• Is willing to speak at length, though may lose coherence at times due to occasional repetition,self-correction or hesitationn</p>
                            <p>• Uses a range of connectives and discourse markers but not always appropriately</p>
                        </div>
                        <div className="title">Lexical resource</div>
                        <div className="content">
                            <p>• Has a wide enough vocabulary to discuss topics at length and make meaning clear in spite of inappropriateness</p>
                            <p>• Generally paraphrases successfully</p>
                        </div>
                        <div className="title">Grammatical range and accuracy</div>
                        <div className="content">
                            <p>• Uses a mix of simple and complex structures, but with limited flexibility</p>
                            <p>• May make frequent mistakes with complex structures, though these rarely cause comprehension problems</p>
                        </div>
                        <div className="title">Pronunciation</div>
                        <div className="content">
                            <p>• Uses a range of pronunciation features with mixed control</p>
                            <p>• Shows some effective use of features but this is not sustained</p>
                            <p>• Can generally be understood throughout, though mispronunciation of individual words or sounds reduces clarity at times</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}