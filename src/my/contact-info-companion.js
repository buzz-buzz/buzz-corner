import React from 'react';
import QiniuDomain from "../common/systemData/qiniuUrl";
import Resources from "../resources";
import BuzzInput from "../common/commonComponent/buzzInput";
import PhoneNumber from './phone-number';
import {Button} from "semantic-ui-react";

export default (props) =>
    (<div className="form-content">
        <BuzzInput type="text" placeholder='User Name'
                   value={props.profile ? props.profile.student_en_name : ''}
                   onChange={props.handleChange}
                   name='student_en_name'
        />

        <PhoneNumber profile={props.profile} handleChange={props.handleChange}
                     code={props.code} handleCodeChange={props.handleCodeChange}
                     waitSec={props.waitSec} mobileValid={props.mobileValid}
                     sms={props.sms} send={props.send}
                     onCountryCodeChange={props.onCountryCodeChange}
                     mobileCountry={props.mobileCountry}/>

        <div className="phone-number">
            <Button>Email</Button>
            <BuzzInput type="text" placeholder='eg: xxx@gmail.com'
                       width="60%"
                       value={props.profile.email}
                       onChange={props.handleChange}
                       name='email'
            />
        </div>

        <div className="agreement" onClick={props.agreementCheck}>
            <img
                src={props.agreement === true ? QiniuDomain + "/icon_select_active.png" : QiniuDomain + "/icon_select.png"}
                alt=""/>
            <span>{Resources.getInstance().profileAgreement}</span>
        </div>
    </div>)
