import Resources from '../../resources';
import React from 'react';
import {Button} from 'semantic-ui-react';
import BuzzInput from '../../common/commonComponent/buzzInput';
import {MemberType} from "../../membership/member-type";
import QiniuDomain from '../../common/systemData/qiniuUrl';

export default class ProfileFormStep1 extends React.Component {
    render() {
        return (
            this.props.role === MemberType.Student
                ?
                (<div className="form-content">
                    <BuzzInput type="text" placeholder={Resources.getInstance().profileParentsName}
                               value={this.props.profile.parent_name}
                               onChange={this.props.handleChange}
                               name='parent_name'
                    />
                    <div className="phone-number">
                        <Button>{Resources.getInstance().profilePhoneInfo}</Button>
                        <BuzzInput type="number" placeholder={Resources.getInstance().profilePhoneHolder}
                                   width="60%"
                                   value={this.props.profile.phone}
                                   onChange={this.props.handleChange}
                                   name='phone'
                        />
                    </div>
                    <div className="check-number">
                        <BuzzInput type="text" placeholder={Resources.getInstance().profilePhoneLabel}
                                   width="60%"
                                   value={this.props.code}
                                   onChange={this.props.handleCodeChange}
                        />
                        <Button style={ this.props.waitSec ? {padding: 0, color: '#000'} : ( this.props.mobileValid ? {padding: 0, color: 'white'} : {padding: 0, color: '#666'})} onClick={this.props.sms}
                                disabled={!this.props.mobileValid || this.props.waitSec > 0}>{this.props.waitSec || Resources.getInstance().profilePhoneCheck}</Button>
                    </div>
                    <div className="agreement" onClick={this.props.agreementCheck}>
                        <img
                            src={this.props.agreement === true ? QiniuDomain + "/icon_select_active.png" : QiniuDomain + "/icon_select.png"}
                            alt=""/>
                        <span>{Resources.getInstance().profileAgreement}</span>
                    </div>
                </div>)
                : (this.props.role === MemberType.Companion
                    ?
                (<div className="form-content">
                    <BuzzInput type="text" placeholder='User Name'
                               value={this.props.profile.student_en_name}
                               onChange={this.props.handleChange}
                               name='student_en_name'
                    />
                    <div className="phone-number">
                        <Button>Email</Button>
                        <BuzzInput type="text" placeholder='eg: xxx@gmail.com'
                                   width="60%"
                                   value={this.props.profile.email}
                                   onChange={this.props.handleChange}
                                   name='email'
                        />
                    </div>
                    <div className="check-number">
                        <BuzzInput type="text" placeholder={Resources.getInstance().profilePhoneCheck}
                                   width="60%"  disabled={!this.props.emailValid}
                                   value={this.props.code}
                                   onChange={this.props.handleCodeChange}
                        />
                        <Button style={ this.props.waitSec ? {padding: 0, color: '#000'} : {padding: 0, color: 'white'}} onClick={this.props.sendEmail}
                                disabled={!this.props.emailValid || this.props.waitSec > 0}>{this.props.waitSec || Resources.getInstance().profilePhoneCheck}</Button>
                    </div>
                    <div className="agreement" onClick={this.props.agreementCheck}>
                        <img
                            src={this.props.agreement === true ? QiniuDomain + "/icon_select_active.png" : QiniuDomain + "/icon_select.png"}
                            alt=""/>
                        <span>{Resources.getInstance().profileAgreement}</span>
                    </div>
                </div>) : <div></div>
                )
        )
    }
}