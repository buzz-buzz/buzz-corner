import React, {Component} from 'react';
import './index.css';

class ModalMessage extends Component {
    render() {
        return (
            <div className={this.props.modalName === 'error' ? 'error' : 'success'} style={this.props.modalShow ? {} : {display: 'none'}}>
                {this.props.modalContent}
            </div>
        );
    }
}

export default ModalMessage;