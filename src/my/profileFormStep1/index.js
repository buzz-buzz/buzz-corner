import './index.css'
import Resources from '../../resources';
import React from 'react';
import {Button} from 'semantic-ui-react';
import {MemberType} from "../../membership/member-type";

export default class ProfileFormStep1 extends React.Component {
    render() {
        return (
            this.props.role === MemberType.Student
                ?
                (<div className="form-content">
                    <div className="parents-name">
                        <input type="text" placeholder={Resources.getInstance().profileParentsName}
                               style={{width: '100%'}}
                               value={this.props.profile.parent_name}
                               onChange={this.props.handleChange}
                               name='parent_name'/>
                    </div>
                    <div className="phone-number">
                        <Button>{Resources.getInstance().profilePhoneInfo}</Button>
                        <input type="number" style={{width: '60%'}}
                               value={this.props.profile.phone}
                               placeholder={Resources.getInstance().profilePhoneHolder}
                               onChange={this.props.handleChange}
                               name='phone'/>
                    </div>
                    <div className="check-number">
                        <input type="text"
                               value={this.props.code}
                               onChange={this.props.handleCodeChange} disabled={!this.props.mobileValid}
                               style={{width: '60%'}}
                               placeholder={Resources.getInstance().profilePhoneCheck}/>
                        <Button style={{padding: 0}} onClick={this.props.sms}
                                disabled={!this.props.mobileValid || this.props.waitSec > 0}>{this.props.waitSec || Resources.getInstance().profilePhoneCheck}</Button>
                    </div>
                    <div className="agreement" onClick={this.props.agreementCheck}>
                        <img
                            src={this.props.agreement === true ? "//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select_active.png" : "//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select.png"}
                            alt=""/>
                        <span>{Resources.getInstance().profileAgreement}</span>
                    </div>
                </div>)
                :
                (<div className="form-content">
                    <div className="parents-name">
                        <input type="text" placeholder='User Name'
                               style={{width: '100%'}}
                               value={this.props.profile.student_en_name}
                               onChange={this.props.handleChange}
                               name='student_en_name'/>
                    </div>
                    <div className="parents-name" style={{margin: '10px 0'}}>
                        <input type="text" placeholder='Email'
                               style={{width: '100%'}}
                               value={this.props.profile.email}
                               onChange={this.props.handleChange}
                               name='email'/>
                    </div>
                    <div className="agreement" onClick={this.props.agreementCheck}>
                        <img
                            src={this.props.agreement === true ? "//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select_active.png" : "//resource.buzzbuzzenglish.com/image/buzz-corner/icon_select.png"}
                            alt=""/>
                        <span>{Resources.getInstance().profileAgreement}</span>
                    </div>
                </div>)
        )
    }
}