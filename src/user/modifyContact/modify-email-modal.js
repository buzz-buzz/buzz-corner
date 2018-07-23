import React, {Component} from 'react';
import ModifyEmail from './modiy-email';
import './index.css';

class ModifyEmailModal extends Component {
    render() {
        return (
            <div className="modify-contact" onClick={this.props.closeModal}
                 style={this.props.modalShow === true ? {display: 'flex'} : {display: 'none'}}>
                <ModifyEmail new_email={this.props.new_email}
                             handleContactChange={this.props.handleContactChange}
                             code={this.props.code}
                             handleCodeChange={this.props.handleCodeChange}
                             emailValid={this.props.emailValid}
                             waitSec={this.props.waitSec}
                             sendEmail={this.props.sendEmail}
                             modifyCheck={this.props.modifyCheck}/>
            </div>
        );
    }
}

export default ModifyEmailModal;
