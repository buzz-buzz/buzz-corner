import React, {Component} from 'react';
import './index.css';

class ModalClassBegin extends Component {
    render() {
        return (
            <div className="modal" style={this.props.modal ? {display: 'flex'} : {display: 'none'}} onClick={this.props.closeModal}>
                <div className="content">
                    <div>
                        <div className="welcome-title">
                            <p>{this.props.title}</p>
                        </div>
                        <div className="welcome-info">
                            <p>{this.props.content1}</p>
                            <p>{this.props.content2}</p>
                        </div>
                        <div className="begin">
                            <div onClick={this.props.begin}>
                                <p>{this.props.btnWord}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalClassBegin;