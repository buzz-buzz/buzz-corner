import React, {Component} from 'react';
import ModifyMobile from './modify-mobile';
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
                              modifyCheck={this.props.modifyCheck}
                              mobileCountry={this.props.mobileCountry}
                              onCountryCodeChange={this.props.onCountryCodeChange}/>
            </div>
        );
    }
}

export default ModifyMobileModal;
