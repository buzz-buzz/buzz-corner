import React, {Component} from 'react';
import {MemberType} from "../../membership/member-type";
import ModifyMobile from './modify-mobile';
import ModifyEmail from './modiy-email';
import './index.css';

class ModifyMobileModal extends Component {
    render() {
        return (
            <div className="modify-contact" onClick={this.props.closeModal}
                 style={this.props.modalShow === true ? {display: 'flex'} : {display: 'none'}}>
                <ModifyMobile new_phone={this.props.new_phone}
                              handleContactChange={this.props.handleContactChange}
                              code={this.props.code}
                              handleCodeChange={this.props.handleCodeChange}
                              mobileValid={this.props.mobileValid}
                              waitSec={this.props.waitSec}
                              sms={this.props.sms}
                              modifyCheck={this.props.modifyCheck}/>
                {
                    this.props.role === MemberType.Companion && false &&
                    <ModifyEmail new_email={this.props.new_email}
                                 handleContactChange={this.props.handleContactChange}
                                 code={this.props.code}
                                 handleCodeChange={this.props.handleCodeChange}
                                 emailValid={this.props.emailValid}
                                 waitSec={this.props.waitSec}
                                 sendEmail={this.props.sendEmail}
                                 modifyCheck={this.props.modifyCheck}/>
                }
            </div>
        );
    }
}

export default ModifyMobileModal;
