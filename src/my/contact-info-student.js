import React from 'react';
import QiniuDomain from "../common/systemData/qiniuUrl";
import Resources from "../resources";
import BuzzInput from "../common/commonComponent/buzzInput";
import PhoneNumber from './phone-number';

export default (props) => (<div className="form-content">
    <BuzzInput type="text"
               placeholder={Resources.getInstance().profileParentsName}
               value={props.profile ? props.profile.parent_name : ''}
               onChange={props.handleChange}
               name='parent_name'
    />
    <PhoneNumber profile={props.profile} handleChange={props.handleChange}
                 code={props.code} handleCodeChange={props.handleCodeChange}
                 waitSec={props.waitSec} mobileValid={props.mobileValid}
                 sms={props.sms} send={props.send}
                 mobileCountry={props.mobileCountry}
                 onCountryCodeChange={props.onCountryCodeChange}/>
    <div className="agreement" onClick={props.agreementCheck}>
        <img
            src={props.agreement === true ? QiniuDomain + "/placement/icon_select_active.svg" : QiniuDomain + "/placement/icon_select.svg"}
            alt=""/>
        <span>{Resources.getInstance().profileAgreement}</span>
    </div>
</div>)
