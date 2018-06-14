import React, {Component} from 'react';
import Button50px from '../submitButton50px';
import Resources from '../../../resources';
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
                        {Resources.getInstance().popTitle}
                    </div>
                    <div className="attention-info">
                        {Resources.getInstance().popInfo}
                    </div>
                    <div className="chose-buttons">
                        <Button50px submit={this.props.cancel} text={Resources.getInstance().popCancel} />
                        <p onClick={this.props.sure}>{Resources.getInstance().popSure}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopModal;