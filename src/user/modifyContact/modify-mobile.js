import React from 'react';
import Resources from "../../resources";
import Button50px from '../../common/commonComponent/submitButton50px';

export default (props) => (<div className="form-content" onClick={(e) => {
    e.stopPropagation();
}}>
    <div className="form-title">{Resources.getInstance().userUpdatephone}</div>
    <input className="full-input" type="text"
           placeholder={Resources.getInstance().profilePhoneHolder}
           style={{width: '100%'}}
           value={props.new_phone || ''}
           onChange={props.handleContactChange}
           name='phone'/>
    <div className="two-items">
        <input className="left-input" type="text"
               placeholder={Resources.getInstance().profilePhoneLabel}
               value={props.code || ''}
               onChange={props.handleCodeChange}
               name='code'/>
        <button
            className={props.mobileValid && props.waitSec <= 0 ? 'right-button light' : 'right-button'}
            disabled={!props.mobileValid || props.waitSec > 0}
            onClick={props.sms}
        >{props.waitSec || Resources.getInstance().profilePhoneCheck}</button>
    </div>
    <Button50px
        disabled={!props.mobileValid || props.code.length !== 4}
        text={Resources.getInstance().profileSunmitBtn}
        submit={props.modifyCheck}/>
</div>)
