import React, {Component} from 'react';
import './index.css';

export default class ModalClassPractiseWord extends Component{
    render(){
        return (
            <div className="class-practise-word"  style={this.props.modal ? {display: 'flex'} : {display: 'none'}} onClick={this.props.closeModal}>
                <div className="class-practise-content">
                    <div>
                        <div className="title">
                            <p>{this.props.title}</p>
                        </div>
                        <div className="practise-info">
                            <p>{this.props.content}</p>
                        </div>
                        <div className="btn">
                            <div onClick={this.props.closeModal}>
                                <p>{this.props.btnText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}