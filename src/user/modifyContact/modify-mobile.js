import React from 'react';
import Resources from "../../resources";
import Button50px from '../../common/commonComponent/submitButton50px';
import Mobile from '../../common/commonComponent/mobileCountryCode';

export default (props) => (<div className="form-content" onClick={(e) => {
    e.stopPropagation();
}}>
    <div className="form-title">{props.title || Resources.getInstance().userUpdatephone}</div>

    <div className="two-items">
        <Mobile value={props.mobileCountry} style={{background: '#f4f5f9', borderColor: 'transparent', color: '#666'}}
                styleParent={{marginBottom: '10px'}} onCountryCodeChange={props.onCountryCodeChange} />
        <input className="full-input" type="text"
               placeholder={Resources.getInstance().profilePhoneHolder}
               value={props.new_phone || ''}
               onChange={props.handleContactChange}
               name='phone'/>
    </div>
    <div className="two-items">
        <input className="left-input" type="text"
               placeholder={Resources.getInstance().profilePhoneLabel}
               value={props.code || ''}
               onChange={props.handleCodeChange}
               name='code'/>
        <button
            style={props.waitSec || !props.mobileValid || !props.new_phone ? {
                    color: '#fff',
                    background: '#dfdfe4'
                } : {
                    color: 'white'
                }}
            disabled={!props.mobileValid || props.waitSec > 0 || !props.new_phone}
            onClick={props.sms}
        >{props.waitSec ? Resources.getInstance().profilePhoneSend + '(' + props.waitSec + ')' :
                ( props.send ? Resources.getInstance().profilePhoneCheckAgain : Resources.getInstance().profilePhoneCheck)}
        </button>
    </div>
    <Button50px
        disabled={!props.mobileValid || props.code.length !== 4}
        text={Resources.getInstance().validate}
        submit={props.modifyCheck}/>
</div>)
