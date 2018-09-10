import React from 'react';
import Resources from "../../resources";
import Button50px from '../../common/commonComponent/submitButton50px';

export default (props) => (
    <div className="form-content" onClick={(e) => {
        e.stopPropagation();
    }}>
        <div className="form-title">Modify email</div>
        <input className="full-input" type="text"
               placeholder={Resources.getInstance().emailLabel}
               style={{width: '100%'}}
               value={props.new_email || ''}
               onChange={props.handleContactChange}
               name='email'/>
        <div className="two-items">
            <input className="left-input" type="text"
                   placeholder={Resources.getInstance().profilePhoneLabel}
                   value={props.code || ''}
                   onChange={props.handleCodeChange}
                   name='code'/>
            <button
                style={props.waitSec || !props.emailValid || !props.new_email ? {
                        color: '#fff',
                        background: '#dfdfe4'
                    } : {
                        color: 'white'
                    }}
                disabled={!props.emailValid || props.waitSec > 0 || !props.new_email}
                onClick={props.sendEmail}
            >{props.waitSec ? Resources.getInstance().profilePhoneSend + '(' + props.waitSec + ')' :
                ( props.send ? Resources.getInstance().profilePhoneCheckAgain : Resources.getInstance().profilePhoneCheck)}</button>
        </div>
        <Button50px
            disabled={!props.emailValid || props.code.length !== 4}
            text={Resources.getInstance().profileSunmitBtn}
            submit={props.modifyCheck}/>
    </div>)
