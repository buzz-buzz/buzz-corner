import Resources from "../resources";
import React from "react";
import {Button} from "semantic-ui-react";
import BuzzInput from "../common/commonComponent/buzzInput";
import Mobile from '../common/commonComponent/mobileCountryCode';
import './dropdown-ui.css'

export default (props) =>
    <div>
        <div className="phone-number">
            <Mobile value={props.mobileCountry}  style={props.style ? props.style : {}} onCountryCodeChange={props.onCountryCodeChange} />
            <BuzzInput type="number"
                       placeholder={Resources.getInstance().profilePhoneHolder}
                       value={props.profile.phone}
                       onChange={props.handleChange}
                       name='phone'
            />
        </div>
        {
            !props.codeModalNone &&
            <div className="check-number">
                <BuzzInput type="text"
                           placeholder={Resources.getInstance().profilePhoneLabel}
                           value={props.code}
                           onChange={props.handleCodeChange}
                />
                <Button style={props.waitSec || !props.mobileValid ? {
                        padding: 0,
                        color: '#fff',
                        background: '#dfdfe4',
                        borderRadius: '10px'
                    } : {
                        padding: 0,
                        color: 'white',
                        borderRadius: '10px'
                    }} onClick={props.sms}
                        disabled={!props.mobileValid || props.waitSec > 0}>
                    {props.waitSec ? Resources.getInstance().profilePhoneSend + '(' + props.waitSec + ')' :
                        ( props.send ? Resources.getInstance().profilePhoneCheckAgain : Resources.getInstance().profilePhoneCheck)}
                </Button>
            </div>
        }
    </div>
