import React, {Component} from 'react';
import Button50px from '../submitButton50px';
import './index.css';

class PopModal extends Component {
    stop(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render(){
        return (
            <div className="pop-modal" style={this.props.modal ? {} : {display: 'none'}} onClick={this.props.cancel}>
                <div className="pop-content" onClick={this.stop}>
                    <div className="attention">
                        {this.props.title}
                    </div>
                    <div className="attention-info">
                        {this.props.info}
                    </div>
                    <div className="chose-buttons">
                        <Button50px submit={this.props.cancel} text={this.props.cancelText} />
                        <p onClick={this.props.sure}>{this.props.sureText}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopModal;