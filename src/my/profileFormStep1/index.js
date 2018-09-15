import React from 'react';
import {MemberType} from "../../membership/member-type";
import ContactInfoStudent from '../contact-info-student';
import ContactInfoCompanion from '../contact-info-companion';

export default (props) => <div>
    {
        props.role === MemberType.Student &&
        <ContactInfoStudent profile={props.profile}
                            handleChange={props.handleChange} code={props.code}
                            handleCodeChange={props.handleCodeChange}
                            waitSec={props.waitSec}
                            mobileValid={props.mobileValid} sms={props.sms}
                            agreementCheck={props.agreementCheck}
                            agreement={props.agreement}
                            mobileCountry={props.mobileCountry}
                            send={props.send} withPhone={props.withPhone}
                            onCountryCodeChange={props.onCountryCodeChange}/>
    }
    {
        props.role === MemberType.Companion &&
        <ContactInfoCompanion profile={props.profile}
                              handleChange={props.handleChange}
                              code={props.code} withPhone={props.withPhone}
                              handleCodeChange={props.handleCodeChange}
                              waitSec={props.waitSec}
                              mobileValid={props.mobileValid} sms={props.sms}
                              emailValid={props.emailValid}
                              agreementCheck={props.agreementCheck}
                              agreement={props.agreement}
                              sendEmail={props.sendEmail}
                              send={props.send}
                              mobileCountry={props.mobileCountry}
                              onCountryCodeChange={props.onCountryCodeChange}/>
    }
</div>
