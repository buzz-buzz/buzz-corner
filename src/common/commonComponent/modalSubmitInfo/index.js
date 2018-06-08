import React, {Component} from 'react';
import Resources from '../../../resources';
import './index.css';

class ModalSubmitInfo extends Component {
    render() {
        return (
            <div className="modal-submit-info" style={this.props.modal ? {} : {display: 'none'}}>
                <div className="modal-info">
                    <img src={this.props.status === 1 ? "//cdn-corner.resource.buzzbuzzenglish.com/modal/icon_loading.svg" : ( this.props.status === 2 ? "//cdn-corner.resource.buzzbuzzenglish.com/modal/icon_successful_1.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/modal/icon_failure_1.svg")} alt=""/>
                    <p>{this.props.status === 1 ? Resources.getInstance().submitModalLoading : ( this.props.status === 2 ? Resources.getInstance().submitModalSuccess : Resources.getInstance().submitModalFailed)}</p>
                </div>
            </div>
        );
    }
}

export default ModalSubmitInfo;