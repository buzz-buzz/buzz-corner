import React, {Component} from 'react';
import Resources from '../../resources';
import {MemberType} from "../../membership/member-type";
import Button50px from '../../common/commonComponent/submitButton50px';
import './index.css';

class ModifyContact extends Component {
    render() {
        return (
            <div className="modify-contact"  onClick={this.props.closeModal} style={this.props.modalShow === true ? {display: 'flex'}:{display: 'none'}}>
                {
                    this.props.role === MemberType.Student &&
                    <div className="form-content" onClick={(e)=>{e.stopPropagation();}}>
                        <div className="form-title">{Resources.getInstance().userUpdatephone}</div>
                        <input className="full-input" type="text" placeholder={Resources.getInstance().profilePhoneHolder}
                               style={{width: '100%'}}
                               value={this.props.new_phone || ''}
                               onChange={this.props.handleContactChange}
                               name='phone'/>
                        <div className="two-items">
                            <input className="left-input" type="text" placeholder={Resources.getInstance().profilePhoneLabel}
                                   value={this.props.code || ''}
                                   onChange={this.props.handleCodeChange}
                                   name='code'/>
                            <button className={ this.props.mobileValid && this.props.waitSec <= 0? 'right-button light' : 'right-button'}
                                    disabled={!this.props.mobileValid || this.props.waitSec > 0} onClick={this.props.sms}
                            >{this.props.waitSec || Resources.getInstance().profilePhoneCheck}</button>
                        </div>
                        <Button50px disabled={!this.props.mobileValid || this.props.code.length !== 4}  text={Resources.getInstance().profileSunmitBtn} submit={this.props.modifyCheck}/>
                    </div>
                }
                {
                    this.props.role === MemberType.Companion &&
                    <div className="form-content"  onClick={(e)=>{e.stopPropagation();}}>
                        <div className="form-title">Modify email</div>
                        <input className="full-input" type="text" placeholder={Resources.getInstance().emailLabel}
                               style={{width: '100%'}}
                               value={this.props.new_email || ''}
                               onChange={this.props.handleContactChange}
                               name='email'/>
                        <div className="two-items">
                            <input className="left-input" type="text" placeholder={Resources.getInstance().profilePhoneLabel}
                                   value={this.props.code || ''}
                                   onChange={this.props.handleCodeChange}
                                   name='code'/>
                            <button className={ this.props.emailValid && this.props.waitSec <= 0 ? 'right-button light' : 'right-button'}
                                    disabled={!this.props.emailValid || this.props.waitSec > 0} onClick={this.props.sendEmail}
                            >{this.props.waitSec || Resources.getInstance().profilePhoneCheck}</button>
                        </div>
                        <Button50px disabled={!this.props.emailValid || this.props.code.length !== 4} text={Resources.getInstance().profileSunmitBtn}  submit={this.props.modifyCheck}/>
                    </div>
                }
            </div>
        );
    }
}

export default ModifyContact;